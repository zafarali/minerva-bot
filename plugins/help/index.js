var natural = require('natural')
// var WORDS = require('../WORDS.js').WORDS;
var utils = require('../../utils.js');
natural.LancasterStemmer.attach();
var NGrams = natural.NGrams;

function help_me(context){
	// checks if user input contains a greeting
	
	var tokenized_input = context.current_query.tokenizeAndStem();
	for (var i = 0; i < tokenized_input.length; i++) {
	
		if(tokenized_input[i] === 'help'){
			context.replies = [
			'I got you!',
			'Ask me about courses at McGill! You can say things like "What time is COMP 202" or "What time is anthropology of development?"',
			// 'After I respond, you can say "SHOW MORE". I\'ll send over the course description!'
			]
			context.completed = true;
		}
	}
	return context;
}

module.exports = help_me;
