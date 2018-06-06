(function() {

	var view = $("#sourcesPanel");

	//default vars
	var defaultVars = {
		loading: true,
	};

	window.SourcesPanelViewModel = {};
	window.SourcesPanelApply = function(viewModelDiff) {
		patchObject(window.SourcesPanelViewModel, viewModelDiff);

		if(window.SourcesPanelViewModel["loading"]) {
			if($(view).children(".loader").length == 0) {
				$("<div/>", {
					class: "loader"
				}).appendTo(view);
			}
		} else {
			if($(view).children(".loader").length >= 1) {
				$(view).children(".loader").remove();
			}
		}
	};

	window.SourcesPanelApply(defaultVars);
})();