var natural = require('natural')
// var WORDS = require('../WORDS.js').WORDS;
var utils = require('../../utils.js');
natural.LancasterStemmer.attach();
var NGrams = natural.NGrams;
var WORDS = require('../WORDS.js').WORDS

function help_me(context){
	// checks if user input contains a greeting
	
	var tokenized_input = context.current_query.tokenizeAndStem();
	for (var i = 0; i < tokenized_input.length; i++) {
	
		if(utils.arrays.contains(WORDS['helpwords'], tokenized_input[i])){
			context.replies.push(utils.arrays.random_choice(['I got you!', 'Of course', 'Everyone needs help sometimes!']))
			context.replies.push('Here are some of the queries you can ask me: \n "What time is COMP 202" \n "Who teaches PHYS 230?" \n "Show me courses about anthropology of development".');
			context.completed = true;
			break;
		}
	}
	return context;
}

module.exports = help_me;
