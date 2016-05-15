var natural = require('natural')
var csv = require('fast-csv')
var fs = require('fs')
var path = require('path')
var jsonfile = require('jsonfile')
natural.LancasterStemmer.attach();

var query_classify = new natural.BayesClassifier();
var both_streams_ended = false;
var NGrams = natural.NGrams;


console.log('Non-queries');
var stream = fs.createReadStream(path.resolve('./', 'conv_bot_db_augmented.csv'))
	.pipe(csv.parse())
	.on('readable', function(){
		var row;
		while(null !== (row = stream.read())){
			// console.log('unstemmed:',row);
			// console.log('stemmed:',)
			// console.log('->added document:',row[0])
			var bgrams1 = NGrams.ngrams(row[0].toLowerCase(), 2, null, '[end]')
			// var bgrams1 = NGrams.bigrams(row[0].toLowerCase());
			for (var i = 0; i < bgrams1.length; i++) {
				query_classify.addDocument(bgrams1[i], 'no');			
			};

		};
	})
	.on('end', function(){
		console.log('ended stream1');
		if ( both_streams_ended ) {
			train_it()
		} else {
			both_streams_ended = true;	
		}
		
	})


console.log('queries')
var stream2 = fs.createReadStream(path.resolve('./', 'all_courses.csv'))
	.pipe(csv.parse({headers:true}))
	.on('readable', function(){
		var row2;
		while(null !== (row2 = stream2.read())){
			// console.log('unstemmed:',row);
			// console.log('stemmed:',row.course_title.tokenizeAndStem())
			// console.log('->added document:', row2.course_title);
			var bgrams2 = NGrams.ngrams(row2.course_title.toLowerCase(), 2, null, '[end]')
			// var bgrams2 = NGrams.bigrams(row2.course_title.toLowerCase());
			for (var j = 0; j < bgrams2.length; j++) {
				query_classify.addDocument(bgrams2[j], 'yes')
			};

		};
	})
	.on('end', function(){
		console.log('ended stream 2');
		if ( both_streams_ended ) {
			train_it()
		} else {
			both_streams_ended = true;	
		}
	})

function train_it(){
	console.log('training now...');
	query_classify.train();
}



query_classify.events.on('doneTraining', function(){
	console.log('training done!')
	var example_queries = [
	'introduction to biophysics',
	'who teaches intro to computer science?',
	'who teaches introduction to computer science in the fall'
		// 'who is iron man?',
		// 'is your mother cool',
		// 'when is physics',
		// 'when is cosmology',
		// 'who ate my dog?',
		// 'who ate my marine mammals',
		// 'is joelle teaching artificial intelligence',
		// 'when is calculus 3 in the fall?',
		// 'Show me courses about Machine Learning!',
		// 'what about Forest Management?',
		// 'show me topics in molecular biology',
		// 'what about forest management?',
		// 'shakespeare',
		// 'show me dick pics',
		// 'show me pictures',
		// 'google applications',
		// 'english 555',
		// 'show me courses about Taxation taught by james',
		// 'show me principles of taxation in the winter',
		// 'Computational biology in the winter',
		// 'when is computational biology',
		// 'what time Computational Biology',
		// 'who teaches Physiology?',
		// 'show me that course about flora',
		// 'who teaches Machine Learning in the fall?',
		// 'fuck you'
	]

Array.prototype.unique = function(){
	// from underscore.js
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}

var skip_words = [
	'courses',
	'about',
	'teaches',
	'about'
]

function bigram_contains_stop_word(bigram){
	var contains_stop_word = false;
	for (var i = 0; i < skip_words.length; i++) {
		contains_stop_word = skip_words[i] == bigram[0] || skip_words[i] == bigram[1]
	};
	return contains_stop_word;
}


for (var i = 0; i < example_queries.length; i++) {
	console.log('\nquery:',example_queries[i])
	// var transformed_query = example_queries[i].tokenizeAndStem();
	// console.log('transformed_query:',transformed_query);
	// var bgrams = NGrams.bigrams(example_queries[i].toLowerCase());
	var bgrams = NGrams.ngrams(example_queries[i].toLowerCase(), 2, null, '[end]');
	var is_course_query = false;
	var search_extracted = [];
	for (var j = 0; j < bgrams.length; j++) {
		// console.log('->bigram:',bgrams[j])
		if(bigram_contains_stop_word(bgrams[j])){
			continue;
		}
		var classification = query_classify.classify(bgrams[j]);
		// console.log('-->classified',classification)
		if(classification==='yes'){
			is_course_query = true;
			search_extracted.push(bgrams[j][0]);
			search_extracted.push(bgrams[j][1]);
		}
	};

	console.log('is this a course query? ',is_course_query);
	if(is_course_query){
		console.log('the extracted query is:',search_extracted.unique())
	}
};   

jsonfile.writeFile('./query_classify.json',query_classify, function(err){
	console.log('error occured',err)
})
});

