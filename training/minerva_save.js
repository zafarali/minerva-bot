var natural = require('natural')
var csv = require('fast-csv')
var fs = require('fs')
var path = require('path')
var request = require('request');


csvStream = csv.format({headers:true})
csvStream
	.pipe(fs.createWriteStream(path.resolve('./', 'all_courses.csv')))
	.on('end', process.exit);


var lib = require('../lib.js')

var fall = lib.prepare_query('201609');
var winter = lib.prepare_query('201701');

request(fall, function (error, response, body) {
	var courses = lib.parse_data(body);
	for (var i = 0; i < courses.length; i++) {
		console.log('saving:',courses[i].title)
		csvStream.write({
			course_title:courses[i].title,
			professor:courses[i].instructor.split(',').join('|'),
			location:courses[i].location,
			course_code:courses[i].course_code,
			course_subject:courses[i].subject

		})
	};

	request(winter, function (error, response, body) {
		var courses = lib.parse_data(body);
		for (var i = 0; i < courses.length; i++) {
			console.log('saving:',courses[i].title)
			csvStream.write({
				course_title:courses[i].title,
				professor:courses[i].instructor.split(',').join('|'),
				location:courses[i].location,
				course_code:courses[i].course_code,
				course_subject:courses[i].subject

			});
		};
		csvStream.end();
	});
});
