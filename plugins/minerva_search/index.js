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
	if(context.postback){
		// we have receieved a deep link from somewhere else.
		if(context.postback.substr(0,7) === 'search@'){
			current_query = context.postback.split('search@')[1];
		}
	}

	var parsed = parser.parse(current_query);
	var extracted = parsed[0];
	if(!extracted){
		return context;
	}
	var url_queries = parsed[1];
	console.log('extracted:',extracted)

	if(context.current_query.match('program') && !context.current_query.match('programming')){
		context.extracted = extracted;
		return context;
	}

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

				// console.log(courses);

				var too_many_results_local = false;
				var close_matches = [];

				if(number_of_courses > 3){
					context.completed=true;

					// handle the case with too many results!
					// first we need to check if this is in fact EXACTLY what we are looking for...
					var matched = false;

					for (var i = 0; i < course_names.length; i++) {
						var potential_name = courses[course_names[i]][0].title;
						potential_name = potential_name.toLowerCase().replace('.', '');
						var to_be_matched = extracted[0].toLowerCase().replace('.', '');
						// console.log('potential:',potential_name)
						// console.log('to_be_matched:',to_be_matched)
						// console.log('partial match:',potential_name.match(to_be_matched));
						if( to_be_matched === potential_name ){
							// this is an exact match, thus we must return it!
							course_names = [ course_names[i] ];
							matched = true;
						}else if(potential_name.match(to_be_matched)){
							// we had a pretty good match, give the user an alternative choice..

							close_matches.push(potential_name)
						}

						if( i === course_names.length-1 && !matched){
							too_many_results_local = true;
							too_many_results.condition = true;
						}
					}

					if(too_many_results_local){

						too_many_results.tuples.push([year_to_season( url.substr(-6,6) ), number_of_courses])
						// add some examples of the search results to display later.

						for (var i = 0; i < 3; i++) {
							too_many_results.examples.push( courses[course_names[i]][0].title );
						}

						total_responses+=1;
					}
				}

				// console.log('matched:',course_names)
				// console.log('closematches:',close_matches)
				if(number_of_courses > 0 && !too_many_results_local){
					context.completed=true;

					total_responses+=1;
					var year = url.substr(-6,6);

					// if( url.match('&sel_subj=&sel_crse=') ){

					for(var id in course_names) {
						// added this extra abstraction for showing multiple courses.
						var course_name = course_names[id];
						var course = courses[course_name];
						if(!course){ continue; }
						var number_of_sections = course.length;
						total_responses += number_of_sections;
						if(number_of_sections === 1){
							// if only one section do the usual:...
							context.replies.push(create_bot_reply(course[0], year));
						}else{
							// if more than one section we give some more details about each.
							context.replies = context.replies.concat(create_multi_section_reply(course, year));
						}

						if(close_matches.length){
							// more than 1 close match.
							var bot_reply = 'I also found: '
							for (var j = 0; j < close_matches.length; j++) {
								bot_reply += close_matches[j];
								if(j+1 < close_matches.length){
									// there is a next element:
									bot_reply+=', ';
								}
							}
							context.replies.push(bot_reply)
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
					
					var easy_click_options = [];

					for (var j = 0; j < too_many_results.examples.length; j++) {
						bot_reply_builder = bot_reply_builder + '"' +too_many_results.examples[j]+'"';
						
						if(too_many_results.examples[j].length < 20){
							easy_click_options.push([ too_many_results.examples[j], '@'] )
						}else{
							easy_click_options.push([ too_many_results.examples[j].substr(0,17)+'...', 'search@'+too_many_results.examples[j] ])
						}


						if(too_many_results.examples.length > 2 && j !== too_many_results.examples.length-2){
							bot_reply_builder = bot_reply_builder+', ';
						}else if(too_many_results.examples.length > 1){
							bot_reply_builder += ' and ';
						}
					}
					bot_reply_builder += '.';
					context.replies.push(bot_reply_builder);
					if(easy_click_options.length === 0){
						context.replies.push('Try something more specific?');
					}else{
						context.replies.push(
							chat_builders.quick_reply(
								array_utils.random_choice(['Any of these look like what you were looking for?', 'One of these perhaps?']),
								easy_click_options
								)
							)
					}
				}
				total_responses += 1;
			}			
			if(total_responses===0){
				context.completed=false;
				context.extracted = extracted;
				context.replies.push('I couldn\'t find any results for "'+extracted.join(' ')+'" :( Try another query?');
			}else{
				var opinion = context.current_query.match(/(hard|easy|ez|difficult|bad|good)[^\s]*/g);
				if(opinion && opinion.length > 0){
					context.replies.push(opinion[0]+'? '+array_utils.random_choice(['Unfortunately I wouldn\'t know that...', 'I have not taken the course myself!', 'I\'ll take it soon. Ask me then?']))
				}

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
				['postback', 'Where is it?', 'where@'+section.location.split(' ')[0]],
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

	// var bot_reply = "In " + year_to_season( year ) + ", "
	// + course.subject+ course.course_code + " is " +
	// course.title+" It takes place on "+course.days+
	// " at "+course.time+" in "+course.location+ 
	// " taught by "+course.instructor+".";
	
	// if(parseInt(course.WLcapacity) > 0 && parseInt(course.WLremain) === 0){
	// 	// no space in this...
	// 	bot_reply = bot_reply+array_utils.random_choice([" I think it is full :(", " It might be full..."]);
	// }else if(parseInt(course.WLcapacity) > 0 && parseInt(course.WLremain) > 0 ){

	// 	bot_reply = bot_reply + array_utils.random_choice(
	// 		[" There are spots in the waitlist!", 
	// 		" The waitlist is not full!"])
	// }
	var reply_title = year_to_season( year )+' '+course.subject+course.course_code+': ' + course.title;
	var reply_subtitle = '⏰: '+course.days+' at '+course.time+'\n🏛: '+course.location+'\n👥: '+course.instructor;

	if(reply_title.length > 80){
		reply_title = reply_title.substr(0,77)+'...';
	}
	
	if(reply_subtitle.length > 80){
		reply_subtitle = reply_subtitle.substr(0, 77) + '...';	
	}
	
	var elements = [{
			title: reply_title,
			subtitle: reply_subtitle,
			buttons:[
					['postback', 'More information', 'more@'+course.subject+','+course.course_code+','+course.CRN+','+year], //summary request
					['web_url', 'Go to course page', 
						'https://horizon.mcgill.ca/pban1/bwckschd.p_disp_listcrse?term_in='+year+
						'&subj_in='+course.subject+'&crse_in='+course.course_code+'&crn_in='+course.CRN], //link
					['element_share']
			]			
			}]

	var bot_reply = chat_builders.generic_response(elements)
	// bot_reply = chat_builders.structured_response(
	// 	bot_reply,
	// 	[
	// 		['postback', 'More information.', 'more@'+course.subject+','+course.course_code+','+course.CRN+','+year], //summary request
	// 		['postback', 'Directions', 'where@'+course.location.split(' ')[0]],
	// 		['element_share']
	// 		// ['web_url', 'Go to course page', 
	// 		// 'https://horizon.mcgill.ca/pban1/bwckschd.p_disp_listcrse?term_in='+year+
	// 		// '&subj_in='+course.subject+'&crse_in='+course.course_code+'&crn_in='+course.CRN] //link
	// 	])
	return bot_reply;
}

module.exports = minerva_search;
