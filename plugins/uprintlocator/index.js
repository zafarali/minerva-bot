// search printers at McGill.
var jsonfile = require('jsonfile');
var lunr = require('lunr');
var request = require('request');
var path = require('path');
var utils = require('../../utils.js');
var chat_builders = require('../../chat_utils.js').builders;
var natural = require('natural')
natural.LancasterStemmer.attach();


var printer_regex = /([u]?print[a-z]*)/gi;

var uprint_index = lunr.Index.load(jsonfile.readFileSync(path.resolve('./plugins/uprintlocator', 'uprint_index.json')));
// var uprint_index = lunr.Index.load(jsonfile.readFileSync(path.resolve('./', 'uprint_index.json')));
// var building_index = lunr.Index.load(jsonfile.readFileSync(path.resolve('../building_search', 'building_index.json')));

var building_index = lunr.Index.load(jsonfile.readFileSync(path.resolve('./plugins/building_search', 'building_index.json')));
var buildings = require('../building_search/BUILDINGS.js').BUILDINGS;
var uprints = jsonfile.readFileSync(path.resolve('./plugins/uprintlocator', 'uprints_json.json')).uprints

function is_uprint_query(query){
	var matches = query.match(printer_regex);
	return matches && matches.length > 0;
}

function uprint_search(context){
	if(context.completed){
		context.history['uprints'] = [];
		return context;
	}

	if(context.postback){
		if(context.postback.substr(0,11) === 'moreuprint@'){
			if(context.history['uprints'] && context.history['uprints'].length > 0){
				context.replies.push('More uPrint locations:')
				uprint_release(context);
			}else{
				context.replies.push('I can\'t seem to remember those uPrint locations... Try again?');
			}
			context.completed = true;
			return context;
		}
	}else{
		var query = context.current_query;
		if(is_uprint_query(query)){

			context.completed = true;

			query = query.replace(printer_regex, '');
			query = query.tokenizeAndStem().join(' ');

			// search the building index first
			var building_result = building_index.search(query);

			var uprint_results = []
			if( building_result.length > 0 ){
				// for each building result we search the uprint index:
				// context.replies.push('I found some printers in '
				// 	+ (building_result.length > 1 ? 'multiple buildings.' : buildings[building_result[0]].full_name))+'.';
				building_result.forEach(function(building){
					var results = uprint_index.search(building.ref);
					var full_name = buildings[building.ref].full_name;

					if(results.length > 0){
						results.forEach(function(result){
							uprint_result = uprints[result.ref];
							uprint_results.push({
								title: uprint_result.location +' in '+full_name,
								subtitle: (parseInt(uprint_result.color) ? 'Color Printing ' : 'Black and White Printing ')+'. '+uprint_result.department,
								buttons:[
									['postback','Where is it?','where@'+building.ref]
								]
							})
						});
					}
				});

				if(uprint_results.length === 0){
					context.replies.push(
						utils.arrays.random_choice(
							['I couldn\'t find any printers there.',
							'Not sure if there are any printers there :(',
							'I was not able to find any printers over there. Try another building?'
							]));
				}else{
					context.history['uprints'] = uprint_results;
					context.replies.push('Here are printers I could find:');
					uprint_release(context);
				}
			}else{
				context.replies.push(
					utils.arrays.random_choice(
						['I\'m not sure which building you are referring to... :(', 
						'Not sure where on campus that is!',
						'I couldn\'t find that building.']));
			}
		}		
	}

	return context;
}

function uprint_release(context){
	context.completed = true;
	var to_be_released = context.history['uprints'];
	var elements = [];
	var number_to_release = Math.min(to_be_released.length, 10);
	// release 10 printer results at a time...
	for(var i = 0; i < number_to_release; i++){
		elements.push(to_be_released.shift());
	}

	context.replies.push(chat_builders.generic_response(elements));

	if(to_be_released.length > 0){
		context.replies.push(
			chat_builders.structured_response(
				'I have '+to_be_released.length+' more printers. '+utils.arrays.random_choice(['Would you like to see more?', 'A few more?', 'Would you like to see them?']), 
				[ ['postback', 'Yes', 'moreuprint@'] ]
			)
		);
	}
}

module.exports = uprint_search;