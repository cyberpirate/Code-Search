(function() {
	
	const {ipcRenderer} = require("electron");

	window.patchObject = function(objA, objB) {
		for(var key in objB) {
			objA[key] = objB[key];
		}
	};

	window.getFunctionRunner = function(objectName) {
		return function(funcName, args) {
			ipcRenderer.send(objectName, {
				"name": funcName,
				"args": args
			});
		}
	};
})();