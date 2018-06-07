(function() {

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

	window.getSettings = async function() {
		var file = await readFile(settingsFile, "utf8").catch((err) => {} );
		return JSON.parse(file || "{}");
	}

	window.writeSettings = async function(settingsObject) {
		var settingsStr = JSON.stringify(settingsObject);
		await writeFile(settingsFile, settingsStr, "utf8");
	}


	init();
})();