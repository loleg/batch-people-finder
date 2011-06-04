var url = require('url')
sys = require('sys');

exports.GetHost = function(uri){
	return url.parse(uri).host;
}

exports.GetPath = function(uri){
	if(typeof url.parse(uri).search === 'undefined'){
		return url.parse(uri).pathname;
	} else {
		return url.parse(uri).pathname + url.parse(uri).search;
	}
}

exports.GetPort = function(uri){
	var host_port = url.parse(uri).port;
	if(host_port === 'null' || typeof host_port === 'undefined'){
		return 80;
	} else {
		return host_port;
	}
}