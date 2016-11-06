var jsonfile = require('jsonfile');
var lunr = require('lunr');
var path = require('path')
var chat_builders = require('../../chat_utils.js').builders;

var major_index = lunr.Index.load(jsonfile.readFileSync(path.resolve('./plugins/major_search', 'majors_index.json')));
// var major_index = lunr.Index.load(jsonfile.readFileSync(path.resolve('./', 'majors_index.json')));
var majors = jsonfile.readFileSync(path.resolve('./plugins/major_search','./majors.json')).majors;

// console.log('\n\n')
// search_results = .search('biology');
// console.log('number of results:',search_results.length)
// search_results.forEach(result => {
// 	console.log(majors[result.ref]);	

// })


function major_search(context){
	if(context.completed || !context.extracted){
		return context;
	}

	var to_search = context.extracted.join(' ')
	to_search = to_search.replace('program', '')
	var search_results = major_index.search(to_search);

	var number_to_return = Math.min(search_results.length, 10);

	if(number_to_return > 0 ){
		var elements = []

		for (var i = 0; i < number_to_return; i++) {
			var result = majors[search_results[i].ref];

			elements.push({
				title: result.title,
				subtitle: 'Department of '+result.department+'. '+result.level+' program.',
				buttons:[
					['web_url', 'Program page', result.link],
					['element_share']
				]			
			})
		}

		context.replies = ['I found '+search_results.length+' possible programs! Here were the top '+(search_results.length >= 10 ? '10 ' : '' )+'choices' ];
		context.replies.push(chat_builders.generic_response(elements));
	}

	return context;
}

module.exports = major_search;