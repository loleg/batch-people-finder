var	sys = require('sys')
	parser = require('../lib/parser');

var sample_person_xml = 'http://zesty.ca/pfif/1.2/pfif-1.2-example.xml';
var sample_person_cvs = 'some url'; // << fill in!

var person = {
	author_name: 'Bill Mandil',
	author_email: 'bmd67893@example.com',
	author_phone: '(555) 258-6902',
	source_name: 'salesforce.com',
	source_date: '2005-09-03T09:21:12Z'
};

// Loads an XML file by uri, parses it and then checks if it's converted correctly 
exports.ParseXMLFile = function(test){
	test.expect(4);
	parser.ParseFile({uri: person_finder_xml, format: 'xml'}, function(err, result){
		test.equal(result.author_name, person.author_name);
		test.equal(result.author_email, person.author_email);
		test.equal(result.author_phone, person.author_phone);
		test.equal(result.source_name, person.source_name);
		test.done();
	});
};

// Loads an CVS file by uri, parses it and then checks if it's converted correctly 
exports.ParseCSVFile = function(test){
	test.expect(4);
	parser.ParseFile({uri: person_finder_xml, format: 'csv'}, function(err, result){
		test.equal(result.author_name, person.author_name);
		test.equal(result.author_email, person.author_email);
		test.equal(result.author_phone, person.author_phone);
		test.equal(result.source_name, person.source_name);
		test.done();
	});
};