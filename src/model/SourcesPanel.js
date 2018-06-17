
const {ipcMain} = require('electron');
const settings = require("../module/Settings.js");
const SyncedData = require("../module/SyncedData.js");
const path = require('path');


exports.init = async function(webContents) {
	settings.init();
	
	var sourcesPanelSync = SyncedData.GetSyncedData("SourcesPanel", webContents)
	
	var functions = {
		"addSource": (args) => {
			var name = path.basename(args.source);
			settings.addSource({
				"name": name,
				"path": args.source,
			});

			var panelData = sourcesPanelSync.get();
			panelData.list = panelData.list || [];
			panelData.list.push({
				"name": name
			});
			sourcesPanelSync.set(panelData);
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

	var sources = await settings.getSources();

	sourcesPanelSync.apply({
		loading: false,
		list: sources
	});
};
