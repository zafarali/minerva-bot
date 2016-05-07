var request = require('request');
var search = require('./search.js');
var COURSE_REGEX = /[a-z]{4}[0-9]{3}/gi;
var natural = require('natural')
var jsonfile = require('jsonfile')
var fs = require('fs');
var WORDS = require('./WORDS.js').WORDS;
natural.LancasterStemmer.attach();
var NGrams = natural.NGrams;

// useful functions

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
Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};


// load the classifiers
var JSON_classifier = fs.readFileSync('./training/query_classify.json', 'utf8');
var query_classify = natural.BayesClassifier.restore(JSON.parse(JSON_classifier));



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


function contains_hello(user_text){
	// checks if user input contains a greeting
	var tokenized_input = user_text.tokenizeAndStem();
	for (var i = 0; i < WORDS['greetings'].length; i++) {
		if(tokenized_input.contains(WORDS['greetings'][i])){
			return true;
		}
	}
	return false;
}
function contains_how_are_you(user_text){
	
}
function parse_phrase(user_text, args){
	user_text = user_text.toLowerCase();

	if(contains_hello(user_text)){
		args.replies.push('Hey!')
		args.replies.push('Try asking me about a certain course like "When is COMP 202" or using a course title like "who teaches forest management?"')
		return;
	}

	// check if the user has mentioned a course
	var phrase = user_text.toUpperCase().replace(/\s/g, '');
	var course_matches = phrase.match(COURSE_REGEX);

	if (course_matches && course_matches.length > 0){
		var year = undefined;
		if(user_text.split(' ').contains('fall')){
			year = '201609';
		}else if(user_text.split(' ').contains('winter')){
			year = '201701';
		}else if(user_text.split(' ').contains('summer')){
			year = '201605';
		}
		for (var j = 0; j < course_matches.length; j++) {
			var subject = course_matches[j].substr(0,4);
			var code = course_matches[j].substr(4,6);
			// console.log('matched:'+subject+' '+code);
			args.queries = args.queries.concat( search.generate_query_by_subject_code(subject, code, year) );
		};
		
	}else if(user_text.length > 5){
		var extracted = freeform_query_extract(user_text)
		var title = extracted[0];
		var year = extracted[1].when ? extracted[1].when : undefined;
		if(title.length>0){
			args.queries = args.queries.concat( search.generate_query_by_title(title, year) );
		}
	}

	if(args.queries.length === 0){
		args.replies.push('Try asking me about a certain course like "When is COMP 202" or using a course title like "who teaches forest management?"');
		args.replies.push('I didn\'t quite understand what you\'re trying to ask me...');
	}

}


function bigram_contains_skip_word(bigram) {
	var contains_stop_word = false;
	for (var i = 0; i < WORDS['skip_words'].length; i++) {
		contains_stop_word = WORDS['skip_words'][i] == bigram[0] || WORDS['skip_words'][i] == bigram[1]
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
	// console.log('query extracted: ',search_extracted.unique());
	// console.log('from',user_text);
	var refined_query = refine_query_extract(search_extracted.unique());
	// console.log('original text: ',user_text,'\n->query:', refined_query);
	return refined_query;
}


var REFINE_WORDS = {
	'in': {
		include_when:WORDS['in_keep_list'],
		exclude_when:[]
	},
	'the': {
		exclude_when:['[end]', 'fall', 'winter'],
		include_when:WORDS['the_keep_list']
	}
}

function refine_query_extract(key_words){
	// refines key words extracted from a query
	// using some hard coded logic... should imporve later

	var refined = [];
	var meta = {'when':false};
	for (var i = 0; i < key_words.length; i++) {
		if(key_words[i] === 'intro'){
			refined.push('introduction');
		}
		// certain words can be skipped right off the bat
		if(key_words[i] !== '[end]' && 
			key_words[i] !== 'teaches' && 
			key_words[i] !== 'professor' &&
			key_words[i] !== 'instructor' &&
			key_words[i] !== 'prof'){
			// not an end word
			if(key_words[i] === 'in'){
				// is this "in" important?
				if(i>0){
						// go through most of the cases when we include it
					for (var j = 0; j < REFINE_WORDS['in'].include_when.length; j++) {
						if( REFINE_WORDS['in'].include_when[j] === key_words[i-1] ){
							refined.push(key_words[i])
						}
					};
				}
			} else if (key_words[i] === 'the'){
				for (var j = 0; j < REFINE_WORDS['the'].include_when.length; j++) {
					if( REFINE_WORDS['in'].include_when[j] === key_words[i-1] ){
						// check if it is not an end word
						if( (i<key_words.length-1 && key_words[i+1]!=='[end]') 
							|| i == key_words.length-1 ){
							refined.push(key_words[i])
						}
					}
				};
			} else {
				// we detect a date/semester

				if( key_words[i] === 'fall'){
					meta['when'] = '201609'
				} else if( key_words[i] === 'winter'){
					meta['when'] = '201701'
				} else if( key_words[i] === 'summer'){
					meta['when'] = '201605'
				} else {
					// didn't find a reason not to include this
					refined.push(key_words[i])						
				}
			
			}
		}
	};
	if(refined[refined.length-1] === 'in' || 
		refined[refined.length-1] === 'for' || 
		refined[refined.length-1] === 'the'){
		refined.pop();
	}
	if(refined[0] === 'in' || 
		refined[0] === 'for' || 
		refined[0] === 'the'){
		refined.splice(0,1);
	}
	return [ refined.join(' '), meta ] ;
}

exports.parse = parse_phrase;
exports.reply = reply;