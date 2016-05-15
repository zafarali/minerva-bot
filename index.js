'use strict';
var q = require('q');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
var path = require('path');
var chat = require('./chat_utils.js')

/// import relevant plugins
var minerva_search = require('./plugins').minerva_search;
var help = require('./plugins').help;
var conversation = require('./plugins').conversation;
var showmore = require('./plugins').showmore;


// set up web server
var app = express();
app.set('port', ( process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 5000 ) );
app.set('ip', ( process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1') );

app.use(function(req,res,next){
    var _send = res.send;
    var sent = false;
    res.send = function(data){
        if(sent) return;
        _send.bind(res)(data);
        sent = true;
    };
    next();
});

// Process application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended:false} ) );
app.use( bodyParser.json() );


// context management:
var contexts;
try{
	contexts = JSON.parse(fs.readFileSync(path.resolve( ( process.env.OPENSHIFT_DATA_DIR || './' ), 'history.json'), 'utf8')).contexts || {};
}catch(err){
	contexts = {};
}

function get_or_create_context(user){
	if(!contexts[user]){
		contexts[user] = {extracted:[]};
	} 
	return contexts[user];
}


app.get('/', function (req, res) { 

		// storage.push(req.query['to_push']);
		res.send({message:'minerva bot backend!'});

});


app.get('/webhook', function (req, res) {
		//  USED FOR SET UP:
	if(req.query['hub.verify_token'] == process.env['VERIFYTOKEN']) {
		res.send(req.query['hub.challenge']);
	}
	res.send('Error, wrong token');
});


app.post('/webhook/', function (req, res) {
	// handles messages and postbacks

	var messaging_events = req.body.entry[0].messaging;

	for(var i=0; i < messaging_events.length; i++){
		var event = messaging_events[i];
		var sender = event.sender.id;

		// handle explicit text messaging events or postbacks
		if( (event.message && event.message.text ) 
			|| (event.postback && event.postback.payload ) ){

			// set a welcome message
			chat.welcome();

			var query, postback;

			if(event.postback){
				query = '' // if postback is defined, then query must be blank
				postback = event.postback.payload;
			}else{
				postback = '' // message is defined, then postback must be blank
				query = event.message.text;
			}

			console.log('query recieved:', query);
			console.log('postback recieved:', postback);

			internals(query, sender, postback).then(function(ctx){

				console.log('response computed.');

				if(ctx.replies.length === 0){
					ctx.replies.push('I don\'t understand what you\'re asking me :(. I\'m always improving. Until then, you can ask me to HELP you.');
				}

				// schedule replies every 200ms
				chat.reply2(sender,ctx.replies)


			}).then(function(){
				
				console.log('reply chain complete');

			}).catch(function(err){
				console.log('error occured:',err)
				chat.reply(sender, "Something went wrong... Try again!", TESTTOKEN);
				res.send({error:err});
			});
		}
	}

	res.sendStatus(200);

});


// internal chain logic for the purposes of abstraction
function internals(query, user, postback){

	// plugins to be executed
	var to_execute = [ conversation, help, showmore, minerva_search ];

	// obtain a context
	var history = get_or_create_context(user);
	
	context = {
		history: history,
		current_query: query,
		postback:postback,
		completed: false,
		replies:[]
	}
	
	return to_execute.reduce(q.when, q(context));
}


app.get('/dump_history/', function(req, res){
	// dumps all user contexts to the file system and out
	// only works if the token query is correct
	// for "security" 
	if(req.query['token'] == process.env['VERIFYTOKEN']) {
		// dumps all user contexts to the file system and out
		var contexts_string = JSON.stringify({contexts:contexts});
		try{
			fs.writeFile( ( process.env.OPENSHIFT_DATA_DIR || './' )+'history.json', contexts_string, function (err) {
				if (err) throw err;
				console.log('Saved 1');
			});
		}catch(err){
			fs.writeFile( ( process.env.OPENSHIFT_DATA_DIR +'/' || './' )+'history.json', contexts_string, function (err) {
				if (err) throw err;
				console.log('Saved 2');
			});
		}

		res.send({contexts:contexts});
	}
});

app.listen( app.get('port'), app.get('ip'), function() {
	console.log('listening on', app.get('ip'), ' on port ', app.get('port') );
});







	