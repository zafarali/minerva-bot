var natural = require('natural')
// var WORDS = require('../WORDS.js').WORDS;
var utils = require('../../utils.js');
var chat_builders = require('../../chat_utils.js').builders;
natural.LancasterStemmer.attach();
var NGrams = natural.NGrams;
var WORDS = require('../WORDS.js').WORDS

function help_me(context){
	// checks if user input contains a greeting
	
	if(context.postback){
		// we have receieved a deep link from somewhere else.
		if(context.postback.substr(0,7) === 'help@'){
			set_user_needs_help(context)
			return context
		}
	}

	var tokenized_input = context.current_query.tokenizeAndStem();
	for (var i = 0; i < tokenized_input.length; i++) {
	
		if(utils.arrays.contains(WORDS['helpwords'], tokenized_input[i])){
			set_user_needs_help(context);
			break;
		}
	}

	if( context.current_query.match(/(what|wut|you|ur){1}.*(capabi|abil|do|purpo){1}/gi) ){
		set_user_needs_help(context);
	}

	return oweek(context);
}

function oweek(context){
	// function to use during oweek
	if( context.current_query.match(/(oweek|orientation|frosh|o.week)/gi) ) {
		context.replies.push('Seems like you are looking for information about Orientation Week? (Aug 29th - Sep 4th 2016)');		
	
	var elements = [];	
	
	elements.push({
		title: 'McGill Orientation Website',
		subtitle: 'Official website: Map, frequently asked questions and contact details',
		image_url: 'http://www.mcgilltribune.com/wp-content/uploads/2015/09/Screen-Shot-2015-09-14-at-11.41.35-PM.png',
		buttons:[
			['web_url', 'Undergraduate Site', 'http://orientation.ssmu.mcgill.ca/' ],
			['web_url', 'Graduate Site', 'http://mcgillgradorientation.ca/' ],
			['web_url', 'fb@mcgillorientation', 'https://www.facebook.com/mcgillorientation' ]
		]
	});
	elements.push({
		title:'Orientation General Information',
		subtitle: 'General information for orientation in the Fall and Winter',
		image_url:'https://www.mcgill.ca/firstyear/files/firstyear/1.jpg',
		buttons: [
			['web_url', 'Go Undergraduate', 'https://www.mcgill.ca/firstyear/undergraduate/orientation-week'],
			['web_url', 'Go Graduate', 'https://www.mcgill.ca/firstyear/graduate-postdoctoral/orientation']
		]
	})
	elements.push({
		title: 'List of Frosh Pages',
		subtitle: 'Facebook post containing helpful links to Frosh pages',
		image_url:'https://scontent-lga3-1.xx.fbcdn.net/v/t1.0-9/8488_509634112419801_997051533_n.png?oh=9003e7e465d3e2c69be390b92d84fcea&oe=58401FD6',
		buttons: [
			['web_url', 'Visit', 'https://www.facebook.com/mcgillorientation/photos/a.516638305052715.1073741828.506985856017960/1263811913668680/']
		]
	})

	context.replies.push(chat_builders.generic_response(elements));
	
	context.replies.push('Here are the FROSH events this year!')
	context.replies.push(chat_builders.attachment('https://scontent-lga3-1.xx.fbcdn.net/t31.0-8/13767225_1247389725310899_2809969646263700085_o.jpg', 'image'));
	

	context.replies.push('And post-orientation, I\'ll be here to help you out :) ');
	context.completed = true;
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
