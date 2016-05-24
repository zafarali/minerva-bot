var csv = require('fast-csv')
var fs = require('fs')
var path = require('path')
var jsonfile = require('jsonfile')
var lunr = require('lunr');

var index = lunr(function(){
	this.field('building', {boost:100});
	this.field('department', {boost:50});
	this.ref('id');
});

var uprints = [];


var stream = fs.createReadStream(path.resolve('./', 'uprint_locations.csv'))
	.pipe(csv.parse())
	.on('readable', function(){
		var row;
		while(null !== (row = stream.read())){
			uprints.push({
				building:row[0],
				department:row[2],
				location:row[1],
				bw:row[3],
				color:row[4],
				id:uprints.length
			});

			index.add({
				building:row[0],
				department:row[2],
				id:uprints.length	
			});
		}
	})
	.on('end', function(){
		jsonfile.writeFileSync('./uprint_index.json',index);
		jsonfile.writeFileSync('./uprints_json.json',{uprints:uprints});
	})