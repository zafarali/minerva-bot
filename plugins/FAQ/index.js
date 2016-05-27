var request = require('request');
var cheerio = require('cheerio');
var search_url = 'http://www.mcgill.ca/search/mcgill/';
var lunr = require('lunr');
var jsonfile = require('jsonfile');
var utils = require('../../utils.js');
var chat_utils = require('../../chat_utils.js');
var q = require('q');


function FAQ_search(context){
  if(context.completed){
	return context;
  }
  

  var deferred = q.defer();


  var results = [];
  var links = [];
  var titles = {};
  var pdfs = [];

  var original_query = context.current_query;
  console.log('original query:',original_query);
  var query = encodeURI(context.current_query);
  // replace(/(are|can|i|do|it|was|in|me|you|where|how|what|that|when|is)[^\s]*/gi, '')
  console.log('FAQ query:',query);

request( search_url+query, function(error, response, body){
	if(error){
		
	  // failed our search... resolve!
	  deferred.resolve(context);
	  return
	}
	// did not fail, got some juicy queries.

	var $ = cheerio.load(body);
	var count = 0;

	$('.search-results').children().each(function (i,e){


	  // extract title and links
	  var title = $(e).find('.title').text().trim();
	  var link = $(e).find('a').attr('href');

	  // only pick top three results for time purposes.
	  if(count<4){

		// we do some matching, if the title doesn't contain any of the words from the query, discard it.
		var r = new RegExp('('+original_query.split(' ').join('|')+')','gi')
		if(title.match(r) && link.substr(-3,3) !== 'pdf' && !link.match('/study/')){
		  links.push(link);
		  titles[link] = title;
		  count += 1;
		}
		if(link.substr(-3,3) === 'pdf'){
		  // save pdfs separately.
		  pdfs.push([link, title]);
		}
	  }
	});

	if(links.length === 0){
	  // no search results!
	  console.log('no links')
	  deferred.resolve(context);
	}

	// now go and search each of those links, get all the responses at the same time!...
	utils.__request(links, function(responses){

		// for each of the links...
		for (var url_id = 0; url_id < links.length; url_id++ ){

		  url = links[url_id];

		  // load the response
		  var response = responses[url];

		  if(!response){continue;}
		  if(response.error){
			//error encountered in one of the requests...
			console.log('error occured in ',url,'. error was', response.error);
			// throw Error(response.error);
		  }

		  // parse the query and save it into our results.
		  results.push(parse(response.body, titles[url], url, url_id));
		}

		var best_result = execute_index_search(results, original_query);

		if(best_result.length === 0){
		  console.log('no best results')
		  deferred.resolve(context);
		  return;
		}
		
		var top_choices = [];
		var top_score = best_result[0].score;

		best_result.forEach(function(res){
		  if(top_score - res.score < 0.2){
			// console.log('score:',res.score);
			top_choices.push(results[res.ref]);
		  }
		});

		context.completed = true;
		

		// for now just show the top most choice,
		// in the future we should change this to show
		// preferentially the result with a list...
		
		if(top_choices.length > 0){
		  context.replies = ['This is the best result I could find: ' + top_choices[0].title.split('|')[0]]
		  // add in the summary

		  context.replies.push(
			chat_utils.builders.structured_response(
			  top_choices[0].summary.substr(0,300), 
			  [
				['web_url', 'Open Link', top_choices[0].link],
				['postback', '👍', 'feedback@good'],
				['postback', '👎', 'feedback@bad']
			  ]
			)
		  )

			if(top_choices[0].list.length > 0 || top_choices[0].table.entries.length > 0 ){
			  
			// show a list

			context.replies.push('(EXPERIMENTAL) I also extracted a list, not sure if it is relevant though:');
			var elements = [];
			if(top_choices[0].list.length > 0){
				
			  // lists get higher priority than tables...

			  top_choices[0].list.forEach(function(list_entry){
			  	
				if(elements.length !== 10){
					elements.push({
						title: 'Extracted Result for '+top_choices[0].title.split('|')[0],
						subtitle:list_entry.substr(0,80),
						buttons:[['postback', '👍 Extraction ', 'feedback@good'],['postback', '👎 Extraction', 'feedback@bad']]
					});
				}
			  });
			}else if(top_choices[0].table.entries.length > 0){
				
			  // tables come next..
			  top_choices[0].table.entries.forEach(function(entry){
			  	var subtitle = '';
			  	for(var key in entry){
			  		subtitle += key+' : '+entry[key]+'\n'
			  	}
			  	if(subtitle !== ''){
					if(elements.length < 9){
					  elements.push({
					  	title: 'Extracted Result for '+top_choices[0].title.split('|')[0],
					  	subtitle: subtitle,
						buttons:[['postback', '👍 Extraction ', 'feedback@good'],['postback', '👎 Extraction', 'feedback@bad']]
					  });
					}else if(elements.length === 9){
						elements.push({
							title: 'More',
							subtitle: 'There was more on that list. See it on the page.',
							buttons: [['web_url','Open Link', top_choices[0].link]]
						});
					}
				}
			  });
			} // end adding

			
			context.replies.push(chat_utils.builders.generic_response(elements));
		  }//endif
		 }// end top choices

	 	  deferred.resolve(context);
	});

  }); //end big request nest

  return deferred.promise;
}


module.exports = FAQ_search;

// var queries = [
//   // 'defer exams',
//   // 'engineering advisers',
//   // 'graduation',
//   // 'convocation',
//   'important dates',
//   // 'cafeteria hours',
//   // 'mclennan hours',
//   // 'computer science advisers',
//   // 'student housing',
//   // 'exam dates'
//   // 'exams location'
//   // 'how do i apply?'
// ]


// var results = {};
// var links = [];
// var titles = {};

// queries.forEach( original_query =>{
//   results[original_query] = [];

//   var query = encodeURI(original_query);
//   request(search_url+query, function(error, response, body){
// 	var $ = cheerio.load(body);
// 	var count = 0;

// 	$('.search-results').children().each((i,e)=>{
// 	  var title = $(e).find('.title').text().trim();
// 	  var link = $(e).find('a').attr('href');
// 	  if(count<4){
// 		var r = new RegExp('('+original_query.split(' ').join('|')+')','gi')
// 		if(title.match(r) && link.substr(-3,3) !== 'pdf' && !link.match('/study/')){
// 		  links.push(link);
// 		  titles[link] = title;
// 		  count += 1;
// 		}
// 	  }
// 	});


// 	utils.__request(links, function(responses){

// 	  for (var url_id = 0; url_id < links.length; url_id++ ){

// 		url = links[url_id];

// 		response = responses[url];

// 		if(!response){continue;}
// 		if(response.error){
// 		  //error encountered in one of the requests...
// 		  // deferred.reject(error);
// 		  console.log('error occured in ',url,'. error was', response.error);
// 		  throw Error(response.error);
// 		}

// 		results[original_query].push(parse(response.body, titles[url], url, url_id));
// 	}

// 	var best_result = execute_index_search(results[original_query], original_query);

// 	console.log('total results:',results[original_query].length);
// 	best_result.forEach((res)=>{
// 	  console.log('score:',res.score);
// 	  console.log(results[original_query][res.ref])  
// 	})
// 	console.log('other results:', links)
//    });

//   });

// });

function execute_index_search(documents, query){
  
  var index = lunr(function(){
	this.field('title', {boost:80});
	this.field('summary', {boost:150});
	this.field('tags', {boost:100});
	this.field('big_text', {boost:200})
	this.field('site_name', {boost:80});
	this.ref('id');
  })

  for (var i = 0; i < documents.length; i++) {
	index.add(documents[i]);
  }
  
  return index.search(query);
}

function parse(body, title, link, id){

  var $ = cheerio.load(body);

  var created = {
	id: id,
	title: title,
	link: link,
	big_text: $('h1').text().replace(/\t/g,'').replace(/\n/g,'').trim(),
	tags: $('.mcgill-tags').text().replace(/\t/g,'').replace(/\n/g,'').trim(),
	site_name: $('#site-name').text().trim(),
	summary: $('.field-items').text().replace(/\n/g,' ').replace(/\t/g,' ').substr(0,1000).trim(),
	list: [],
	table: {
		headers:[],
		entries: []
	}
  }

  $('.field-items').find('li').each((i2,e2)=>{
	created.list.push($(e2).text().trim());
  })

  var headers = []
  var table_entries = []
  $('.field-items').find('tr').each((i2,e2)=>{
	var single_row = {}
	// store each element from the table
	$(e2).children().each((i3,e3)=>{
	  if($(e3).is('th')){
		headers.push($(e3).text().replace(/\t/g,'').replace(/\n/g,'').trim());
	  }else if($(e3).is('td')){
		single_row[headers[i3]] = $(e3).text().replace(/\t/g,'').replace(/\n/g,'').trim();
	  }
	});
	table_entries.push(single_row);
	// save
  });
  created.table.headers = headers;
  if(table_entries.length > 30 || created.list.length > 20){
	return {}
  }else{
	created.table.entries = table_entries;
	return created;
  }
  
}
