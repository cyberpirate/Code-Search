var Db = require('tingodb')().Db;
const settings = require("../module/Settings.js");
const path = require('path');
var md5 = require('md5');

settings.init();

module.exports = class SourceHandler {
	constructor(path) {
		this.path = path;
		this.searchId = 0;
		this.db = new Db(path.join(settings.getDir(), md5(this.path)), {});

		this.symbolColl = this.db.collection("symbol_collection");
	}

	setProgressListener(listener) {
		this.progListener = listener;
	}
}