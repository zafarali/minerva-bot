// search builds at McGill.
var jsonfile = require('jsonfile');
var lunr = require('lunr');
var request = require('request');

var path = require('path');
var utils = require('../../utils.js');
var chat_builders = require('../../chat_utils.js').builders;

var building_index = lunr.Index.load(jsonfile.readFileSync(path.resolve('./plugins/building_search', 'building_index.json')));
// var building_index = lunr.Index.load(jsonfile.readFileSync(path.resolve('./', 'building_index.json')));
var buildings = require('./BUILDINGS.js').BUILDINGS;


var natural = require('natural')
natural.LancasterStemmer.attach();

function building_search(context){
	if(context.completed){
		return context;
	}

	var query = context.location_search ? context.location_search : context.current_query;
	
	if(context.postback){
		// we have receieved a deep link from somewhere else.
		if(context.postback.substr(0,6) === 'where@'){
			query = context.postback.split('where@')[1];
			context.completed = true;
		}

	}	

	query = clean_query(query);

	var search_results = building_index.search(query);

	if(search_results.length > 0){
		context.completed = true;
		
		var shortlist = [];

		if(search_results.length > 1){
			// more that 1 result found, we find the ones that 
			// are VERY simillar.
			for (var i = 0, best_score = search_results[0].score; 
				i < search_results.length; i++) {
				
				if(search_results[i].score - best_score < 0.1){
					// very close results..
					shortlist.push(search_results[i])
				}
			}

			context.replies.push(
				utils.arrays.random_choice([
						'I found a bunch of places that might match:',
						'I wasn\'t sure what you were looking for. Here is what I could find:' ,
						'Are any of these what you were looking for?' 
					]));
			// process many results
		}else{
			// only 1 search result
			shortlist = search_results;
			context.replies.push(
				utils.arrays.random_choice(
					['Here you go:', 
					'This is what I could find:', 
					'I think this is what you\'re looking for!']));
		}


		var elements = [];
		var contains_caf = false;

		for (var i = 0; i < shortlist.length; i++) {
			var building_result = buildings[shortlist[i].ref];
			if(!building_result){
				continue;
			}
			console.log(shortlist);
			var subtitle = '';
			subtitle += building_result.cafeteria ? 'Cafeterias: '+building_result.cafeteria.join(', ')+'. ' : '';
			subtitle +=	building_result.library ? 'Libraries: '+building_result.library.join(', ')+'. ' : '';
			subtitle += '\n'+ (building_result.address ? building_result.address : '')
			subtitle += subtitle === '' ? 'No information available right now.' : ''

			if(building_result.cafeteria){
				contains_caf = true;
			}
			var prepared = {
				title: building_result.full_name,
				subtitle: subtitle,
			};

			var buttons = []; //holder for buttons so we don't return empty buttons array

			if(building_result.image){
				prepared['image_url'] = building_result.image;
			}

			if(building_result.link){
				buttons.push(['web_url', 'Building Information', building_result.link ])
			}
			if(building_result.address){
				buttons.push(['web_url', 'Get Directions', 'https://www.google.com/maps?saddr=My+Location&daddr='+building_result.address])
			}
			if(building_result.library_link){
				buttons.push(['web_url', 'Library Page', building_result.library_link]);
			}

			// add the buttons to the prepared element only if it contains more than one link
			if(buttons.length > 0){
				prepared['buttons'] = buttons;
			}
			elements.push(prepared);
		}

		context.replies.push(chat_builders.generic_response(elements));

		if(contains_caf){
			context.replies.push(chat_builders.structured_response(utils.arrays.random_choice('It seems I found some cafeterias too.', 'Want to see cafeteria hours?', 'There are cafeterias too, want to see their timings?'], [['web_url', 'Show hours', 'https://www.mcgill.ca/foodservices/locations/hours-service']]))
		}

	}


	return context;

}

function clean_query(query){
	return query.replace(/(food|open|close|time|hour|day|week)[^\s]*/gi, '');
}

module.exports = building_search;