var natural = require('natural')
var csv = require('fast-csv')
var fs = require('fs')
var path = require('path')




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


var found_list = []
var stream = fs.createReadStream(path.resolve('./', 'the_keep.csv'))
	.pipe(csv.parse())
	.on('readable', function(){
		var row;
		while(null !== (row = stream.read())){
			var title = row[0].toLowerCase();
			var split_title = title.split(' the ');
			if(split_title.length > 1){
				var previous_words = split_title[0].split(' ');
				found_list.push(previous_words[ previous_words.length-1 ]);
			}
		};
	})
	.on('end', function(){
		found_list = found_list.unique();
		for (var i = 0; i < found_list.length; i++) {
			console.log(found_list[i])
			// csvStream.write(found_list[i]);
		};
		
	})



