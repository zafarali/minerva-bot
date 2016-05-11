var q = require('q');
var chat = require('./chat_utils.js');
var search = require('./search.js');

function minerva_search(text, context){
	
	var args = {
		queries: [],
		replies: []
	}

	console.log('query recieved:', text);
	chat.parse(text, args);

	var total_queries = args.queries.length;

	var result = q(args);
	for (var i = 0; i < args.queries.length; i++) {
		result = result.then(search.query_execute);
	};

	return result.then(function(){
		// nothing returned, just echo back that we couldn't find any courses.
		if(args.replies.length === 0){
			args.replies.push("I couldn\'t find any courses for that in the fall or winter :(")
		}

		return args.replies;

	}, function(err){
		// reply the error
		args.replies.push('I\'m sorry, something went wrong with the search');
		console.log('Error occured:', err);
		return args.replies;
	});

	// return deferred.promise;
}


exports.minerva_search = minerva_search;
