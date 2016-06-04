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

	if(context.current_query.match(/(how|hw){1}.*(is|are|r|you|u){1}.*(you|u|goin|doin)?/gi)){
		context['completed'] = true;
		context.replies.push(
			utils.arrays.random_choice([
				'I\'m fantastic today! :D',
				'Doing superb! Thanks for asking :)',
				'Very well, thank you for asking!',
				'Doing good as always!'
				]));
	}

	if(context.current_query.match(/(who){1}.*(you|u|is|mak|mad|creat){1}.*(creat|mast|make|kin|quee|boss|own|you|u)+/gi)){
		context['completed'] = true;
		context.replies.push('I was made by this guy: http://www.zafarali.me My code is open source too, find it here: https://github.com/zafarali/minerva-bot');
	}

	if(context.current_query.match(/(are|r|you|u){1}/gi) && 
		context.current_query.match(/(intel|smart|artif|AI|cool|good|male|awe|bad|scar|ware|self)/gi)){
		context['completed'] = true;
		context.replies.push(
			utils.arrays.random_choice([
				'I consider myself pseudointelligent! I am gender-neutral. I\'m here ready to help you navigate McGill!',
				'I am pseudointelligent.',
				'I\'m not super smart. Only beta. Pseudointelligent',
				'We all know there\'s no such thing right...'
				]))
	}

	// @TODO
	// do some preprocessing to remove certains words

	context.current_query = context.current_query.toLowerCase().replace(/(show|display|view|tell)[^\s]*/g, '');

	return context;
}

module.exports = contains_hello;
