(function() {
	
	window.patchObject = function(objA, objB) {
		for(var key in objB) {
			objA[key] = objB[key];
		}
	};
})();