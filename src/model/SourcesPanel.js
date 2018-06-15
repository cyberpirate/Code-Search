
const {ipcMain} = require('electron');
const settings = require("../module/Settings.js");
const SyncedData = require("../module/SyncedData.js");


exports.init = function(webContents) {
	settings.init();
	
	var sourcesPanelSync = SyncedData.GetSyncedData("SourcesPanel", webContents)
	
	var functions = {
		"addSource": (args) => {
			
		},
		"setSelection": (args) => {
			sourcesPanelSync.apply({
				selection: args.index
			});
		}
	};
	
	ipcMain.on("SourcesPanel", (event, args) => {
		functions[args.name](args.args);
	});

	sourcesPanelSync.apply({
		loading: false
	});
};
