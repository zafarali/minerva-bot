var chat = require('./chat_utils.js');
var search = require('./search.js');

var q = require('q');

var test_strings = [
	"how are you",
	"who are you",
	"whatsup",
	"hello there",
	"what time is biol 201", 
	"where is phys 230?", 
	"machine learning",
	"when is principles of taxation?",
	"who teaches topics in geometry in the fall",
	"fuck off!",
	"where is quantum physics",
	"which room is intro biology in"
];



var q = require('q');


var args = {
	queries: [],
	replies: []
}

for (var i = 0; i < test_strings.length; i++) {
	// make everything upper case, replace spaces
	chat.parse(test_strings[i], args);
};
// console.log(args)
var result = q(args);
for (var i = 0; i < args.queries.length; i++) {
	// console.log('in for loop now')
	// console.log('making promise for query:',args.queries[i]);
	result = result.then(search.query_execute);
};

result.then(function(res){
	console.log('success!', res);
	console.log(args);
}, function(err){
	console.log(arrays);
	console.log('err', err);
})