var natural = require('natural')
var WORDS = require('../WORDS.js').WORDS;
var utils = require('../../utils.js');
var chat_builders = require('../../chat_utils.js').builders;

natural.LancasterStemmer.attach();
var NGrams = natural.NGrams;

function contains_hello(context){
	// checks if user input contains a greeting

	// first do some basic cleaning
	context.current_query = context.current_query.toLowerCase().replace(/(show|see|display|view|tell)[^\s]*/g, '');


	var tokenized_input = context.current_query.tokenizeAndStem();

	if(tokenized_input[0] === 'cours' && tokenized_input.length === 1){

		// person looked for something like 'all courses' or 'show courses' or 'see courses'
		context.replies.push(
			utils.arrays.random_choice(
				[
					'Asking for too much... I\'m just a bot :(',
					'I don\'t want to spam you. It\'s for your own good. Ask me something else.',
					'Hold on there, I can\'t show you all 8000 courses at McGill...',
					'That\'s too many courses! Try something more specific please!'
				])
			)
		context.history.fails = context.history.fails + 2;
		context.completed = true;
		return context;
	}

	for (var i = 0; i < WORDS['greetings'].length; i++) {
		if(utils.arrays.contains(tokenized_input, WORDS['greetings'][i])){

			context['completed'] = true;
			context.replies.push(utils.arrays.random_choice(['Hi!', 'Hello!', 'Hey there!', 'Hey!', 'Minerva Bot reporting for duty.', 'Minerva Bot at your service.']));
			var prompt_help = false;
			if(context.history.last_hello){
				if( new Date() - context.history.last_hello > 30*60*1000 ){
					prompt_help = true;
				}
			}else{
				prompt_help = true;
			}

			if(prompt_help){
				context.history['last_hello'] = new Date();
				context.replies.push('Ask me about courses at McGill! You can say things like "What time is COMP 202" or "What time is anthropology of development?"');
			}

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

	if(context.current_query.match(/(how|hw){1}\b.*(is|are|r|you|u){1}\b.*(you|u\b|goin|doin)?/gi)){
		context['completed'] = true;
		context.replies.push(
			utils.arrays.random_choice([
				'I\'m fantastic today! :D',
				'Doing superb! Thanks for asking :)',
				'Very well, thank you for asking!',
				'Doing good as always!'
				]));
	}

	if(context.current_query.match(/(who){1}.*(you|u\b|is|mak|mad|creat|buil){1}.*(creat|mast|make|kin|quee|boss|own|you|u\b)+/gi)){
		context['completed'] = true;
		context.replies.push('I was made by this guy: http://www.zafarali.me My code is open source too, find it here: https://github.com/zafarali/minerva-bot');
	}

	if(
		context.current_query.match(/(are|r|you|u)\b.*(intel|man\b|smart|artif|AI|cool\b|good|male\b|awe|bad\b|scar|ware\b|self|bot\b)/gi)
		|| context.current_query.match(/(who|what){1}\b\s?(are|r\b)?\b\s?(you|u\b)/gi)){
		context['completed'] = true;
		context.replies.push(
			utils.arrays.random_choice([
				'I consider myself pseudointelligent! I\'m here ready to help you navigate McGill!',
				'I am pseudointelligent.',
				'I\'m not super smart. Only beta right now. Pseudointelligent',
				'We all know there\'s no such thing right...'
				]))
	}

	// match a haha or lol 
	// commented out because of weird generality bug... it even matched 'hillary'
	// if(context.current_query.match(/((ha)*|lol.*|hehe|lmao)\b/gi) && !context.completed){
	// 	context['completed'] = true;
	// 	context.replies.push(
	// 		utils.arrays.random_choice([
	// 			'Glad you found it funny ^_^',
	// 			':D',
	// 			'LOL!',
	// 			'^_^',
	// 			':)'
	// 			]))
	// }



	// match certain postbacks
	if(context.postback && !context['completed']){
		if(context.postback === 'NEWUSER'){
			context['completed'] = true;
			context.replies.push('Hello there! Thanks for giving me a shot :)');
			context.replies.push(
				chat_builders.quick_reply('Would you like to see all my capabilities?',
					[ ['Yep', 'help@'], ['Nah, I got it.', 'negative@'] ])
				);

		}
		if(context.postback.substr(0,9) === 'negative@'){
			context['completed'] = true;
			context.replies.push(
				utils.arrays.random_choice([
					'Got it.', 'Ok!', 'Cool.', 'Alright.', '(Y)'
					]))
		}
	}
	// @TODO
	// do some preprocessing to remove certains words


	return context;
}

module.exports = contains_hello;
