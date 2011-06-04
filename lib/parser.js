var sys = require('sys'),
	fs = require('fs'),
	xml2js = require('xml2js'),
  csv = require('csv'),
	http = require('http'),
	url_helpers = require('./url_helpers');

exports.ParseFile = function(data_uri, callback){
	
	// try to guess the format
	if (typeof data_uri === "undefined" && typeof data_uri.format === "undefined") {
	
    console.log('unable to determine format of data request');
    return false;

	} else if(data_uri.format === "xml") {
		
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

  /* Import from CSV data */ 
	} else if(data_uri.format === "csv" && typeof data_uri.delimiter != "undefined") {

		var people = [];

		csv()
    .fromPath(data_uri.uri, {
      delimiter:data_uri.delimiter
    })
    .transform(function(data){
      data.unshift(data.pop());
      return data;
    })
    .on('data',function(data,index){
      console.log('#'+index+' '+JSON.stringify(data));

			var person = {
/* PFIF 1.3 CSV
["94305","Bill Mandil","bmd67893@example.com","(555) 258-6902","salesforce.com","2005-09-03T09:21:12Z","http://www.salesforce.com/person/a0030000001TRYR","Katherine","Doe","female",10"1971-02","30-45","Cotton Lane","","Tuscaloosa","AL"]
*/
        person_record_id:  data[0],
				entry_date:        data[5],
				author_name:       data[1],
				author_email:      data[2],
				author_phone:      data[3],
				source_name:       data[4],
				source_date:       data[5],
				source_url:        data[6],
				first_name:        data[7],
				last_name:         data[8],
				date_of_birth:     data[9],
				age:               data[10],
				home_street:       data[11],
				home_neighborhood: data[12],
				home_city:         data[14],
				home_state:        data[15],
//				home_postal_code: ,
//				home_country: ,
//				photo_url: ,
//				other: ,
				note:              data[13]
			};
				
			people.push(person);
				
			// output the current persons name. ...for debugging
			//console.log(sys.inspect(result['pfif:person'][id]['pfif:author_name']));

    })
    .on('end',function(count){
      console.log('Number of lines: '+count);
			return callback(people);
    })
    .on('error',function(error){
      console.log(error.message);
    });
			
  }

};

