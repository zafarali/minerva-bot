var request = require('request');
var cheerio = require('cheerio');
var jsonfile = require('jsonfile');

var canonical_url = 'http://www.mcgill.ca/study/2017-2018/programs/search?search_api_views_fulltext=&sort_by=search_api_relevance&page=';


var storage = [];
var last_page;
var counter = 0;
function scrape(page){
	var url = canonical_url + page;
	request(url, function(error, response, body){
		console.log('scraping page: '+page)
		var $ = cheerio.load(body);
		$('.views-row').each(function(i,e){
		
			var degree = {};
			degree['id'] = counter;
			degree['title'] = $(e).children().eq(0).text().trim();
			degree['department'] = $(e).children().eq(2).text().trim();
			degree['level'] = $(e).children().eq(3).text().trim();
			degree['link'] = 'http://www.mcgill.ca'+$(e).find('a').attr('href');
			counter = counter + 1;
			storage.push(degree);
		});

		if(!last_page){
			//last page is not defined yet, need to define it.
			last_page = parseInt($('.pager-last a').attr('href').substr(-2,2));
			console.log('total pages:',last_page);
		}
		console.log('saved',counter,'courses so far');
		if(page === last_page){
			// save data
			jsonfile.writeFile('./majors.json',{majors:storage}, function(err){
				if(err){
					console.log('error occured',err);
				}else{
					console.log('saved!');
				}
			});
		} else {
			page = page + 1;
			scrape(page);
		}
	})
}

scrape(0)


// });