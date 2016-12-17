var settings = require('../settings');
var Db = require('mongodb').Db;
//var Connection = require('mongodb-core').Connection;
var Server = require('mongodb').Server;

//console.log("======="+Connection.port);

module.exports = new Db(settings.db, new Server(settings.host, 27017, {}));
