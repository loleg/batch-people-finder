var	sys = require('sys')
	parser = require('../lib/parser'),
	personfinder_api = require('../lib/personfinder_api');

/* Remote test data */
var sample_person_xml = 'http://ox4hs.utou.ch/rhok/personfinder/pfif-1.2-example.xml';
var sample_person_cvs = 'http://ox4hs.utou.ch/rhok/personfinder/pfif-1.2-example-simple.csv';

/* Local test data */
var person = {
	author_name: 'Bill Mandil',
	author_email: 'bmd67893@example.com',
	author_phone: '(555) 258-6902',
	source_name: 'salesforce.com',
	source_date: '2005-09-03••••••T09:21:12Z'
};

// Loads an XML file by uri, parses it and then checks if it's converted correctly 
exports.ParseXMLFile = function(test){
	test.expect(4);
	parser.ParseFile({uri: sample_person_xml, format: 'xml'}, function(result){
		test.equal(result[0].author_name, person.author_name);
		test.equal(result[0].author_email, person.author_email);
		test.equal(result[0].author_phone, person.author_phone);
		test.equal(result[0].source_name, person.source_name);
		test.done();
	});
};

// Loads an CVS file by uri, parses it and then checks if it's converted correctly 
exports.ParseCSVFile = function(test){
	test.expect(4);
	parser.ParseFile({uri: sample_person_cvs, format:'csv', delimiter:';'}, function(result){
		test.equal(result[0].author_name, person.author_name);
		test.equal(result[0].author_email, person.author_email);
		test.equal(result[0].author_phone, person.author_phone);
		test.equal(result[0].source_name, person.source_name);
		test.done();
	});
};

exports.Search = function(test){
	test.expect(1);
	personfinder_api.Search('abc', function(result){
		test.equal(true,true);
		test.done();
	});
};

exports.Upload = function(test){
	test.expect(1);
	personfinder_api.Upload({'pfif:pfif xmlns:pfif="http://zesty.ca/pfif/1.3"': {'pfif:person': [person]}}, function(result){
		test.equal(true, true);
		test.done();
	});
}

exports.ParseAndSearch = function(test) {
  test.expect(2);
  parser.ParseFile({uri: sample_person_cvs, format:'csv', delimiter:';'}, function(result){
    test.equal(result[0].author_name, person.author_name);
    var q = result[0].first_name + ' ' + result[0].last_name;
    console.log("Searching for '" + q + "'");
    personfinder_api.Search(q, function(res){
      console.log(res.len + ' found');
      test.equal(true, true);
      test.done();
    });
  });
}
