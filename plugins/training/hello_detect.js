var natural = require('natural')
var csv = require('fast-csv')
var fs = require('fs')
var path = require('path')
var jsonfile = require('jsonfile')
natural.LancasterStemmer.attach();


Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};


var hello_types = ['hoy', 'hi', 'hello', 'hey', 'sup', 'yo', 'whatsup'];
// var stream = fs.createReadStream(path.resolve('./', 'conv_bot_db_augmented.csv'))
// 	.pipe(csv.parse())
// 	.on('readable', function(){
// 		var row;

// 		while(null !== (row = stream.read())){
// 			var tokenized_input = row[0].tokenizeAndStem()
// 			// console.log(tokenized_input)

// 		};
// 	})
// 	.on('end', function(){
		
// 	});


var test_strings = [
	'hello',
	'Hello robot',
	'hello world',
	'here we go',
	'hey',
	'good afternoon',
	'good day',
	'goodmorning',
	'whatsup',
	'whats up',
	'what is up?',
	'where is hope',
	'Hey dude',
	'hey man',
	'hey there',
	'hey you',
	'Hey!',
	'Heyyu',
	'yo how are you',
	'hi',
	'"hi , how r u"',
	'Hi Bot',
	'Hi robot',
	'Hi robot!',
	'hi there',
	'"Hi, how are you doing"'
]

for (var j = 0; j < test_strings.length; j++) {
	var tokenized_input = test_strings[j].tokenizeAndStem();
	var contains_hello = false;
	for (var i = 0; i < hello_types.length; i++) {
		if(tokenized_input.contains(hello_types[i])){
			contains_hello = true;
			break;
		}
	}
	// console.log('contains hello', contains_hello, '\n');
	if(contains_hello){
		console.log(tokenized_input, 'contains a greeting')
	}else{
		console.log(tokenized_input, 'does not contain a greeting')
	}
};
