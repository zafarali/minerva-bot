var request = require('request');
var q = require('q');
var parse_data = require('./lib.js').parse_data;
var prepare_query = require('./lib.js').prepare_query;
var year_to_season = require('./lib.js').year_to_season;

function query_execute(args){
	// var year = args.years.pop();
	// console.log(args.queries);
	var deferred = q.defer();
	// var query =  || query;
	var query = args.queries.pop();
	// console.log(args.queries)

	request(query, function (error, response, body) {
		if(error){
			deferred.reject(error);
		}
		var bot_reply;
		var courses = parse_data(body);

		if(courses.length > 5){
			bot_reply = "I found "+courses.length+" courses in the "+year_to_season( query.substr(-6,6) )+"! Try a more specific query.";
			args.replies.push(bot_reply);
			deferred.resolve(args);

		}else if(courses.length > 0){
			if( query.match('&sel_subj=&sel_crse=') ){
				// generic search query, return everything
				for (var i = 0; i < courses.length; i++) {
					var first_course = courses[i];
					bot_reply = "In " + year_to_season( query.substr(-6,6) ) + ", "
					+ first_course.subject+ first_course.course_code + " is " +
					first_course.title+" It happens on "+first_course.days+
					" between "+first_course.time+". The professor(s) "+first_course.instructor+
					" teach at "+first_course.location;					
					args.replies.push(bot_reply)
				};
			} else {

			var first_course = courses[0];
			// converts year to season // last bit of the 
			// string contains information about the semester
			bot_reply = "In " + year_to_season( query.substr(-6,6) ) + ", "
			+ first_course.subject+ first_course.course_code + " is " +
			first_course.title+" It happens on "+first_course.days+
			" between "+first_course.time+". The professor(s) "+first_course.instructor+
			" teach at "+first_course.location;
			// console.log(bot_reply);
			// args.replies.push(bot_reply);
			args.replies.push(bot_reply)
			}
			deferred.resolve(args);
		}else{
			// args.replies.push("I'm sorry I couldn't find any courses for that in the "+year_to_season( query.substr(-6,6) )+" :(");
			deferred.resolve(args);
		}
		// deferred.resolve(args);
	});

	return deferred.promise;
}
function generate_query_by_subject_code(subject, code, year){
	// hard coded for now
	var years = typeof year !== 'undefined' ?  [year] : ['201605','201609','201701'];
	var queries = [];
	for (var i = 0; i < years.length; i++) {
		queries.push(prepare_query(years[i], subject, code))
	};
	return queries;
}

function generate_query_by_title(title, year){
	// hard coded for now
	var years = typeof year !== 'undefined' ?  [year] : ['201605','201609','201701'];
	var queries = [];
	title = title.substr(0,30);
	for (var i = 0; i < years.length; i++) {
		queries.push( prepare_query(years[i], '', '', title) )
	};
	return queries;
}

exports.query_execute = query_execute;
exports.generate_query_by_subject_code = generate_query_by_subject_code;
exports.generate_query_by_title = generate_query_by_title;
