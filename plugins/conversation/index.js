var natural = require('natural')
var WORDS = require('../WORDS.js').WORDS;
var utils = require('../../utils.js');
natural.LancasterStemmer.attach();
var NGrams = natural.NGrams;

function contains_hello(context){
	// checks if user input contains a greeting
	console.log('in hello detect')
	var tokenized_input = context.current_query.tokenizeAndStem();
	for (var i = 0; i < WORDS['greetings'].length; i++) {
		if(utils.arrays.contains(tokenized_input, WORDS['greetings'][i])){
			console.log('matched!')
			context['completed'] = true;
			context.replies = ['Hey!', 
			'Ask me about courses at McGill! You can say things like "What time is COMP 202" or "What time is anthropology of development?"']
		}
	}
	return context;
}

module.exports = contains_hello;
