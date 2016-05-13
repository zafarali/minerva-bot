var request = require('request');

var FBTOKEN = process.env['FBTOKEN'];

function reply(sender, text, test_token){
	var token = typeof test_token !== 'undefined' ?  test_token : FBTOKEN;
	// generic reply function
	var reply_data = {
		text:text
	};

	request({
		url:'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:token},
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

exports.reply = reply;