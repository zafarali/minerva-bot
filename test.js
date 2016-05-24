var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var q = require('q');
var fs = require('fs');
var path = require('path');
var chat = require('./chat_utils.js')
var app = express();
app.set('port', ( process.env.PORT || 5000 ) );
// app.set('ip', '127.0.0.1');


// import plugins!
// var TESTTOKEN = "";
var TESTTOKEN = process.env.TESTTOKEN


var minerva_search = require('./plugins').minerva_search;
var help = require('./plugins').help;
var conversation = require('./plugins').conversation;
var showmore = require('./plugins').showmore;
var catalog_search = require('./plugins').catalog_search;
var major_search = require('./plugins').major_search;
var building_search = require('./plugins').building_search;


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

var contexts = JSON.parse(fs.readFileSync(path.resolve('./', 'history.json'), 'utf8')).contexts || {};


function get_or_create_context(user){
	if(!contexts[user]){
		contexts[user] = {extracted:[]};
	} 
	return contexts[user];
}

app.get('/', function(req, res){
	if( !( req.query['query'] || req.query['postback'] ) || !req.query['user']){
		res.send({error:'query or user not supplied'});
	}

	// extract user and query
	var query = req.query['query'] || '';
	var postback = req.query['postback'] || '';
	var user = req.query['user'];
	
	console.log('query recieved:', query);
	console.log('postback recieved:', postback);

	internals(query, user, postback).then(function(ctx){
		// ctx.history.past_queries.push(ctx.current_query);
		if(ctx.replies.length === 0){
			ctx.replies.push('I don\'t understand what you\'re asking me :(. I\'m always improving. Until then, you can ask me to HELP you.');
		}
		res.send({global_context:contexts,local_context:ctx});
	}).catch(function(err){
		console.log('error occured:',err)
		res.send({error:err});
	});

});

app.get('/dump_history/', function(req, res){
	// dumps all user contexts to the file system and out
	var contexts_string = JSON.stringify({contexts:contexts});
	
	fs.writeFile('./history.json', contexts_string, function (err) {
		if (err) throw err;
		// console.log('It\'s saved!');
	});

	res.send({contexts:contexts});
		
});

app.get('/testhook/', function(req, res){

	if(req.query['hub.verify_token'] === 'testhooktoken') {
		res.send(req.query['hub.challenge']);
	}
	res.send('Error, wrong token');

})


app.post('/testhook/', function(req, res){

	var messaging_events = req.body.entry[0].messaging;

	for(var i=0; i < messaging_events.length; i++){
		var event = messaging_events[i];
		var sender = event.sender.id;

		// handle explicit text messaging events or postbacks
		if( (event.message && event.message.text ) 
			|| (event.postback && event.postback.payload ) ){

			// chat.welcome();

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
				// ctx.history.past_queries.push(ctx.current_query);
				console.log('response computed.');

				if(ctx.replies.length === 0){
					ctx.replies.push('I don\'t understand what you\'re asking me :(. I\'m always improving. Until then, you can ask me to HELP you.');
				}

				// var reply_chain = []

				// for (var i = 0; i < ctx.replies.length; i++) {
				// 	reply_chain.push(chat.reply.bind(undefined, sender, ctx.replies[i], TESTTOKEN));
				// }

				// return reply_chain.reduce(q.when, q())
				chat.reply2(sender,ctx.replies,TESTTOKEN)
				// var reply_f = reply2.bind(undefined, sender, ctx.replies, TESTTOKEN);
				// return q.when(reply_f)

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
})

// function speak(sender, payload, default_time){
// 	setTimeout(function(sender,payload){
// 		console.log('sending:',payload)
// 		console.log('to',sender)
// 		;	
// 		}, default_time);
// }

function internals(query, user, postback){

	// plugins to be executed
	var to_execute = [ conversation, help, building_search, showmore, minerva_search, catalog_search, major_search ];

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

app.listen( app.get('port'), function() {
	console.log('listening on', ' on port ', app.get('port') );
});
