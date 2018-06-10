(async function() {

	var settings = await window.getSettings();

	window.SourcesPanelSetSelection = function(index) {
		window.SourcesPanelApply({
			selection: index
		});
	}

	window.SourcesPanelAddSource = function(source) {
		console.log(source);
	};

	window.SourcesPanelApply({
		loading: false,
		list: [
			{ name: "item 1" },
			{ name: "item 2" },
			{ name: "item 3" },
			{ name: "item 4" },
		],
		selection: 1
	});
})();