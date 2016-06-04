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
			set_user_needs_help(context);
			break;
		}
	}

	if( context.current_query.match(/(what|wut){1}.*(capabi|abil|do|purpo){1}/gi) ){
		set_user_needs_help(context);
	}

	return context;
}


function set_user_needs_help(context){
	context.replies.push(
		utils.arrays.random_choice(
			['I got you!', 'Of course', 'Everyone needs help sometimes!']));
	context.replies.push('I can answer questions about:\n'+
		'Specific courses: "What time is COMP 202 in the Fall"\n'+
		'General courses: "Courses about Quantum Mechanics" or "500 level biology courses"\n'+
		'Buildings at McGill: "Where is Dispatch?\n'+
		'uPrint Locations: "Are there printers in Genome Center?"');
	context.completed = true;
}

module.exports = help_me;
