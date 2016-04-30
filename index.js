'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var cheerio = require('cheerio');
var q = require('q');
var chat = require('./chat_utils.js');
var search = require('./search.js');

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


app.get('/', function (req, res) { 
	// result.send('Minnerva Bot!');

	// console.log();
	// var deferred = q.defer();
	// console.log(typeof(req.query.subject));
	// console.log(req.query.code);
	res.send({error:'API is no longer accessible via get request'})
	// var query = prepare_query('201701', req.query.subject, req.query.code);
	// // console.log(query);
	// request(query, function (error, response, body) {
	// 	// if ( error ) { return deferred.reject( error ); }
	// 	if (error) { res.send({error:'ERROR OCCURED!'}); }
	// 	// deferred.resolve({body:body,response:response});
	// 	// console.log(body);
	// 	var courses = parse_data(body);
	// 	// console.log(courses);

	// 	res.send({ 'courses':courses });
	// });

});


app.get('/webhook', function (req, res) {
		//  USED FOR SET UP:
	if(req.query['hub.verify_token'] == process.env['VERIFYTOKEN']) {
		res.send(req.query['hub.challenge']);
	}
	res.send('Error, wrong token');
});

app.post('/webhook/', function (req, res) {



	var messaging_events = req.body.entry[0].messaging;

	for(var i=0; i < messaging_events.length; i++){
		var event = messaging_events[i];
		var sender = event.sender.id;

		if(event.message && event.message.text){

			var args = {
				queries: [],
				replies: []
			}
			var text = event.message.text;
			console.log('query recieved:', text);
			chat.parse(text, args);

			var result = q(args);
			for (var i = 0; i < args.queries.length; i++) {
				result = result.then(search.query_execute);
			};

			result.then(function(){
				// reply all the messages
				for (var i = 0; i < args.replies.length; i++) {
					chat.reply(sender, args.replies[i]);
				};

			}, function(err){
				// reply the error
				chat.reply(sender, 'I\'m sorry, something went wrong with the search');
				console.log('Error occured:', err);
			})
		}
	}

	res.sendStatus(200);
});

app.listen( app.get('port'), app.get('ip'), function() {
	console.log('listening on', app.get('ip'), ' on port ', app.get('port') );
});







	