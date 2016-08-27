// Building codes ordered by most common (this is to speed up searches in loops)
exports.common_buildings = ['ADAMS','MCLIB', 'REDLIB', 'ENGMC', 'SCHULICH', 'ARTS', 'LEA', 'BURN', 'BRONF', 'STBIO', 'LAW', 'RPHYS', 'MAASS', 'MUSIC','FERR', 'MCMED', 'ENGTR', 'JAMES', 'EDUC' ,'ENGMD', 'WONG', 'YINTERSECTION', 'REDMUS', 'LOWERFIELD'];

// list of buildings to help narrow down results.
exports.libraries = ['REDLIB', 'MCLIB', 'SCHULICH', 'LAW', 'ELIZ', 'BURN', 'EDUC', 'MOR', 'BARTON','MCMED', 'MCLIB2'];
exports.residences = [ 'NRH','C4','SOLIN', 'UNIH','GREENBRIAR', 'RVC', 'LACIT', 'DOUGLAS', 'BISHOP', 'GARDNER', 'MCCH', 'MOLSON'];
exports.cafeterias = ['BISHOP','DOUGLAS','C4','SSMU','REDLIB','BRONF','EDUC','ENGMC','ARTS','GENOME','ENGTR','RVC','MCMED','CDH','CURRIE', 'DOUGLAS','STBIO','NRH','BISHOP'];

// Building codes according to: http://www.is.mcgill.ca/whelp/sis_help/building_codes.pdf
BUILDINGS = {
	'RODDICKGATES':{
		full_name:'Roddick Gates',
		other_names:['main gate', 'entrance gates'],
		address:'845 Sherbrooke St. West, Montreal, QC H3A 2T5, Canada',
		image:'https://upload.wikimedia.org/wikipedia/commons/2/2d/McGill_University_Montr%C3%A9al.jpeg'
	},
	'SERVICEPOINT':{
		full_name:'Service Point',
		other_names:['Reception', 'campus tour'],
		address:'3415 McTavish Street, Montréal, QC, H3A 0C8',
		link:'https://www.mcgill.ca/students/servicepoint/',
		image:'http://www.mcgill.ca/library/files/library/med-mclennan_180w.jpg'
	},
	'MILTONGATES':{
		full_name:'Milton Gates',
		address:'3500 Rue University, Montréal, QC H3A 2A7',
		image:'https://upload.wikimedia.org/wikipedia/commons/d/da/Milton_Gates_(McGill_University)_(2),_Montreal_2005-08-30.jpg'
	},
	'YINTERSECTION':{
		full_name: 'Y-Intersection',
		address: '45.504679, -73.576446',
		image:'http://i.imgur.com/Wdv4eQO.jpg'
	},
	'3BARES':{
		full_name: 'Three Bares Park',
		other_names:['OAP', 'OAP park', 'outdoor air pub', 'open air pub'],
		address:'45.504803, -73.577028',
		image:'http://publications.mcgill.ca/reporter/files/2010/11/4305-MEMORIES-3Bares-SMITH.jpg'
	},
	'LOWERFIELD':{
		full_name: 'Lower Field',
		address:'45.504209, -73.576487',
		image:'https://c1.staticflickr.com/1/180/485457780_a805b12096_b.jpg'
	},
	'MOUNTAIN':{
		full_name:'Mountain 3605',
		other_names:['Martlet House'],
		address:'3605 rue de la Montagne Montreal, QC H3G 2M1',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/156_mountain_3605.JPG?itok=kLaZZKNZ',
		link:'https://www.mcgill.ca/maps/mountain-3605'
	},
	'MARTLET':{
		full_name:'Martlet House',
		other_names:[],
		address:'1430 rue Peel, Montreal, QC H3A 3T3, Canada',
		link:'http://www.mcgill.ca/maps/martlet-house',
		image:'http://www.mcgill.ca/maps/files/maps/styles/medium/public/locations/242_martlet_house.JPG?itok=NluSAA8z'
	},
	'BOOKSTORE':{
		full_name:'Le James (Course Materials)',
		other_names:['bookstore'],
		address:'3544 Ave du Parc, Montreal Canada',
		link:'https://www.bookstore.mcgill.ca/',
		image:'https://www.bookstore.mcgill.ca/sites/default/files/news/image/parc_opening.jpg'
	},
	'BOOKSTORE2':{
		full_name:'Le James (Clothing and Insignia)',
		other_names:['bookstore'],
		address:'680 Sherbrooke W, Montreal Canada',
		link:'https://www.bookstore.mcgill.ca/'
	},
	'ADAMS':{
		full_name:'Adams Building',
		other_names:['fda', 'adams aud', 'frank dawson adams'],
		address:'3450 rue University, Montreal, QC H3A 0E8',
		link:'https://www.mcgill.ca/maps/adams-building',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/177_adams.jpg?itok=hQlCK616'
	},
	// 'AGTECH':{
	// 	full_name:'Agriculture & Engineering Labs',
	// 	other_names:[],
	// 	address:''
	// },
	'ARTS':{
		full_name:'Arts Building',
		other_names:['subway','arts building'],
		address:'853 rue Sherbrooke Ouest, Montreal, QC H3A 0G5, Canada',
		cafeteria:['Subway'],
		link:'https://www.mcgill.ca/maps/arts-building',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/103_arts.jpg?itok=7iy_miSy'
	},
	'BARTON':{
		full_name:'Barton Building',
		other_names:['barton macdonald', 'macdonald stewart', 'Cafe TWIGS'],
		address:'',
		cafeteria:['Cafe TWIGS'],
		library:['Macdonald Campus Library'],
		library_link:'http://www.mcgill.ca/library/branches/macdonald',
		link:'https://www.mcgill.ca/maps/barton-building',
		image:'https://www.mcgill.ca/maps/files/maps/styles/medium/public/locations/405_barton.jpg?itok=YCAfsOBI'
	},
	'BURN':{
		full_name:'Burnside Building',
		other_names:['burnside', 'burnside basement', 'soupe cafe', 'gic', 'geography library', 'burnside hall', 'geography information centre'],
		address:'805 Sherbrooke Street West, Montreal, Quebec,Canada H3A 0B9',
		cafeteria:['Soupe Cafe'],
		library:['Geographic Information Centre'],
		library_link:'http://gic.geog.mcgill.ca/',
		link:'https://www.mcgill.ca/maps/burnside-hall',
		image:'http://www.mcgill.ca/library/files/library/med-hitschfeld_180w.jpg'
	},
	'BEATTY':{
		full_name:'Beatty Hall',
		other_names:[],
		address:''
	},
	'BIRKS':{
		full_name:'Birks Building',
		other_names:['birks', 'reading room'],
		address:'3520 University Street, Montreal, Quebec H3A 2A7',
		library:['birks reading room'],
		library_link:'http://www.mcgill.ca/library/branches/birks',
		image:'http://www.mcgill.ca/library/files/library/med-birks_180w.jpg',
		link:'https://www.mcgill.ca/maps/birks-building'

	},
	'BRONF':{
		full_name:'Bronfman Building',
		other_names:['Bronfman', 'quesada', 'bento sushi', 'bento'],
		address:'1001 rue Sherbrooke Ouest, Montreal, QC H3A 1G5, Canada',
		cafeteria:['Quesada', 'Bento Sushi'],
		link:'https://www.mcgill.ca/maps/bronfman-building',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/102_bronfman.JPG?itok=Avux3tr2'
	},
	'BROWNS':{
		full_name:'Brown Student Services',
		other_names:['brown building', 'CAPS', 'student services', 'mcgill clinic', 'clinic', 'career planning services'],
		address:'3600 rue McTavish, Montreal, QC H3A 0G3, Canada',
		link:'https://www.mcgill.ca/maps/brown-student-services',
		image:'https://www.mcgill.ca/maps/files/maps/styles/medium/public/locations/236_brown.JPG?itok=GMEYXZ3v'
	},
	'LIFE':{
		full_name:'Life Sciences Complex',
		other_names:['Bellini', 'goodman', 'cancer centre'],
		address:'3649 promenade Sir William Osler, Montreal, QC H3G 0B1',
		link:'https://www.mcgill.ca/maps/life-sciences-complex',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/241_life_sciences_complex.jpg?itok=AWvdaJCf'
	},
	'BISHOP':{
		full_name:'Bishop Mountain Hall',
		other_names:['bishop', 'bmh'],
		address:'3935 University Street, Montreal, Quebec, H3A 2B4',
		cafeteria:['Bishop Mountain Dining Hall'],
		link:'https://www.mcgill.ca/maps/bishop-mountain-hall',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/134_bishop_mountain_hall.JPG?itok=-2hKAFb5'
	},
	'CMH':{
		full_name:'Charles Meredith House',
		other_names:[],
		address:'1130 avenue des Pins Ouest, Montreal, QC H3A 1A3',
		link:'https://www.mcgill.ca/maps/charles-meredith-house',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/173_charles_merideth_house.jpg?itok=SglnFWad'
	},
	'CDH':{
		full_name:'Chancellor Day Hall',
		other_names:['avvacato', 'cdh'],
		address:'3644 rue Peel, Montreal, QC H3A 1W9, Canada',
		cafeteria:['Avvacato'],
		link:'https://www.mcgill.ca/maps/chancellor-day-hall',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/122_chancellor_day_hall.JPG?itok=V65PdRpB'
	},
	'CENTEN':{
		full_name:'Centennial Centre',
		other_names:[],
		link:'https://www.mcgill.ca/maps/centennial-centre',
		address:'21111 Lakeshore Road, St Anne de Bellevue, QC H9X 3V9, Canada',
		image:'https://www.mcgill.ca/maps/files/maps/styles/medium/public/locations/411_centennial_centre.jpg?itok=vra3Y9vJ'
	},
	'C4':{
		full_name:'Carrefour Sherbrooke',
		other_names:['carrefoure', 'c4'],
		address:'475 Sherbrooke West, Montreal, Quebec,H3A 2L9',
		cafeteria:['Carrefour Sherbrooke'],
		link:'https://www.mcgill.ca/maps/residence-carrefour-sherbrooke',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/121_carrefour_sherbrooke.JPG?itok=uPMLXYP5'
	},
	'LACIT':{
		full_name:'La Citadelle',
		other_names:['citadelle'],
		address:'410 Sherbrooke West, Montreal, QC, H3A 1B3',
		cafeteria:['Citadelle Cafeteria'],
		link:'https://www.mcgill.ca/students/housing/rez-options/downtown-undergrad/citadelle'
	},
	'LAW':{
		full_name:'Nahum Gelber Law Library',
		other_names:['law library'],
		address:'3660 Peel Street, Montreal, Quebec H3A 1W9',
		library:['Nahum Gelber Law Library'],
		library_link:'http://www.mcgill.ca/library/branches/law',
		image:'http://www.mcgill.ca/library/files/library/med-law_180w.jpg',
		link:'https://www.mcgill.ca/maps/gelber-law-library'
	},
	'CURRIE':{
		full_name:'Currie Gymnasium',
		other_names:['athletics cafe', 'gym', 'athletics caf'],
		cafeteria:['Athletics Cafe'],
		address:'475 avenue des Pins Ouest, Montreal, QC H2W 1S4, Canada',
		link:'https://www.mcgill.ca/maps/currie-gymnasium',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/139_currie_gym.jpg?itok=dpSL1PdU'
	},
	'JAMES':{
		full_name:'James Administration Building',
		other_names:['admin'],
		address:'845 rue Sherbrooke Ouest, Montreal, QC H3A 2T7, Canada',
		link:'http://www.mcgill.ca/maps/james-administration-building',
		image:'http://www.mcgill.ca/maps/files/maps/styles/medium/public/locations/112_james_admin.JPG?itok=FxpqKli3'
	},
	'DAVIS':{
		full_name:'Davis House',
		other_names:[],
		address:''
	},
	'DAWSON':{
		full_name:'Dawson Hall',
		other_names:[],
		address:'853 rue Sherbrooke Ouest, Montreal, QC H3A 0G5, Canada',
		image:'https://www.mcgill.ca/maps/files/maps/styles/medium/public/locations/123_dawson_hall.JPG?itok=Zy6598IF',
		link:'https://www.mcgill.ca/maps/dawson-hall'
	},
	'DUFF':{
		full_name:'Duff Medical Building',
		other_names:[],
		address:'3775 rue University, Montreal, QC H3A 2B4',
		link:'http://mcgill.ca/maps/duff-medical-building',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/169_duff.jpg?itok=w1_nKGRw'
	},
	'DOUGLAS':{
		full_name:'Douglas Hall',
		other_names:['doug', 'douglas hall'],
		address:'3851 University Street, Montreal, Quebec, H3A 2B4',
		cafeteria:['Douglas Hall'],
		link:'https://www.mcgill.ca/maps/douglas-hall',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/125_douglas_hall.jpg?itok=M20_ehTp'
	},
	'DUGGAN':{
		full_name:'Duggan House',
		other_names:[],
		address:'3724 rue McTavish, Montreal, QC H3A 1Y2',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/127_duggan_house.jpg?itok=0IB71aZJ',
		link:'https://www.mcgill.ca/maps/duggan-house'
	},
	'EDUC':{
		full_name:'Education Building',
		other_names:[],
		address:'3700 McTavish Street, Montreal, Quebec H3A 1Y2',
		cafeteria:['Education cafe'],
		library:['Education Curriculum Resources Centre'],
		library_link:'http://www.mcgill.ca/library/branches/education',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/168_education.jpg?itok=43k54Hhe',
		link:'https://www.mcgill.ca/maps/education-building'
	},
	'ENGMC':{
		full_name:'McConnel Engineering Building',
		other_names:['dispatch', 'ecaf', 'mcconnel', 'engineering building', 'mcconnel caf', 'dispatch cafe', 'frostbite', 'ice cream'],
		address:'',
		cafeteria:['Dispatch', 'E-cafe', 'FrostBite'],
		link:'https://www.mcgill.ca/maps/mcconnell-engineering-building',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/131_mcconnell_engineering.JPG?itok=vU9Lm4f2'
	},
	'ENGMD':{
		full_name:'Macdonald Engineering Building',
		other_names:[],
		address:'817 rue Sherbrooke Ouest, Montreal, QC H3A 0C3',
		link:'https://www.mcgill.ca/maps/macdonald-engineering-building',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/130_macdonald_engineering.jpg?itok=o4zO7ZUH'
	},
	'ENGTR':{
		full_name:'Trottier Building',
		other_names:['trottier', 'paramount','trottier cafe'],
		address:'3630 rue University, Montreal, QC H3A 0C6',
		cafeteria:['Paramount Fine Foods'],
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/240_trottier.JPG?itok=r1vQpyZ4',
		link:'https://www.mcgill.ca/maps/trottier-building'
	},
	'FARM':{
		full_name:'Farm Centre',
		other_names:['R. Howard Webster Centre'],
		link:'https://www.mcgill.ca/macdonaldfarm/rhwcentre',
		address:'21,111 Lakeshore Rd. Ste-Anne-de-Bellevue, Qc H9X 3V9',
		image:'https://www.mcgill.ca/macdonaldfarm/files/macdonaldfarm/farm-overview-web.jpg'
	},
	'FERR':{
		full_name:'Ferrier Building',
		other_names:[],
		address:'840 avenue du Docteur-Penfield, Montreal, QC H3A 0G2',
		link:'https://www.mcgill.ca/maps/ferrier-building',
		image:'https://www.mcgill.ca/maps/files/maps/styles/medium/public/locations/197_ferrier.JPG?itok=yad7VboD'
	},
	'SSMU':{
		full_name: 'University Centre',
		other_names:['SRC','student caf', 'la prep','William Shatner University Centre', 'shatner building', 'shatner', 'ssmu'],
		address:'3480 rue McTavish, Montreal, QC H3A 0E7, Canada',
		cafeteria:['Student Run Cafeteria', 'La Prep'],
		link:'https://www.mcgill.ca/maps/university-centre',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/172_university_centre.JPG?itok=72s64OXL'
	},
	'FIELD':{
		full_name:'In field',
		other_names:[],
		address:''
	},
	'FPHR':{
		full_name:'First Peoples House Residence',
		other_names:[],
		address:''
	},
	'GARDNER':{
		full_name:'Gardner Hall',
		other_names:['gardner'],
		address: '3925 University Street, Montreal, Quebec, H3A 2B7',
		link:'https://www.mcgill.ca/maps/gardner-hall',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/133_gardner_hall.JPG?itok=AL9S1ham'
	},
	'GREENBRIAR':{
		full_name:'Greenbriar Apartments',
		other_names:[],
		address: '3575 University St. Room Montreal, Quebec, H3A 2B1',
		link:'https://www.mcgill.ca/maps/university-3575'
	},
	'GENOME':{
		full_name:'McGill University and Génome Québec Innovation Centre',
		other_names:['vinhs', 'genome building', 'genome center'],
		address:'740 avenue du Docteur-Penfield, Montreal, QC H3A 0G1, Canada',
		cafeteria:['Vinhs Cafe'],
		link:'https://www.mcgill.ca/maps/penfield-740-genome',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/239_penfield_740.JPG?itok=z1D81517'
	},
	'HOSMCH':{
		full_name:'Hosmer Coach House',
		other_names:[],
		address:''
	},
	'HOSMER':{
		full_name:'Hosmer House',
		other_names:[],
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/149_hosmer_house.jpg?itok=vdhQGF0x',
		address:'3630 Sir William Osler, Montreal, QC H3G 1Y5',
		link:'https://www.mcgill.ca/maps/hosmer-house'
	},
	'JGH':{
		full_name:'Jewish General Hospital',
		other_names:[],
		address:''
	},
	'LEA':{
		full_name:'Leacock Building',
		other_names:[],
		address:'855 rue Sherbrooke Ouest, Montreal, QC H3A 2T7, Canada',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/150_leacock.JPG?itok=peYPVyMt',
		link:'https://www.mcgill.ca/maps/leacock-building'
	},
	'MAASS':{
		full_name:'Maass Chemistry Building',
		other_names:['chemistry building'],
		address:'801 rue Sherbrooke Ouest, Montreal, QC H3A 0B8, Canada',
		link:'https://www.mcgill.ca/maps/maass-chemistry-building',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/119_otto_maass.jpg?itok=yRITXBlN'
	},
	'MOLSON':{
		full_name:'Molson Hall',
		other_names:['molson'],
		address:'3915 University Street, Montreal, Quebec, H3A 2B6',
		link:'https://www.mcgill.ca/maps/molson-hall',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/116_molson_hall.jpg?itok=jWSl6PYA'
	},
	'MOLSTADIUM':{
		full_name:'Molson Stadium',
		other_names:[],
		address:'475 avenue des Pins Ouest, Montreal, QC H2W 1S4, Canada',
		link:'https://www.mcgill.ca/maps/molson-stadium',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/106_molson_stadium.jpg?itok=ClWWevOR'
	},
	'MCCH':{
		full_name:'McConnell Hall',
		other_names:[],
		address:'3905 University Street, Montreal, Quebec, H3A 2B5',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/221_mcconnell_hall.JPG?itok=AqafUN2C',
		link:'https://www.mcgill.ca/maps/mcconnell-hall'
	},
	'MCLIB':{
		full_name:'McLennan Library Building',
		other_names:['HSSL', 'mclennan', 'humanities library'],
		address:'459 McTavish Street, Montreal, Quebec H3A 0C9',
		library:['Humanities and Social Sciences Library'],
		library_link:'http://www.mcgill.ca/library/branches/hssl',
		image:'http://www.mcgill.ca/library/files/library/med-mclennan_180w.jpg'
	},
	'MCLIB2':{
		full_name:'McLennan Library Building',
		other_names:['rare books'],
		address:'459 McTavish Street, Montreal, Quebec H3A 0C9',
		library:['Rare Books and Special Collections'],
		library_link:'http://www.mcgill.ca/library/branches/rarebooks',
		image:'http://www.mcgill.ca/library/files/library/med-mclennan_180w.jpg'
	},
	'MCMED':{
		full_name:'McIntyre Medical Building',
		other_names:['McIntyre', 'med building', 'med cafe', 'med library', 'osler library'],
		address:'3655 promenade Sir William Osler, Montreal, QC H3G 1Y6,Canada',
		cafeteria:['Med Cafe'],
		library:['Osler Library of the History of Medicine'],
		library_link:'http://www.mcgill.ca/library/branches/osler',
		link:'https://www.mcgill.ca/maps/mcintyre-medical-building',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/155_mcintyre_medical.JPG?itok=918y0hdE'
	},
	'MDHAR':{
		full_name:'Macdonald Harrington Building',
		other_names:['architecture building'],
		address:'815 rue Sherbrooke Ouest, Montreal, QC H3A 0C2',
		link:'https://www.mcgill.ca/maps/macdonald-harrington-building',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/118_macdonald_harrington.jpg?itok=q0kwVnkR'

	},
	'MGH':{
		full_name:'Montreal General Hospital',
		other_names:[],
		address:''
	},
	'HUGESSEN':{
		full_name:'Hugessen House',
		link:'https://www.mcgill.ca/maps/hugessen-house',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/167_huggensen_house.jpg?itok=GqYunTgE',
		other_names:[],
		address:'3666 rue McTavish, Montreal, QC H3A 1Y2, Canada'
	},
	'MNI':{
		full_name:'Montreal Neurological Institute',
		other_names:['MNI', 'neuro'],
		address:'3801 rue University, Montreal, QC H3A 2B4, Canada',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/159_MNI.jpg?itok=CfwWi-V3',
		link:'https://www.mcgill.ca/maps/montreal-neurological-institute'
	},
	'MOR':{
		full_name:'Morrice Hall',
		other_names:['islamic library'],
		address:'3485 McTavish Street, Montreal, Quebec H3A 0E1',
		library:['Islamic Studies Library'],
		library_link:'http://www.mcgill.ca/library/branches/islamic',
		image:'https://www.mcgill.ca/maps/files/maps/styles/medium/public/locations/163_morrice_hall.JPG?itok=l1niGjV-',
		link:'https://www.mcgill.ca/maps/morrice-hall'
	},
	'MOYSE':{
		full_name:'Moyse Hall',
		other_names:[],
		address:'853 rue Sherbrooke Ouest, Montreal, QC H3A 0G5, Canada',
		link:'https://www.mcgill.ca/maps/arts-building',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/103_arts.jpg?itok=7iy_miSy'

	},
	'MT3434':{
		full_name:'McTavish 3434',
		other_names:[],
	},
	'MT3438':{
		full_name:'McTavish 3238',
		other_names:[],
		address:''
	},
	'MUSIC':{
		full_name:'Strathcona Music Building',
		other_names:['Strathcona', 'music building', 'vinhs too'],
		address:'555 rue Sherbrooke Ouest, Montreal, QC H3A 1E3 ,Canada',
		cafeteria:['Vinhs Too'],
		link:'https://www.mcgill.ca/maps/strathcona-music-building',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/120_strathcona_music.jpg?itok=ZZyitM6A'
	},
	'ELIZ':{
		full_name:'Elizabeth Wirth Music Building',
		other_names:['music building', 'music library', 'tanna schulich'],
		address:'527 Sherbrooke Street West, Montreal, Quebec H3A 1E3',
		library:['Marvin Duchow Music Library'],
		library_link:'http://www.mcgill.ca/library/branches/music',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/245_new_music.jpg?itok=ExmezRUc'
	},
	'NRH':{
		full_name:'New Residence Hall',
		other_names:['new rez'],
		address:'3625 ave du Parc, Montreal, Quebec, H2X 3P8',
		cafeteria:['New Residence Hall', 'Premier Moisson'],
		link:'https://www.mcgill.ca/maps/new-residence-hall',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/244_new_residence_hall.JPG?itok=N-v91ycm'
	},
	'PARA':{
		full_name:'Insitute of Parasitology',
		other_names:[],
		address:''
	},
	'PE1085':{
		full_name:'Dr Penfield 1085',
		other_names:[],
		address:''
	},
	'PETH':{
		full_name:'Peterson Hall',
		other_names:[],
		address:''
	},
	'PILOT':{
		full_name:'Pilot House',
		other_names:[],
		address:''
	},
	'PL3465':{
		full_name:'Peel 3465',
		other_names:[],
		address:''
	},
	'PL3475':{
		full_name:'Peel 3475',
		other_names:[],
		address:''
	},
	'PL3487':{
		full_name:'Peel 3487',
		other_names:[],
		address:''
	},
	'PL3647':{
		full_name:'Peel 3647',
		other_names:[],
		address:''
	},
	'PL3690':{
		full_name:'Peel 3690',
		other_names:[],
		address:''
	},
	'PL3715':{
		full_name:'Peel 3715',
		other_names:[],
		address:''
	},
	'PN1033':{
		full_name:'Pine 1033',
		other_names:[],
		address:''
	},
	'POLY':{
		full_name:'Ecole Polytechnique',
		other_names:[],
		address:''
	},
	'PURVIS':{
		full_name:'Purvis Hall',
		other_names:[],
		address:'1020 avenue des Pins Ouest, Montreal, QC H3A 1A2, Canada',
		link:'https://www.mcgill.ca/maps/purvis-hall',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/174_purvis_hall.jpg?itok=AoF4McEq'
	},
	'RAYMND':{
		full_name:'Raymond Building',
		other_names:[],
		address:'21111 Lakeshore Road, St Anne de Bellevue, QC H9X 3V9,Canada',
		link:'https://www.mcgill.ca/maps/raymond-building',
		image:'https://www.mcgill.ca/maps/files/maps/styles/medium/public/locations/485_raymond_building.jpg?itok=VidKIhhJ'
	},
	'REDLIB':{
		full_name:'Redpath Library',
		other_names:['premiere moisson', 'redpath', 'blackadder', 'redpath caf'],
		address:'3459 rue McTavish, Montreal, QC H3A 0C9, Canada',
		cafeteria:['Premiere Moisson'],
		library:['Blackadder-Lauterman'],
		library_link:'https://www.mcgill.ca/architecture/facilities/library',
		link:'https://www.mcgill.ca/maps/redpath-library-building',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/178_redpath_library.JPG?itok=e7xY-Lxr'
	},
	'REDMUS':{
		full_name:'Redpath Museum',
		other_names:[],
		address:'859 rue Sherbrooke Ouest, Montreal, QC H3A 0C4',
		link:'https://www.mcgill.ca/maps/redpath-museum',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/179_redpath_museum.JPG?itok=P6YwXpRy'
	},
	'REDMPTH':{
		full_name:'Redpath Hall',
		other_names:[],
		address:'3461 rue McTavish Montreal, QC H3A 2K6',
		link:'https://www.mcgill.ca/maps/redpath-hall',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/181_redpath_hall.JPG?itok=pfJEbWWx'
	},
	'RPHYS':{
		full_name:'Rutherford Physics Building',
		other_names:['physics building', 'rutherford physics', 'rphys'],
		address:'3600 rue University, Montreal, QC H3A 2T8, Canada',
		link:'https://www.mcgill.ca/maps/rutherford-physics-building',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/189_rutherford_physics.jpg?itok=AbePkkbR'
	},
	'RVH':{
		full_name:'Royal Victoria Hospital',
		other_names:['rvh'],
		address:''
	},
	'LMR':{
		full_name:'Lady Meredith House',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/148_lady_meredith_house.jpg?itok=jpnJt3Kb',
		address:'1110 avenue des Pins Ouest, Montreal, QC H3A 1A3, Canada',
		link:'https://www.mcgill.ca/maps/lady-meredith-house'
	},
	'RVC':{
		full_name:'Royal Victoria College',
		other_names:['rvc'],
		address:'3425 University Street, Montreal, Quebec, H3A 2A8',
		cafeteria:['RVC Dining Hall'],
		image:'http://www.mcgill.ca/students/housing/files/students.housing/styles/slider_full_size/public/exterior_rvc2_0.jpg?itok=yi70nfny'
	},
	'SADB':{
		full_name:'Strathcona Anatomy & Dentistry Building',
		other_names:['dentistry building'],
		address:'3640 rue University, Montreal, QC H3A 0C7, Canada',
		link:'https://www.mcgill.ca/maps/strathcona-anatomy-and-dentistry-building',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/154_strathcona_anatomy_and_dentistry.JPG?itok=PqFlKJej'
	},
	'SCHOOL':{
		full_name:'School Teaching',
		other_names:[],
		address:''
	},
	'SOLIN':{
		full_name:'Solin Hall',
		other_names:['solin'],
		address:'3510 Lionel-Groulx, Montreal, QC H4C 1M7',
		link:'https://www.mcgill.ca/maps/solin-hall',
		image:'https://www.mcgill.ca/maps/files/maps/styles/medium/public/locations/146_solin_hall.jpg?itok=nRMYbs6I'
	},
	'SH550':{
		full_name:'Sherbrooke 550',
		other_names:[],
		address:''
	},
	'SH688':{
		full_name:'Sherbrooke 688',
		other_names:['688'],
		address:'688 rue Sherbrooke Ouest, Montreal, QC H3A 3R1, Canada',
		link:'https://www.mcgill.ca/maps/sherbrooke-688',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/233_sherbrooke_688.JPG?itok=nN59GXtY'
	},
	'MACSTW':{
		full_name:'Macdonald-Stewart Library Building',
		other_names:['Schulich', 'engineering library'],
		address:'809 Sherbrooke Street West, Montreal, Quebec H3A 0C1',
		link: 'https://www.mcgill.ca/maps/macdonald-stewart-library-building',
		library:['Schulich Library of Science and Engineering'],
		library_link:'http://www.mcgill.ca/library/branches/schulich'
	},
	'STBIO':{
		full_name:'Stewart Biology Building',
		other_names:['stbio', 'stewart biology', 'biology', 'second cup'],
		address:'1205 avenue du Docteur-Penfield, Montreal, QC H3A 1B1, Canada',
		cafeteria:['Second Cup'],
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/111_stewart_biology.JPG?itok=7YOLLXYL',
		link:'https://www.mcgill.ca/maps/stewart-biology-building'
	},
	'STHALL':{
		full_name:'Stewart Hall',
		other_names:[],
		address:''
	},
	'UNIH':{
		full_name:'University Hall',
		other_names:['uni hall', 'dio'],
		address:'3473 rue University, Montreal, QC H3A 2A8, Canada',
		link:'https://www.mcgill.ca/maps/university-hall-residence',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/251_university_hall_residence.JPG?itok=Q1GzbT9D'
	},
	'WILSON':{
		full_name:'Wilson Hall',
		other_names:['nursing building'],
		address:'3506 rue University, Montreal, QC H3A 2A7, Canada',
		link:'https://www.mcgill.ca/maps/wilson-hall',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/198_wilson_hall.jpg?itok=bm49chob'
	},
	'WONG':{
		full_name:'Wong Building',
		other_names:[],
		address:'3610 rue University, Montreal, QC H3A 0C5',
		link:'https://www.mcgill.ca/maps/wong-building',
		image:'https://www.mcgill.ca/maps/files/maps/styles/mcgill_maps_thumb_170x140/public/locations/229_wong.JPG?itok=pD2JWN5z'
	}
}

exports.BUILDINGS = BUILDINGS;
exports.all_buildings = Object.keys(BUILDINGS);
