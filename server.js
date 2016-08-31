'use strict';
var harp = require('harp');

var express = require('express');
var app = express();

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('x-powered-by', 'ffconf');
  next();
});

var outputPath = __dirname + '/www';
var port = process.env.PORT || 9000;

global.idify = function (s) { return s.replace(/&.*?;/g, '').replace(/\s+/g, '-').replace(/[^\w\-]/g, '').toLowerCase(); };

app.use(express.static(__dirname + '/www', { extensions: ['html'] }));

if (module.parent) {
  module.exports = app;
}

harp.compile(__dirname + '/public', outputPath, function(errors){
  if(errors) {
    console.log(JSON.stringify(errors, null, 2));
    process.exit(1);
  }

  if (!module.parent) {
    console.log('Running harp-static on ' + port);
    var server = app.listen(port, function(){
      console.log('Listening at http://%s:%s', server.address().address, server.address().port);
    });
  }
});
