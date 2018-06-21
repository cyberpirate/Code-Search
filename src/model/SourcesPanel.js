
const {ipcMain} = require('electron');
const settings = require("../module/Settings.js");
const SyncedData = require("../module/SyncedData.js");
const SourceHandler = require("../module/SourceHandler.js");
const path = require('path');


exports.init = async function(webContents) {
	settings.init();
	
	var sourcesPanelSync = SyncedData.GetSyncedData("SourcesPanel", webContents)
	
	var sourceHandlers = [];

	function refreshProgListeners() {
		for(var i = 0; i < sourceHandlers.length; i++) {
			sourceHandlers[i].setProgressListener((function(index) {
				return function(progress) {
					var data = sourcesPanelSync.get();
					data.list[index].progress = progress;
					sourcesPanelSync.set(data);
				}
			})(i));
		}
	}

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
			sourceHandlers.push(new SourceHandler(args.source));
			refreshProgListeners();
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

	for(var i = 0; i < sources.length; i++) {
		sourceHandlers.push(new SourceHandler(sources[i].path));
	}

	refreshProgListeners();
};
