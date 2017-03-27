var jsonfile = require('jsonfile');
var lunr = require('lunr');
var natural = require('natural');
var cheerio = require('cheerio');
var request = require('request');

var course_mappings = jsonfile.readFileSync('./course_mapping.json').subject_mappings;
natural.PorterStemmer.attach();

var index = lunr(function(){
	this.field('subject_title', {boost:100});
	this.field('subject_code', {boost:100});
	this.ref('subject_code');
})

for (var i = 0; i < course_mappings.length; i++) {
	index.add(course_mappings[i]);
}

function clean(query){
	var level = query.match(/\d{3}(\s|\-)(level)/i)[0].substr(0,3);

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

var queries = [
	'200 level computer science course in fall 2015'
];


for (var i = 0; i < queries.length; i++) {
	var cleaned = clean(queries[i]);
	console.log('cleaned:',cleaned);
	var result = index.search(cleaned.query);
	console.log(result);
	var canonical_url = 'http://www.mcgill.ca/study/2017-2018/courses/search?'+
			'sort_by=field_course_title&f[0]=field_subject_code%3A'+
			result[0].ref+'&f[1]=course_level%3A'+cleaned.level;
	console.log(canonical_url);
	request(canonical_url, function(error, response, body){
		var $ = cheerio.load(body);
		console.log('courses found:',$('.current-search-item-text').text().match(/[0-9]{2}/));
		$('.views-row').each(function(i,e){
			var elements = $(e).children();
			var link = 'http://www.mcgill.ca'+$(e).find('a').attr('href');
			if(elements.eq(4).text().trim() !== 'Not Offered'){
				console.log('Title:',elements.eq(0).text().trim());
				console.log('Year:',elements.eq(4).text().trim());
				console.log('Link:',link);
			}
		});
	})
}

jsonfile.writeFileSync('./subject_index.json',index)