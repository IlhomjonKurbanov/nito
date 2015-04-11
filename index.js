/* ==================================
  Express server - main server side file
===================================== */


var path = require('path');
var fs = require('fs');
var http = require('http');
var express = require('express');
var app = express();

// block access to src folder
app.get('/js/src/*', function(req, res) {
  res.status(404);
  res.end();
});

// Serve the ./static/ folder to the public
app.use(express.static('static'));
app.use('/stream', express.static('stream')); // need to optimize this

// Route all requests to static/index.html
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'static/index.html'));
});



// Start the server
var server = http.createServer(app).listen(8080);
