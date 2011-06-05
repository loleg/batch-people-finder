/**
 * Batch People Finder
 * 
 * - see README for details -
 *
 */

// Configuration

var app_conf = {
    port: 8000,
    peoplefinder: {
        key = '',
        host = ''
    }
};

/**
 * Module dependencies.
 */

var express = require('express');
var sys = require('sys')
    parser = require('./lib/parser');

var app = module.exports = express.createServer();

// Setup Express

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Batch People Finder', message: ''
  });
});

app.post('/', function(req, res){
  if(req.param('urldata','') == '') {
    res.render('index', {
      title: 'Batch People Finder',
      message: 'Please enter a valid URL'
    });
  } else {
    parser.ParseFile({uri:req.param('urldata',''), format:req.param('urltype',''), delimiter:';'}, 
      function(result){     
        res.render('confirm', {
          title: 'Confirm Import',
          people: result
        });
      });
  }
});

app.listen(app_conf.port);
console.log("Batch People Finder listening on port %d", app.address().port);
