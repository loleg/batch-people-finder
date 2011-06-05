var sys = require('sys')
	jsontoxml = require('jsontoxml'),
	http = require('http'),
	xml2js = require('xml2js');
	
var key = 'punsOMMYMAI27tk';
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
                path: '/api/search?q=' + params,
                method: 'GET'
        };

        var parser = new xml2js.Parser();
	parser.addListener('end', function(result){
	        console.log(result['pfif:person'].length + ' people found');
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
exports.Upload = function(params, callback){
	// to do
};