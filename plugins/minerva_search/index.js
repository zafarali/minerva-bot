var q = require('q');
var parser = require('./parser.js');
var search = require('./search.js');
var parse_data = require('./lib.js').parse_data;
var year_to_season = require('./lib.js').year_to_season;

var __request = require('../../utils.js').__request;
var array_utils = require('../../utils.js').arrays;
var chat_builders = require('../../chat_utils.js').builders;

function minerva_search(context){

	if(context.completed){
		return context;
	}
	var deferred = q.defer();
	var current_query = context.current_query
	var parsed = parser.parse(current_query);
	var extracted = parsed[0];
	if(!extracted){
		context.replies.push('I work better if you ask me something more descriptive... Let me know if you need HELP!');
		return context;
	}
	var url_queries = parsed[1];
	console.log('extracted:',extracted)
	context.history['extracted'] = context.history['extracted'].concat(extracted);


	// console.log(url_queries)
	if(url_queries.length > 0){

		__request(url_queries, function(responses){

			var total_responses = 0;
			var url, response;
			
			var too_many_results = {
				condition:false,
				tuples:[],
				examples:[]
			};


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
				var course_names = Object.keys(courses)
				var number_of_courses = course_names.length;

				if(number_of_courses > 3){
					
					// handle the case with too many results!
					too_many_results.condition = true;
					too_many_results.tuples.push([year_to_season( url.substr(-6,6) ), number_of_courses])
					// add some examples of the search results to display later.

					for (var i = 0; i < 3; i++) {
						too_many_results.examples.push( courses[course_names[i]][0].title );
					}

					total_responses+=1;

				}else if(number_of_courses > 0){
					// less than 3 courses have been returned, but we have atleast one candidate!

					total_responses+=1;
					var year = url.substr(-6,6);

					// if( url.match('&sel_subj=&sel_crse=') ){

					for(var course_name in courses) {
						var course = courses[course_name];
						var number_of_sections = course.length;
						
						if(number_of_sections === 1){
							// if only one section do the usual:...
							context.replies.push(create_bot_reply(course[0], year));
						}else{
							// if more than one section we give some more details about each.
							context.replies = context.replies.concat(create_multi_section_reply(course, year));
						}

					}// end multi section reply

					// } else {
					// 	var first_course = courses[0]
						
					// 	context.replies.push(create_bot_reply(first_course, year))

					// 	context.history['last_course'] = {
					// 		subject:first_course.subject, 
					// 		code:first_course.course_code,
					// 		CRN:first_course.CRN,
					// 		year:year
					// 	}

					// }//end query replies
				}//end check for course lengths
			} // end forloop

	
			// here we deal with having too many courses returned...			
			for (var i = 0, bot_reply_builder = 'I found '; i < too_many_results.tuples.length; i++) {

				var semester = too_many_results.tuples[i][0];
				var num_results = too_many_results.tuples[i][1];
				bot_reply_builder = bot_reply_builder + num_results+' in the '+semester+', '
				
				if(i === too_many_results.tuples.length-1){
					bot_reply_builder = bot_reply_builder+'for "'+extracted.join(' ')+'".';
					context.replies.push(bot_reply_builder);

					// give examples of the search results.
					bot_reply_builder = 'Some of them were ';

					// select only the uniqe ones.
					too_many_results.examples = array_utils.unique(too_many_results.examples);

					for (var j = 0; j < too_many_results.examples.length; j++) {
						bot_reply_builder = bot_reply_builder + '"' +too_many_results.examples[j]+'"';
						
						if(too_many_results.examples.length > 2 && j !== too_many_results.examples.length-2){
							bot_reply_builder = bot_reply_builder+', ';
						}else if(too_many_results.examples.length > 1){
							bot_reply_builder += ' and ';
						}
					}
					bot_reply_builder += '.';
					context.replies.push(bot_reply_builder);
					context.replies.push('Try something more specific?');
				}
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

function create_multi_section_reply(sections, year){
	var bot_reply = "I found "+sections.length+" sections for "+sections[0].subject+sections[0].course_code+", "+sections[0].title+", in the "+year_to_season(year)+":";

	var elements = [];
	
	for (var i = 0; i < sections.length; i++) {
		var section = sections[i];
		var capacity_response = '';

		if(parseInt(section.WLcapacity) > 0 ){
			// no space in this...
			capacity_response = array_utils.random_choice([" I think it is full :(", " It might be full..."]);

		}else if(parseInt(section.WLcapacity) > 0 && parseInt(section.WLremain) > 0 ){

			capacity_response = array_utils.random_choice(
				[" There are spots on the waitlist!", 
				" There is space on the waitlist!"]);
		}

		elements.push({
			title:'Section '+(i+1)+ (section.instructor !== 'TBA' ? ' with '+section.instructor : ''),
			subtitle: "On "+section.days+" at "+section.time+" in "+section.location+capacity_response,
			buttons:[
				['postback', 'Give me a summary.', 'more@'+section.subject+','+section.course_code+','+section.CRN+','+year],
				['web_url', 
				'Section page', 
				'https://horizon.mcgill.ca/pban1/bwckschd.p_disp_listcrse?term_in='+year+'&subj_in='+section.subject+'&crse_in='+section.course_code+'&crn_in='+section.CRN
				]
			]
		});
	}

	return [ bot_reply, chat_builders.generic_response(elements) ];
}

function create_bot_reply(course, year){

	var bot_reply = "In " + year_to_season( year ) + ", "
	+ course.subject+ course.course_code + " is " +
	course.title+" It takes place on "+course.days+
	" at "+course.time+" in "+course.location+ 
	" taught by "+course.instructor+".";
	
	if(parseInt(course.WLcapacity) > 0 && parseInt(course.WLremain) === 0){
		// no space in this...
		bot_reply = bot_reply+array_utils.random_choice([" I think it is full :(", " It might be full..."]);
	}else if(parseInt(course.WLcapacity) > 0 && parseInt(course.WLremain) > 0 ){

		bot_reply = bot_reply + array_utils.random_choice(
			[" There are spots in the waitlist!", 
			" The waitlist is not full!"])
	}

	bot_reply = chat_builders.structured_response(
		bot_reply,
		[
			['postback', 'Give me a summary.', 'more@'+course.subject+','+course.course_code+','+course.CRN+','+year], //summary request
			['web_url', 'Go to course page', 
			'https://horizon.mcgill.ca/pban1/bwckschd.p_disp_listcrse?term_in='+year+
			'&subj_in='+course.subject+'&crse_in='+course.course_code+'&crn_in='+course.CRN] //link
		])
	return bot_reply;
}

module.exports = minerva_search;
