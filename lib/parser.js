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
                                        sex: result['pfif:person'][id]['pfif:sex'],
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
	
    var host = url_helpers.GetHost(data_uri.uri);
	  var client = http.createClient(url_helpers.GetPort(data_uri.uri), host);
	  var request = client.request('GET', url_helpers.GetPath(data_uri.uri), {'host': host});

    var people = [];
	
	  request.on('response', function(response){
		  response.setEncoding('utf8');

		  var body = '';
		  response.on('data', function(chunk){
			  body += chunk;
		  });
		
		  response.on('error', function(err){
        console.log(error.message);
		  });
		
		  response.on('end', function(){
        // Start parsing CSV
		    csv()
        .from(body, { delimiter:data_uri.delimiter, columns:true })
        .transform(function(data){

          /* PFIF 1.3 CSV */
			    var person = {
            person_record_id:  (typeof data.person_record_id != "undefined") ?  data.person_record_id : '',
            entry_date:        (typeof data.entry_date != "undefined") ?        data.entry_date : '',
            author_name:       (typeof data.author_name != "undefined") ?       data.author_name : '',
            author_email:      (typeof data.author_email != "undefined") ?      data.author_email : '',
            author_phone:      (typeof data.author_phone != "undefined") ?      data.author_phone : '',
            source_name:       (typeof data.source_name != "undefined") ?       data.source_name : '',
            source_date:       (typeof data.source_date != "undefined") ?       data.source_date : '',
            source_url:        (typeof data.source_url != "undefined") ?        data.source_url : '',
            first_name:        (typeof data.first_name != "undefined") ?        data.first_name : '',
            last_name:         (typeof data.last_name != "undefined") ?         data.last_name : '',
            sex:               (typeof data.sex != "undefined") ?               data.sex : '',
            date_of_birth:     (typeof data.date_of_birth != "undefined") ?     data.date_of_birth : '',
            age:               (typeof data.age != "undefined") ?               data.age : '',
            home_street:       (typeof data.home_street != "undefined") ?       data.home_street : '',
            home_neighborhood: (typeof data.home_neighborhood != "undefined") ? data.home_neighborhood : '',
            home_city:         (typeof data.home_city != "undefined") ?         data.home_city : '',
            home_state:        (typeof data.home_state != "undefined") ?        data.home_state : '',
            home_postal_code:  (typeof data.home_postal_code != "undefined") ?  data.home_postal_code : '',
            home_country:      (typeof data.home_country != "undefined") ?      data.home_country : '',
            photo_url:         (typeof data.photo_url != "undefined") ?         data.photo_url : '',
            other:             (typeof data.other != "undefined") ?             data.other : '',
            note:              (typeof data.note != "undefined") ?              data.note : '',
			    };
				
          //console.log(person);
			    people.push(person);

        })
        .on('end',function(count){
          console.log('Number of lines: '+count);
			    return callback(people);
        })
        .on('error',function(error){
          console.log(error.message);
        });

		  });	
	  });
	
	  request.end();		
		
  }

};

