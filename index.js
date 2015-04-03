// Express server - main server side file

var path = require('path');
var express = require('express');
var app = express();

// block access to src folder
app.get('/js/src/*', function(req, res) {
  res.status(404);
  res.end();
});

// Serve the ./static/ folder to the public
app.use(express.static('static'));

// Route all requests to static/index.html
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'static/index.html'));
});

// Start the server
var server = app.listen(8080, function() {
  var host = server.address().address;
  var port = server.address().port;

  // console.log(`Server listening on http://${host}${port}`);
});
