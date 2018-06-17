
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

async function init() {
	await stat(settingsDir)
		.catch(err => mkdir(settingsDir));
}

function getDir() {
	return settingsDir;
}

async function getSettings() {
	var file = await readFile(settingsFile, "utf8").catch((err) => {} );
	return JSON.parse(file || "{}");
}

async function writeSettings(settingsObject) {
	var settingsStr = JSON.stringify(settingsObject);
	await writeFile(settingsFile, settingsStr, "utf8");
}

async function getSources() {
	var settings = await getSettings();
	return settings.sources || [];
}

async function addSource(source) {
	var settings = await getSettings();
	settings.sources = settings.sources || [];
	settings.sources.push(source);
	await writeSettings(settings);
}

module.exports = {
	init: init,
	getDir: getDir,
	getSettings: getSettings,
	writeSettings: writeSettings,
	getSources: getSources,
	addSource: addSource,
}