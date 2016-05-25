var natural = require('natural')
var WORDS = require('../WORDS.js').WORDS;
var utils = require('../../utils.js');
natural.LancasterStemmer.attach();
var NGrams = natural.NGrams;

function contains_hello(context){
	// checks if user input contains a greeting

	var tokenized_input = context.current_query.tokenizeAndStem();
	for (var i = 0; i < WORDS['greetings'].length; i++) {
		if(utils.arrays.contains(tokenized_input, WORDS['greetings'][i])){

			context['completed'] = true;
			context.replies.push(utils.arrays.random_choice(['Hi!', 'Hello!', 'Hey there!', 'Hey!', 'Minerva Bot reporting for duty.']));
			context.replies.push('Ask me about courses at McGill! You can say things like "What time is COMP 202" or "What time is anthropology of development?"');
			break;
		}

		if(i < WORDS['frenchgreeting'].length && utils.arrays.contains(tokenized_input, WORDS['frenchgreeting'][i])){
			context['completed'] = true;
			context.replies = ['Salut!', 'Désolé, maintenant je parle anglais seulement...'];
		}

		if( i < WORDS['thanks'].length && utils.arrays.contains(tokenized_input, WORDS['thanks'][i])){
			context['completed'] = true;
			context.replies.push(utils.arrays.random_choice(['Any time!', 'My pleasure!', 'You\'re welcome. Have a good day.', 'At your service.']));
		}
	}


	// @TODO
	// do some preprocessing to remove certains words

	context.current_query = context.current_query.toLowerCase().replace('show', '')

	return context;
}

module.exports = contains_hello;
