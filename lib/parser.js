var sys = require('sys'),
	fs = require('fs'),
	xml2js = require('xml2js'),
	http = require('http'),
	url_helpers = require('./url_helpers');

exports.ParseFile = function(data_uri, callback){
	
	// try to guess the format
	if(typeof data_uri === "undefined" && typeof data_uri.format === "undefined"){
		
	} else if(data_uri.format === "xml"){
		
		var parser = new xml2js.Parser();
		parser.addListener('end', function(result){
			
			// for(var person in result.pfif:person){
			// 	console.log('this is a person');
			// }
			
			//var parsed_result = JSON.stringify(result);
			console.log(result);
			
			//console.log(jquery('pfif:person', result));
			console.log();
			
			var person = {
				author_name: 'Bill Mandil',
				author_email: 'bmd67893@example.com',
				author_phone: '(555) 258-6902',
				source_name: 'salesforce.com',
				source_date: '2005-09-03T09:21:12Z'
			};
			
			return callback(person);
		});
		
		var host = url_helpers.GetHost(data_uri.uri); // eg. host = 'www.google.com'
		var client = http.createClient(url_helpers.GetPort(data_uri.uri), host);
		var request = client.request('GET', url_helpers.GetPath(data_uri.uri), {'host': host});
		
		request.on('response', function(response){
			response.setEncoding('utf8');
	
			var body = '';
			response.on('data', function(chunk){
				body += chunk;
			});
			
			response.on('error', function(err){
			 // do some error handling here...	
			});
			
			response.on('end', function(){
				parser.parseString(body);
			});	
		});
		
		request.end();		
	}	
};

