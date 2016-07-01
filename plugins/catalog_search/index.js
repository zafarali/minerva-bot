// search majors and all courses.
var jsonfile = require('jsonfile');
var lunr = require('lunr');
var natural = require('natural');
var cheerio = require('cheerio');
var request = require('request');
var q = require('q');
var path = require('path');
var utils = require('../../utils.js');
var chat_builders = require('../../chat_utils.js').builders;

var subject_index = lunr.Index.load(jsonfile.readFileSync(path.resolve('./plugins/catalog_search', 'subject_index.json')));


function catalog_search(context){
	if(context.completed){
		context.history['catalog_search'] = [];
		return context;
	}

	var deferred = q.defer();
	
	var current_query = context.current_query;
	var skip_postback = false;
	if(context.postback){
		// if(context.postback.split()))
		if(context.postback.substr(0,10) === 'catsearch@'){
			extracted = context.postback.split('catsearch@')[1].split('|')
			current_query = extracted[0]+' level '+ extracted[1]
			skip_postback = true;
		}
	}
	if(context.postback && !skip_postback){
		// we have receieved a deep link from somewhere else.
		// console.log(context.postback.substr(0,7))

		if(context.postback.substr(0,2) === 'cc'){
			if(context.history['catalog_search'] && context.history['catalog_search'].length > 0){
				context.replies = ['Here\'s a few more:'];
				course_release(context, deferred);	
			}else{
				context.replies = ['I can\'t remember all those courses anymore... :(']
				deferred.resolve(context);
			}
			
		}

	}else{
		

		if(current_query.match('level') || current_query.match(/(year.?\d)|(\d(st|nd|rd|th).?year)/gi) || current_query.match(/(u\d)\b/gi)){

			var minor_clean = context.current_query.replace(/(course|courses)/gi, '');
			minor_clean = minor_clean.replace(/(year.?\d)|(\d(st|nd|rd|th).?year)/gi, '');
			minor_clean = minor_clean.replace(/(u\d)\b/gi, '');			
			minor_clean = minor_clean.tokenizeAndStem().join(' ')
			context.replies = [ chat_builders.quick_reply(
				'Seems like you\'re asking me about courses for a certain level?', 
				[
					['100-level', 'catsearch@100|'+minor_clean],
					['200-level', 'catsearch@200|'+minor_clean],
					['300-level', 'catsearch@300|'+minor_clean],
					['400-level', 'catsearch@400|'+minor_clean],
					['500-level', 'catsearch@500|'+minor_clean],
					['600-level', 'catsearch@600|'+minor_clean]
				]
				) ]
		}

		var cleaned = clean(current_query);
		if(!cleaned.level){
			// this is not a search for a XXX-level course...
			return context;
		}
		context.history['catalog_search'] = [];

		var result = subject_index.search(cleaned.query);

		if(result.length > 0){
			console.log(result);
														//@ TODO remove the hard coding in this...?
			var canonical_url = 'http://www.mcgill.ca/study/2016-2017/courses/search?sort_by='+
				'field_course_title&f[0]=field_subject_code%3A'+result[0].ref+'&f[1]=course_level%3A'+cleaned.level;
			
			var courses = [];

			scrape(context, deferred, result[0].ref, cleaned.level, 0, courses)
		}else{
			return context;
		}
	}

	return deferred.promise;
}

function scrape(context, deferred, subject, level, page, courses, last_page){
	
	var canonical_url = 'http://www.mcgill.ca/study/2016-2017/courses/search?sort_by=field_course_title&f[0]=field_subject_code%3A'+subject+'&f[1]=course_level%3A'+level+'&page='+page;

	request(canonical_url, function(error, response, body){
		var $ = cheerio.load(body);
		
		if(error){
			context.replies.push('An error occured when I was searching for courses... :(')
			deferred.resolve(context);
			return;
		}
		// here we are overriding previous replies
		// because we assume that minerva_search failed.
		// should probably add a skip condition if user types "level"
		
		$('.views-row').each(function(i,e){
			var elements = $(e).children();
			var link = 'http://www.mcgill.ca'+$(e).find('a').attr('href');
			if(elements.eq(4).text().trim() !== 'Not Offered'){
				
				courses.push({
					title:elements.eq(0).text().trim(),
					years:elements.eq(4).text().trim(),
					link: link
				});
			}
		});



		if(!last_page){
			//last page is not defined yet, need to define it.
			try{
				// console.log('last page:',)
				// var 
				last_page = parseInt($('.pager-last a').attr('href').match(/page=\d*/)[0].replace('page=', ''));

			}catch(e){
				// no more links to search...
				last_page = 0;
				// console.log(e);
				// context.replies = ['Something went wrong when I was looking...'];
				// no_error = false;
				// deferred.resolve(context);
			}
			// return;
		}


			if(page === last_page){
				scrape_handle(context, deferred, courses);
			}else{
				page = page + 1;
				scrape(context, deferred, level, subject, page, courses, last_page);
			}

	});
}


function course_release(context, deferred){
	var to_be_released = context.history['catalog_search'];

	var elements = [];
	
	var number_to_release = Math.min(to_be_released.length, 10);
	// release courses 10 at a time:
	for (var i = 0; i < number_to_release; i++) {

		var current_element = to_be_released.shift();

		elements.push({
			title: current_element.title,
			subtitle: "Available during "+current_element.years,
			buttons:[
				['postback', 'Find times', 'search@'+current_element.title.substr(0,8)],
				['web_url', 'Course Page', current_element.link ]
			]
		});
	}

	context.replies.push(chat_builders.generic_response(elements));

	if(to_be_released.length > 0 ){
		// "show me more button"

		context.replies.push(
			chat_builders.quick_reply(
				'I have '+to_be_released.length+' more courses. '+utils.arrays.random_choice(['Would you like to see more?', 'A few more?', 'Would you like to see them?']), 
				[ [ 'Yes', 'cc@more'] ]
			)
		);
	}

	context.completed = true;
	//resolve the promise!
	deferred.resolve(context);

}
function scrape_handle(context, deferred, courses){

	if(courses.length > 0){
		context.replies = [ 'I found '+courses.length+' results. Here\'s '+ Math.min(courses.length, 10)+' of them:' ];
		context.history['catalog_search'] = courses;
		course_release(context, deferred);
	}else{
		context.replies = ['I could\'t find anything...'];
		deferred.resolve(context);
	}
}


function clean(query){
	// this function cleans the query to some extent
	// and returns level and year if it is given
	var level;
	try{
		level = query.match(/\d{3}(\s|\-)(level)/i)[0].substr(0,3);
	}catch(e){
		level = undefined;
	}

	var year;
	try{
		year = query.match(/(fall|winter|summer)\s2[0-9]{3}/i)[0];
	}catch(e){
		year = undefined;
	}
	query = query.replace(/\d{3}(\s|\-)(level)/i,'')
	query = query.replace(/(fall|winter|summer)\s2[0-9]{3}/i,'')
	query = query.replace(/course(s)*/i,'')
	return { 
		query:query.tokenizeAndStem().join(' '),
		year: year,
		level:level
	}
}


module.exports = catalog_search;