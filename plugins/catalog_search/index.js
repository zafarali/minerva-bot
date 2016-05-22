// search majors and all courses.
var jsonfile = require('jsonfile');
var lunr = require('lunr');
var natural = require('natural');
var cheerio = require('cheerio');
var request = require('request');

var subject_index = jsonfile.readFileSync(path.resolve('./', 'subject_index.json');

function catalog_search(context){
	if(context.completed){
		return context;
	}

	var current_query = context.current_query;

	var cleaned = clean(current_query);
	if(!cleaned.level){
		// this is not a search for a XXX-level course...
		return context;
	}


	var result = index.search(cleaned.query);
	if(result.length > 0){
		console.log(result);
													//@ TODO remove the hard coding in this...?
		var canonical_url = 'http://www.mcgill.ca/study/2016-2017/courses/search?sort_by=field_course_title&f[0]=field_subject_code%3A'+result[0].ref+'&f[1]=course_level%3A'+cleaned.level;
		
		var courses = [];

		scrape(result[0].ref, cleaned.level, 0, courses)
	}


}

function scrape(level, subject, page, courses, last_page){
	var canonical_url = 'http://www.mcgill.ca/study/2016-2017/courses/search?sort_by=field_course_title&f[0]=field_subject_code%3A'+subject+'&f[1]=course_level%3A'+level+'&page='+page;
	request(canonical_url, function(error, response, body){
		var $ = cheerio.load(body);
		
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
			last_page = parseInt($('.pager-last a').attr('href').substr(-2,2));
		}

		if(page === last_page){
			return courses;
		}else{
			page = page + 1;
			scrape(level, subject, page, courses, last_page);
		}

	})
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