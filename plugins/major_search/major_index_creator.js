var jsonfile = require('jsonfile');
var lunr = require('lunr');

var majors = jsonfile.readFileSync('./majors.json').majors;

var index = lunr(function(){
	this.field('title', {boost:100});
	this.field('department', {boost:50});
	this.field('level', {boost:20});
	this.ref('id');
})

for (var i = 0; i < majors.length; i++) {
	// console.log(majors[i]);
	index.add(majors[i]);
}

var search_results = index.search('major in biology');

search_results.forEach(result => {
	console.log(majors[result.ref]);	
})


jsonfile.writeFileSync('./majors_index.json',index)