var natural = require('natural')
var WORDS = require('../WORDS.js').WORDS;
var utils = require('../../utils.js');
var request = require('request');
var cheerio = require('cheerio');
var q = require('q');


function show_more(context){
	// tokenize
	var tokenized_input = context.current_query.toLowerCase().split(' ');
	if(context.postback){
		var is_show_me_query = context.postback.substr(0,5) === 'more@'
	}
	// check if the array contains 'show more' somewhere
	if( ( utils.arrays.contains(tokenized_input, 'more') 
		&& ( utils.arrays.contains(tokenized_input, 'show') ||
			utils.arrays.contains(tokenized_input, 'tell') ) ) || 
		( context.postback && is_show_me_query ) ) {

		// set the context as resolved
		context.completed = true;

		var course = false;
		if(is_show_me_query){
			// split the data
			var data_split = context.postback.substr(5,8).split(',')
			//create a holder object
			course = { subject:data_split[0], code:data_split[1] }

		}else if(context.history['last_course']){
			course = context.history.last_course;
		}
		// check if the user has already searched something
		if(course){
			// create a promise

			var deferred = q.defer();

			// @TODO: to more loose matching here

			var url = 'http://www.mcgill.ca/study/2016-2017/courses/'+course.subject+'-'+course.code;
			
			request(url, function(error, response, body){
				if(error){
					context.replies.push('Something went wrong when I was looking... Sorry!');
					throw Error(error)
				}
				context.history.last_course = null;
				var $ = cheerio.load(body);
				if(!$('.node-catalog > .content > p').eq(0).text().split(':')[1]){
					context.replies.push('Unforunately, McGill has no more information available about this one...')
				}else{
					context.replies.push('Showing you more about '+course.subject+' '+course.code+':');
					context.replies.push($('.node-catalog > .content > p').eq(0).text().split(':')[1]);
				}
				deferred.resolve(context);
			});

			return deferred.promise;
		}else{
			context.replies = ['Ask about a course first... ;)'];
			return context;
		}
	}else{
		return context;
	}
}

module.exports = show_more;
