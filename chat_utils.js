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
		// console.log('sent:',reply_data)
		if(error){
			console.log('ERROR SENDING MESSAGE',error);
			reply(sender, 'Something went wrong sending you a Facebook message. Try again!', token);
			// throw Error(error);
		}else if (response.body.error){
			console.log('ERROR:', response.body.error);
			reply(sender, 'Something went wrong sending you a Facebook message. Try again!', token);
			// throw Error(response.body.error);
		}

		return true;
	});
}

function reply2(sender, replies, test_token){
	var token = typeof test_token !== 'undefined' ?  test_token : FBTOKEN;
	var reply_data = replies.shift();

	// do a converstion if it is not a string.
	reply_data = typeof reply_data === 'string' ?  {text:reply_data} : reply_data;

	try{
		request({
			url:'https://graph.facebook.com/v2.6/me/messages',
			qs: {access_token:token},
			method: 'POST',
			json: {
				recipient: {id:sender},
				message:reply_data,
			}
		}, function(error, response, body){
			// console.log('sent:',reply_data)
			if(error){
				console.log('ERROR SENDING MESSAGE',error);
				reply2(sender, ['Wow this is embarassing! :( Something went wrong sending you a Facebook message. Try again!'], token)
				// throw Error(error);
			}else if (response.body.error){
				console.log('ERROR:', response.body.error);
				reply2(sender, ['Wow this is embarassing... :/ Something went wrong sending you a Facebook message. Try again!'], token)
				// throw Error(response.body.error);
			}

			if(replies.length){
				setTimeout(function(){
					reply2(sender,replies,token);
				}, 200);
			}
		});
	}catch(e){
		reply2(sender, ['Wow this is embarrasing :/ An error occured while trying to send you a Facebook message.'], token)
	}
}


function welcome(test_token){
	// A generic reply function
	// @param: sender - recepient of this message
	// @param: text - a string of the text
	// [@param test_token - for testing purposes.] 
	var token = typeof test_token !== 'undefined' ?  test_token : FBTOKEN;
	// var reply_data = typeof reply_data === 'string' ?  {text:reply_data} : reply_data;
	
	request({
		url:'https://graph.facebook.com/v2.6/1197984806888136/thread_settings',
		qs: {access_token:token},
		method: 'POST',
		json: { "setting_type":"call_to_actions",
          "thread_state":"new_thread",
          "call_to_actions":[
                {
                  "message":{
                    "text":"Hey there! How can I help you today? Ask me about specific courses, or courses you want to know about. At anytime you can ask me to HELP you!"
                  }
                }
              ]
        }
	}, function(error, response, body){
		// console.log('sent:',text)
		if(error){
			console.log('ERROR SENDING MESSAGE',error);
			throw Error(error);
		}else if (response.body.error){
			console.log('ERROR:', response.body.error);
			throw Error(response.body.error);
		}

		return true;
	});
}


function build_structured_response(text,button_triples){

	var buttons = [];
	for (var i = 0; i < button_triples.length; i++) {
		buttons.push(build_buttons(button_triples[i]))
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

function build_buttons(button_triple){
	var button_type = button_triple[0]; // the "type": "web_url" or "postback"
	var button_title = button_triple[1]; // "title" to display
	var button_payload = button_triple[2]; // the payload, either the "url" or "payload"

	// temporary object
	var to_save = {type:button_type, title:button_title}
	// console.log(button_triple)

	// extract what kind of button it is and work accordingly.		
	if(button_type === "web_url"){
		to_save["url"] = button_payload;
	}else if(button_type === "postback"){
		to_save["payload"] = button_payload;
	}else{
		throw Error("Button type was not web_url nor payload. Other types not supported.");
	}

	return to_save;
}


function build_generic_structure(elements_data){
	// elements_data is an array of the following:
	/*
		{
			title: // title of the card
			subtitle: // subtitle of the card
			image_url: [optional] //an image for the card
			buttons: [array of button triples.] //buttons to click
		}

	*/
	var to_return = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": []
     		}
    	}
  	};


  for (var i = 0; i < elements_data.length; i++) {
  	var element = elements_data[i];
  	var to_save = {
  		title: element.title,
  		subtitle: element.subtitle,
  	}

  	

  	if(element.image_url){
  		to_save['image_url'] = element.image_url
  	}

  	if(element.buttons){
  		var buttons = [];
	  	for (var j = 0; j < element.buttons.length; j++) {
			buttons.push(build_buttons(element.buttons[j]))
		}
		to_save['buttons'] = buttons;
	}

	to_return.attachment.payload.elements.push(to_save);

  }

  return to_return;


}
exports.reply = reply;
exports.reply2 = reply2;
exports.welcome = welcome;
exports.builders = { 
	structured_response:build_structured_response,
	generic_response:build_generic_structure,
	button:build_buttons 
}
