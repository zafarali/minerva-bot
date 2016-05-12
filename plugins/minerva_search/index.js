var q = require('q');
var parser = require('./parser.js');
var search = require('./search.js');
var parse_data = require('./lib.js').parse_data;
var year_to_season = require('./lib.js').year_to_season;

var __request = require('../../utils.js').__request;

function minerva_search(context){
	if(context.completed){
		return context;
	}
	var deferred = q.defer();
	var current_query = context.current_query
	var parsed = parser.parse(current_query);
	var extracted = parsed[0];
	var url_queries = parsed[1];
	console.log('extracted:',extracted)
	context.history['extracted'] = context.history['extracted'].concat(extracted);
	// console.log(url_queries)
	if(url_queries.length > 0){

		__request(url_queries, function(responses){

			var total_responses = 0;
			var url, response;
			// console.log(responses);
			for (var url_id = 0; url_id < url_queries.length; url_id++ ){
				// using this forces us to go in order that the queries were parsed.
				// i.e fall first, then winter.
				
				url = url_queries[url_id];
				// console.log(url);
				response = responses[url];

				if(!response){continue;}
				if(response.error){
					//error encountered in one of the requests...
					// deferred.reject(error);
					console.log('error occured in ',url,'. error was', response.error);
					throw Error(response.error);
				}

				var bot_reply;
				var courses = parse_data(response.body);

				if(courses.length > 5){
					bot_reply = "I found "+courses.length+" courses in the "+year_to_season( url.substr(-6,6) )+"! Try a more specific query.";
					context.replies.push(bot_reply);
					total_responses+=1;

				}else if(courses.length > 0){
					total_responses+=1;
					if( url.match('&sel_subj=&sel_crse=') ){
						// generic search query, return everything
						for (var i = 0; i < courses.length; i++) {
							var first_course = courses[i];
							bot_reply = "In " + year_to_season( url.substr(-6,6) ) + ", "
							+ first_course.subject+ first_course.course_code + " is " +
							first_course.title+" It happens on "+first_course.days+
							" between "+first_course.time+". The professor(s) "+first_course.instructor+
							" teach at "+first_course.location;		

							context.replies.push(bot_reply)
						};
					} else {
						// @TODO update this to show different sections.
						var first_course = courses[0];
						// converts year to season // last bit of the 
						// string contains information about the semester
						bot_reply = "In " + year_to_season( url.substr(-6,6) ) + ", "
						+ first_course.subject+ first_course.course_code + " is " +
						first_course.title+" It happens on "+first_course.days+
						" between "+first_course.time+". The professor(s) "+first_course.instructor+
						" teach at "+first_course.location;
						// console.log(bot_reply);
						// args.replies.push(bot_reply);
						context.replies.push(bot_reply)
					}//end query replies
				}//end check for course lengths
			}

			if(total_responses===0){
				context.replies.push('I couldn\'t find any results for "'+extracted.join(' ')+'" :( Try another query?');
			}
			deferred.resolve(context)
		});
	}else{
		deferred.resolve(context);
	}

	return deferred.promise

	// return result.then(function(){
	// 	var deferred = q.defer();
	// 	// nothing returned, just echo back that we couldn't find any courses.
	// 	if(args.replies.length === 0){
	// 		args.replies.push("I couldn\'t find any courses for that in the fall or winter :(")
	// 		context.reply = args.replies[args.replies.length-1];
	// 	}else{
	// 		context.reply = args.replies.join('\n');
	// 	}
	// 	deferred.resolve(context)
	// 	return deferred.promise;

	// }, function(err){
	// 	// reply the error
	// 	args.replies.push('I\'m sorry, something went wrong with the search');
	// 	console.log('Error occured:', err);
	// 	deferred.reject(context)

	// });

	// return deferred.promise;
}


module.exports = minerva_search;
