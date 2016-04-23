'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();
var cheerio = require('cheerio');
var q = require('q');

var ROOT_URL = 'https://horizon.mcgill.ca/pban1/';

var end_points = {
	'results':'bwckschd.p_get_crse_unsec',
}

var FBTOKEN = process.env['FBTOKEN'];

app.set('port', ( process.env.PORT || 5000 ) );

app.use(function(req,res,next){
    var _send = res.send;
    var sent = false;
    res.send = function(data){
        if(sent) return;
        _send.bind(res)(data);
        sent = true;
    };
    next();
});

// Process application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended:false} ) );
app.use( bodyParser.json() );


app.get('/', function (req, res) { 
	// result.send('Minnerva Bot!');

	// console.log();
	// var deferred = q.defer();
	// console.log(typeof(req.query.subject));
	// console.log(req.query.code);
	if(!req.query.subject){
		res.send({error:'MUST SPECIFY AT LEAST 1 COURSE'})
	}
	var query = prepare_query('201701', req.query.subject, req.query.code);
	// console.log(query);
	request(query, function (error, response, body) {
		// if ( error ) { return deferred.reject( error ); }
		if (error) { res.send({error:'ERROR OCCURED!'}); }
		// deferred.resolve({body:body,response:response});
		// console.log(body);
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
				var isLecture = $(e).children().eq(5).text();
				return !isNaN(+possible_crn) && isLecture === 'Lecture';
			}).each(function(i,e){
				// e is a single TR here:
				// get it's chldren which are the TDs:
				var to_be_saved = {};
				$(e).children().each(function (i_index, information) {
					to_be_saved[information_map(i_index)] = $(information).text();
				});
				courses.push(to_be_saved);
			});
		});
		// console.log(courses);

		res.send({ 'courses':courses });
	});

});

app.post('/webhook/', function (req, res) {
	//  USED FOR SET UP:
	// if(req.query['hub.verify_token'] == process.env['VERIFYTOKEN']) {
	// 	res.send(req.query['hub.challenge']);
	// }
	// res.send('Error, wrong token');

	var messaging_events = req.body.entry[0].messaging;

	for(i=0; i < messaging_events.length; i++){
		var event = messaging_events[i];
		var sender = event.sender.id;
		if(event.message && event.message.text){
			var text = event.message.text;
			reply(sender, "hello!");
		}
	}

	res.sendStatus(200);
});

app.listen( app.get('port'), function() {
	console.log('running now on port ', app.get('port') );
});

function information_map(index){
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
			return 'WLenrolled';
		case 15:
			return 'WLremain';
		case 16:
			return 'instructor';
		case 17:
			return 'date';
		case 18:
			return 'location';
		case 19:
			return 'status';
	}
}

function reply(sender, text){
	var reply_data = {
		text:text
	};

	request({
		url:'https://graph.facebook.com/v2.6/me/messages',
		qs: {access_token:FBTOKEN},
		method: 'POST',
		json: {
			recepient: {id:sender},
			message:reply_data,
		}
	}, function(error, response, body){
		if(error){
			console.log('ERROR SENDING MESSAGE',error);
		}else if (response.body.error){
			console.log('ERROR:', response.body.error);
		}
	});
}

function prepare_query ( term, subject, code, title ) {
	// Prepares a query url to search the schedule
	  var title = typeof title !== 'undefined' ?  title : '';
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

	return ROOT_URL+end_points['results']+EXTRA_stuff + '&term_in='+term+'&sel_subj='+subject+'&sel_crse='+code+'&sel_title='+title;
}



	