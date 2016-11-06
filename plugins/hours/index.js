// a simple module to search for library and (soon) cafeteria hours
// examples of queries:
// "is mclennan open?"
// "what cafeterias are open?"
// "what time does the library close?"

var request = require('request');

// Read in building information
var jsonfile = require('jsonfile');
var lunr = require('lunr');
var path = require('path');
var building_index = lunr.Index.load(jsonfile.readFileSync(path.resolve('./plugins/building_search', 'building_index.json')));
var buildings = require('./BUILDINGS.js').BUILDINGS;


var utils = require('../../utils.js');
var chat_builders = require('../../chat_utils.js').builders;
var natural = require('natural')
natural.LancasterStemmer.attach();


function hours(context){
	

	return context;
}