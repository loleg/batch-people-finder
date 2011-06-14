var sys = require('sys'),
	http = require('http'),
	xml2js = require('xml2js'),
	https = require('https');
	
var key = '6rETQHFF7DDUMyXW';
var subdomain = 'rhok1.com';

// Person Finder Search API
exports.Search = function(params, callback){
/*	var options = {
		host: 'googlepersonfinder.appspot.com',
		port: 80,
		path: '/api/search?key=' + key + '&subdomain=' + subdomain + '&q=' + params,
		method: 'POST'
	};*/

        var options = {
                host: 'rhok.googlepersonfinder.appspot.com',
                port: 80,
                path: '/api/search?q=' + encodeURI(params),
                method: 'GET'
        };

        var parser = new xml2js.Parser();
		   parser.addListener('end', function(result){
				
				if (typeof result['pfif:person'] == "undefined") {
					result.len = 0;
				} else {
					result.len = result['pfif:person'].length;
					console.log(result['pfif:person'].length + ' people found');
      			}
		        // TODO: process people data
		     	return callback(result);
		   });

        var request = http.request(options);

        request.addListener('error', function(connectionException){
            console.log(connectionException);
        });

        request.addListener('response', function(response){
            var data = '';

            response.addListener('data', function(chunk){ 
                data += chunk; 
            });
            response.addListener('end', function(){
                // hand of to XML js parser
                parser.parseString(data);
            });
        });

        request.end();
};



// Uploading data into PersonFinder
exports.Upload = function(person_data, callback){
	var options = {
            host: 'rhok.googlepersonfinder.appspot.com',
            port: 443,
            path: '/api/write?key=' + key,
            method: 'POST'
    };
	
	//console.log(jsontoxml.obj_to_xml({foobar:'tes'}));

	console.log(options.data);

	var req = https.request(options, function(res) {
	  res.setEncoding('utf8');
	  var body = "";
	  res.on('data', function (chunk) {
	    console.log('BODY: ' + chunk);
		body += chunk;
	  });
	});
	
	req.on('error', function(e) {
	  console.log('problem with request: ' + sys.inspect(e));
	});
	
	// write data to request body
	//req.write(jsontoxml.obj_to_xml(person_data));
	req.end();

};
