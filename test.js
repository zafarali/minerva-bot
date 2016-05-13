var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var q = require('q');
var fs = require('fs');
var path = require('path');
var chat = require('./chat_utils.js')
var app = express();
app.set('port', 5000  );
app.set('ip', '127.0.0.1');


// import plugins!

var minerva_search = require('./plugins').minerva_search;
var help = require('./plugins').help;
var conversation = require('./plugins').conversation;


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

var contexts = JSON.parse(fs.readFileSync(path.resolve('./', 'history.json'), 'utf8')) || {};


function get_or_create_context(user){
	if(!contexts[user]){
		contexts[user] = {extracted:[]};
	} 
	return contexts[user];
}

app.get('/', function(req, res){
	if(!req.query['query'] || !req.query['user']){
		res.send({error:'query or user not supplied'});
	}

	// extract user and query
	var query = req.query['query'];
	var user = req.query['user'];
	
	internals(query, user).then(function(ctx){
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
		
		if(event.message && event.message.text){
			console.log('query recieved:', event.message.text);

			internals(event.message.text, sender).then(function(ctx){
				// ctx.history.past_queries.push(ctx.current_query);
				if(ctx.replies.length === 0){
					ctx.replies.push('I don\'t understand what you\'re asking me :(. I\'m always improving. Until then, you can ask me to HELP you.');
				}
				for (var i = 0; i < ctx.replies.length; i++) {
					chat.reply(sender, ctx.replies[i], "EAAWEvzaBeiABAKBCX6B6j0BzUhnDq9urwcm5f0TZAcuEZCQgDBlsO2d6h6EtCv4vZBstxyiLz42R2Kt4zBCfnCv51jtbfI4iZBwhpee55usqUTuK0OprcrqBvZCQA8eWtRaw88nz4vccQsdGbiZC4PAsyBnLEfE8z7DXEGSyzlKAZDZD");
				};

			}).catch(function(err){
				console.log('error occured:',err)
				chat.reply(sender, "Something went wrong... Try again!", "EAAWEvzaBeiABAKBCX6B6j0BzUhnDq9urwcm5f0TZAcuEZCQgDBlsO2d6h6EtCv4vZBstxyiLz42R2Kt4zBCfnCv51jtbfI4iZBwhpee55usqUTuK0OprcrqBvZCQA8eWtRaw88nz4vccQsdGbiZC4PAsyBnLEfE8z7DXEGSyzlKAZDZD");
				res.send({error:err});
			});
		}
	}

	res.sendStatus(200);
})

function internals(query, user){

	// plugins to be executed
	var to_execute = [ conversation, help, minerva_search ];

	// obtain a context
	var history = get_or_create_context(user);
	
	context = {
		history: history,
		current_query: query,
		completed: false,
		replies:[]
	}
	
	return to_execute.reduce(q.when, q(context));
}

app.listen( app.get('port'), app.get('ip'), function() {
	console.log('listening on', app.get('ip'), ' on port ', app.get('port') );
});
