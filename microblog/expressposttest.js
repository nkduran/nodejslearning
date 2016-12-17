var express = require('express');
//var app = require('./app');

var app = express();

app.get('/', function(req, res) {
	res.send('Hello World!!!!!!');
});

var server = app.listen(8081, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Application，address is http://%s:%s", host, port);
});