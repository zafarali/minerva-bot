var request = require('request');
var search = require('./search.js');
var COURSE_REGEX = /[a-z]{4}[0-9]{3}/gi;

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

function parse_phrase(user_text, args){
	
	// check if the phrase is a hello phrase

	// if(isHello){
	// 	return;
	// }

	// check if the user has mentioned a course
	var phrase = user_text.toUpperCase().replace(/\s/g, '');
	var course_matches = phrase.match(COURSE_REGEX);

	if (course_matches && course_matches.length > 0){
		for (var j = 0; j < course_matches.length; j++) {
			var subject = course_matches[j].substr(0,4);
			var code = course_matches[j].substr(4,6);
			// console.log('matched:'+subject+' '+code);
			args.queries = args.queries.concat( search.generate_query_by_subject_code(subject, code) );
		};
		return;
	}

	// default to searching a title
	if(user_text.length > 5){
		args.queries = args.queries.concat( search.generate_query_by_title(user_text) );
	}

}

exports.parse = parse_phrase;
exports.reply = reply;