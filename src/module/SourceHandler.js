var sqlite3 = require('sqlite3');
var md5 = require('md5');
var squel = require("squel");


module.exports = class SourceHandler {
	constructor(path) {
		this.path = path;
		this.searchId = 0;
		this.db = new sqlite3.Database(":memory:");

		this.db.serialize(function() {

		});
	}


}