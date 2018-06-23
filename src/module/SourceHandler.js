var Datastore = require('nedb')
const settings = require("../module/Settings.js");
const path = require('path');
var md5 = require('md5');
const fs = require('fs');
const util = require('util');

const stat    = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);

settings.init();

async function walkPath(dir) {
	var s = await stat(dir);
	if(s.isDirectory()) {
		var files = [];
		var children = await readdir(dir);
		for(var i = 0; i < children.length; i++) {
			var fullChild = path.join(dir, children[i]);
			files = files.concat(await walkPath(fullChild));
		}
		return files;
	}
	if(s.isFile()) {
		return [{
			"path": dir,
			"md5": md5(dir),
			"time": s.mtimeMs
		}];
	}
	return [];
}

//TODO -- https://github.com/louischatriot/nedb/
module.exports = class SourceHandler {
	constructor(dir) {
		this.path = dir;
		this.searchId = 0;
		this.symbolDB = new Datastore({ filename: path.join(settings.getDir(), md5(this.path) + "_symbols") });
		this.fileDB = new Datastore({ filename: path.join(settings.getDir(), md5(this.path) + "_files") });

		this.symbolDB.pFindOne = util.promisify(this.symbolDB.findOne);
		this.fileDB.pFindOne = util.promisify(this.fileDB.findOne);

		this.symbolDB.loadDatabase();
		this.fileDB.loadDatabase((err) => {
			this.findUnparsedFiles();
		});
	}

	async findUnparsedFiles() {

		this.updateProgress(-1);
		var allFiles = await walkPath(this.path);
		var newFiles = [];

		for(var i = 0; i < allFiles.length; i++) {
			var item = await this.fileDB.pFindOne({
				md5: allFiles[i].md5
			});
			
			if(typeof(item) != "undefined" || item.time < allFiles[i].time)
				newFiles.push(allFiles[i]);
		}

		console.log(newFiles.length);
		console.log(newFiles[0]);
	}

	setProgressListener(listener) {
		this.progListener = listener;
		if(typeof(this.lastProg) !== "undefined")
			this.progListener(this.lastProg);
	}

	updateProgress(prog) {
		this.lastProg = prog;
		if(typeof(this.progListener) !== "undefined")
			this.progListener(this.lastProg);
	}
}