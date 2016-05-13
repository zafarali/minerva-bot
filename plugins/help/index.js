var natural = require('natural')
// var WORDS = require('../WORDS.js').WORDS;
var utils = require('../../utils.js');
natural.LancasterStemmer.attach();
var NGrams = natural.NGrams;

function help_me(context){
	// checks if user input contains a greeting
	console.log('in help detect');
	console.log(context)
	var tokenized_input = context.current_query.tokenizeAndStem();
	for (var i = 0; i < tokenized_input.length; i++) {
		console.log('matched!')
		if(tokenized_input[i] === 'help'){
			context.replies = ['I got you!','Ask me about courses at McGill! You can say things like "What time is COMP 202" or "What time is anthropology of development?"']
			context.completed = true;
		}
	}
	return context;
}

module.exports = help_me;
