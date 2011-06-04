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
			
			var people = [];
			
			for(var id in result['pfif:person']){
				var person = {
					person_record_id: result['pfif:person'][id]['pfif:person_record_id'],
					entry_date: result['pfif:person'][id]['pfif:entry_date'],
					author_name: result['pfif:person'][id]['pfif:author_name'],
					author_email: result['pfif:person'][id]['pfif:author_email'],
					author_phone: result['pfif:person'][id]['pfif:author_phone'],
					source_name: result['pfif:person'][id]['pfif:source_name'],
					source_date: result['pfif:person'][id]['pfif:source_date'],
					source_url: result['pfif:person'][id]['pfif:source_url'],
					first_name: result['pfif:person'][id]['pfif:first_name'],
					last_name: result['pfif:person'][id]['pfif:last_name'],
					date_of_birth: result['pfif:person'][id]['pfif:date_of_birth'],
					age: result['pfif:person'][id]['pfif:age'],
					home_street: result['pfif:person'][id]['pfif:home_street'],
					home_neighborhood: result['pfif:person'][id]['pfif:home_neighborhood'],
					home_city: result['pfif:person'][id]['pfif:home_city'],
					home_state: result['pfif:person'][id]['pfif:home_state'],
					home_postal_code: result['pfif:person'][id]['pfif:home_postal_code'],
					home_country: result['pfif:person'][id]['pfif:home_country'],
					photo_url: result['pfif:person'][id]['pfif:photo_url'],
					other: result['pfif:person'][id]['pfif:other'],
					note: result['pfif:person'][id]['pfif:note'],
				};
				
				people.push(person);
				
				// output the current persons name. ...for debugging
				//console.log(sys.inspect(result['pfif:person'][id]['pfif:author_name']));
			}
			
			return callback(people);
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

