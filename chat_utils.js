var request = require('request');
var search = require('./search.js');
var COURSE_REGEX = /[a-z]{4}[0-9]{3}/gi;
var natural = require('natural')
var jsonfile = require('jsonfile')
var fs = require('fs');
 
var JSON_classifier = fs.readFileSync('./training/query_classify.json', 'utf8');

var query_classify = natural.BayesClassifier.restore(JSON.parse(JSON_classifier));


var NGrams = natural.NGrams;


var FBTOKEN = process.env['FBTOKEN'];

function reply(sender, text){
	// generic reply function
	var reply_data = {
		text:text
	};

	request({
		url:'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:FBTOKEN},
		method: 'POST',
		json: {
			recipient: {id:sender},
			message:reply_data,
		}
	}, function(error, response, body){
		if(error){
			console.log('ERROR SENDING MESSAGE',error);
		}else if (response.body.error){
			console.log('ERROR:', response.body.error);
		}
	});
}

var COURSE_REGEX = /[a-z]{4}[0-9]{3}/gi;

function parse_phrase(user_text, args){
	

	// check if the phrase is a hello phrase

	// if(isHello){
	// 	return;
	// }

	// check if the user has mentioned a course
	var phrase = user_text.toUpperCase().replace(/\s/g, '');
	var course_matches = phrase.match(COURSE_REGEX);

	if (course_matches && course_matches.length > 0){
		for (var j = 0; j < course_matches.length; j++) {
			var subject = course_matches[j].substr(0,4);
			var code = course_matches[j].substr(4,6);
			// console.log('matched:'+subject+' '+code);
			args.queries = args.queries.concat( search.generate_query_by_subject_code(subject, code) );
		};
		
	}else if(user_text.length > 5){
		var extracted_query_words = freeform_query_extract(user_text).join(' ')
		args.queries = args.queries.concat( search.generate_query_by_title(extracted_query_words) );

	}

	if(args.queries.length == 0 && args.replies.length == 0){
		args.replies.push('I didn\'t quite understand what you\'re trying to ask me...');
		args.replies.push('Try asking me about a certain course like "When is COMP 202" or using a course title like "who teaches forest management?"');
	}

}


Array.prototype.unique = function(){
	// from underscore.js
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}



var SKIP_WORDS = [
	'courses',
	'about',
	'about',
	'me',
	'you',
	'google',
	'yahoo',
	'minerva',
	'fuck'
]

function bigram_contains_skip_word(bigram) {
	var contains_stop_word = false;
	for (var i = 0; i < SKIP_WORDS.length; i++) {
		contains_stop_word = SKIP_WORDS[i] == bigram[0] || SKIP_WORDS[i] == bigram[1]
	};
	return contains_stop_word;
}

function freeform_query_extract(user_text) {
	// extracts the query from a free form user text
	// generate bigrams with an end word
	var bgrams = NGrams.ngrams(user_text.toLowerCase(), 2, null, '[end]');
	var is_course_query = false;
	var search_extracted = [];
	for (var j = 0; j < bgrams.length; j++) {
		// checks if the words are skip words
		if(bigram_contains_skip_word(bgrams[j])){
			continue;
		}
		var classification = query_classify.classify(bgrams[j]);
		// console.log('-->classified',classification)
		if(classification==='yes'){
			is_course_query = true;
			search_extracted.push(bgrams[j][0]);
			search_extracted.push(bgrams[j][1]);
		}
	};
	console.log('query extracted: ',search_extracted.unique());
	console.log('from',user_text);
	console.log('refined:', refine_query_extract(search_extracted.unique()));
	return search_extracted.unique();
}


var REFINE_WORDS = [
	'in':{
		include_when:['topics', 'issues', 'culture', 'architecture', 
		'methods', 'advances', 'models', 'communication', 'issues',
		'problems', 'therapy', 'church', 'work', 'care', 'christianity', 
		'sexuality', 'jews','laboratory', 'materials', 'technology',
		'seminar', 'theories', 'civilization', 'medicine', 'research', 'behaviour',
		'computers', 'writing', 'ethics', 'management', 'experiments', 'managing',
		'cities', 'lipoproteins', 'turbulence', 'studies', 'resources', 
		'psychology'],
		exclude_when:[]
	},
	{
		word: 'the', 
		exclude_when:['[end]', 'fall', 'winter'],
		include_when:[]
	},
	{
		word: 'winter',
		exclude_when:[],
		include_when:[]
	},
	{
		word: 'fall',
		exclude_when:[],
		include_when:[]
	},
	{
		word: '[end]',
		exclude_when:[],
		include_when:[]
	}
]

function refine_query_extract(key_words){
	// refines key words extracted from a query
	// using some hard coded logic... should imporve later
	var refined = [];
	var meta = {'when':false};
	for (var i = 0; i < key_words.length; i++) {
		if(key_words[i] !== '[end]'){
			// not an end word
			if(key_words[i] === 'in'){
				// is this "in" important?
				if(i>0){
						// go through most of the cases when we include it
					for (var j = 0; j < REFINE_WORDS['in']include_when.length; j++) {
						if( REFINE_WORDS['in']include_when[j] === key_words[i-1] ){
							refined.push(key_words[i])
						}
					};
				}
			} else {
				// we detect a date/semester
				if( key_words[i] === 'fall' 
					|| key_words[i] === 'winter'
					|| key_words[i] === 'summer'){
					meta['when'] = key_words[i]
				}else{
					// didn't find a reason not to include this
					refined.push(key_words[i])			
				}
			}
		}
	};
	return [ refined, meta ] ;
}

exports.parse = parse_phrase;
exports.reply = reply;