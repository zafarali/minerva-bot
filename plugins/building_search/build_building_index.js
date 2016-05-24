var lunr = require('lunr');
var buildings = require('./BUILDINGS.js').BUILDINGS;
var jsonfile = require('jsonfile');

var building_codes = Object.keys(buildings);

var index = lunr(function(){
	this.field('other_names', {boost:100});
	this.field('full_name', {boost:100});
	this.field('library', {boost:90});
	this.field('cafeteria', {boost:90});
	this.field('address', {boost:90});
	this.field('code', {boost:100});
	this.ref('code');
})

for (var i = 0; i < building_codes.length; i++) {
	var building = buildings[building_codes[i]];
	building['code'] = building_codes[i];
	if(building.other_names){
		building['other_names'] = building['other_names'].join(' ');
	}
	if(building.library){
		building['library'] = building['library'].join(' ');
	}
	if(building.cafeteria){
		building['cafeteria'] = building['cafeteria'].join(' ');
	}

	index.add(building);
}

var queries = [
	// 'subway',
	// 'twigs',
	// 'schulich',
	// 'library',
	// 'GIC',
	// 'Birks',
	// 'reading room',
	// 'student services',
	// 'CAPS',
	// 'career planning',
	'vinhs cafe'
]

queries.forEach(function(query){
	console.log('query:',query);
	console.log(index.search(query));
})

jsonfile.writeFileSync('./building_index.json',index);
