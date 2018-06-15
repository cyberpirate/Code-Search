
const fs = require('fs');
const path = require('path');
const os = require('os');
const util = require('util');

const stat  = util.promisify(fs.stat);
const mkdir = util.promisify(fs.mkdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const settingsDir = path.join(os.homedir(), ".Code-Search");
const settingsFile = path.join(settingsDir, "settings.json");

exports.init = async function() {
	await stat(settingsDir)
		.catch(err => mkdir(settingsDir));
}

exports.getDir = function() {
	return settingsDir;
}

exports.getSettings = async function() {
	var file = await readFile(settingsFile, "utf8").catch((err) => {} );
	return JSON.parse(file || "{}");
}

exports.writeSettings = async function(settingsObject) {
	var settingsStr = JSON.stringify(settingsObject);
	await writeFile(settingsFile, settingsStr, "utf8");
}


// init();