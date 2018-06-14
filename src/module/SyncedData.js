(function() {

	const isRenderer = require("is-electron-renderer");

	const {
		ipcRenderer,
		ipcMain
	} = require('electron')

	patchObject = function(objA, objB) {
		for(var key in objB) {
			objA[key] = objB[key];
		}
	};

	var sender = undefined;
	var data = {};
	var listeners = {};

	(ipcRenderer || ipcMain).on("SyncedData", (event, args) => {
		if(!(args.name in data)) data[args.name] = {};

		if("init" in args && args.init) {
			updateSync(args.name, false, data[args.name]);
			return;
		}

		if(args.apply) {
			patchObject(data[args.name], args.data)
		} else {
			data[args.name] = args.data;
		}

		if(args.name in listeners) {
			listeners[args.name](args.data, data[args.name], args.name);
		}
	});

	function updateSync(name, apply, newData) {
		(ipcRenderer || sender).send("SyncedData", {
			"name": name,
			"apply": apply,
			"data": newData
		});
	}



	function GetSyncedData(dataName, msgSender) {
		sender = msgSender;
		if(!(dataName in data)) data[dataName] = {};

		(ipcRenderer || sender).send("SyncedData", {
			"name": dataName,
			"init": true
		});

		return {
			get: _ => { return data[dataName]; },
			set: (newData) => { data[dataName] = newData; updateSync(dataName, false, newData); },
			apply: (newData) => { patchObject(data[dataName], newData); updateSync(dataName, true, newData); },
			setListener: (listener) => { listeners[dataName] = listener; }
		}
	};

	if(isRenderer) {
		window.GetSyncedData = GetSyncedData;
	} else {
		exports.GetSyncedData = GetSyncedData;
	}
})();