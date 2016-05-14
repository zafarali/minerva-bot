var request = require('request');

var FBTOKEN = process.env['FBTOKEN'];

function reply(sender, reply_data, test_token){
	// A generic reply function
	// @param: sender - recepient of this message
	// @param: reply_data - a string of the text or object containing an attachment
	// [@param test_token - for testing purposes.] 
	var token = typeof test_token !== 'undefined' ?  test_token : FBTOKEN;
	var reply_data = typeof reply_data === 'string' ?  {text:reply_data} : reply_data;


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


function build_structured_response(text,button_triples){

	var buttons = [];
	for (var i = 0; i < button_triples.length; i++) {
		var button_type = button_triples[i][0]; // the "type": "web_url" or "postback"
		var button_title = button_triples[i][1]; // "title" to display
		var button_payload = button_triples[i][2]; // the payload, either the "url" or "payload"

		// temporary object
		var to_save = {type:button_type, title:button_title}
	
		// extract what kind of button it is and work accordingly.		
		if(button_type === "web_url"){
			to_save["web_url"] = button_payload;
		}else if(button_type === "postback"){
			to_save["payload"] = button_payload;
		}else{
			throw Error("Button type was not web_url nor payload. Other types not supported.");
		}

		buttons.push(to_save)

	}

	var to_return = {
		attachment:{
			type: "template",
			payload: {
				template_type: "button",
				text: text,
				"buttons":buttons
			}
		}
	}
	
	return to_return
}

exports.reply = reply;
exports.builders = { structured_response:build_structured_response }
