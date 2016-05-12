var cheerio = require('cheerio');
var request = require('request');
var ROOT_URL = 'https://horizon.mcgill.ca/pban1/';
var end_points = {
	'results':'bwckschd.p_get_crse_unsec',
}

function information_map(index){
	// Maps certain features of the payload to 
	// human readable text 
	switch (index) {
		case 0:
			return false;
		case 1:
			return 'CRN';
		case 2:
			return 'subject';
		case 3:
			return 'course_code';
		case 4:
			return 'section';
		case 5:
			return 'type';
		case 6:
			return 'credits';
		case 7:
			return 'title';
		case 8:
			return 'days';
		case 9:
			return 'time';
		case 10:
			return 'capacity';
		case 11:
			return 'enrolled';
		case 12:
			return 'available';
		case 13:
			return 'WLcapacity';
		case 14:
			return 'instructor';
		case 15:
			return 'WLremain';
		case 16:
			return 'location';
		case 17:
			return 'date';
		case 18:
			return 'date';
		case 19:
			return 'status';
	}
}

function parse_data(body){
	var $ = cheerio.load(body);

	// contains table rows which are longer than 1 element.
	// now need a way to pick out relevant sections
	var $relevant_tables = $('.datadisplaytable').children('tr').filter(function (index, element) {
		return $(this).children().length > 1;
	});


	var courses = [];
	// map all the TRs:
	$relevant_tables.map( function (index, element) {
		// this loop has the TRs as elements

		$(this).filter(function(i,e){
			// here we try to remove the TRs which do not have course
			// details in them, these are defined as those which do not
			// have numeric CRNS in the 1st TD
			var possible_crn = $(e).children().eq(1).text();
			var lectureType = $(e).children().eq(5).text() 
			var isLecture = lectureType === 'Lecture' || lectureType === 'Seminar' || lectureType === 'Topics Course';
			var isActive = $(e).children().eq(17).text() === 'Active';
			
			return !isNaN(+possible_crn) && isLecture && isActive ;
		}).each(function(i,e){
			// e is a single TR here:
			// get its chldren which are the TDs:
			var to_be_saved = {};
			$(e).children().each(function (i_index, information) {
				to_be_saved[information_map(i_index)] = $(information).text();
			});
			courses.push(to_be_saved);
		});
	});

	return courses;
}

function prepare_query ( term, subject, code, title ) {
	// Prepares a query url to search the schedule
	  var title = typeof title !== 'undefined' ?  title.replace(/\s/g, '%20') : '';
	  var subject = typeof subject !== 'undefined' ?  subject : '';
	  var code = typeof code !== 'undefined' ?  code : '';
	  var term = typeof term !== 'undefined' ?  term : '201609';
	  subject = subject.toUpperCase();
	var EXTRA_stuff	= '?display_mode_in=LIST&search_mode_in='+
	'&sel_subj=dummy&sel_day=dummy&sel_schd=dummy&sel_insm=dummy&'+
	'sel_camp=dummy&sel_levl=dummy&sel_sess=dummy&sel_instr=dummy&sel_ptrm=dummy&sel_attr=dummy'+
	// '&sel_subj='+subject+'&sel_crse='+code+'&sel_title='+title+'&sel_schd=%25&sel_from_cred=&'+
	'&sel_schd=%25&sel_from_cred=&sel_to_cred=&sel_levl=%25&sel_ptrm=%25&sel_instr=%25'+
	'&sel_attr=%25&begin_hh=0&begin_mi=0&begin_ap=a&end_hh=0&end_mi=0&end_ap=a';

	return ROOT_URL+end_points['results']+EXTRA_stuff+'&sel_subj='+subject+'&sel_crse='+code+'&sel_title='+title+'&term_in='+term;
}




exports.year_to_season = function(year){
	var ending = parseInt(year.substr(4,6));
	switch(ending){
		case 9:
			return 'fall';
		case 1:
			return 'winter';
		case 5:
			return 'summer';
	}
}
exports.prepare_query = prepare_query;
exports.parse_data = parse_data;
