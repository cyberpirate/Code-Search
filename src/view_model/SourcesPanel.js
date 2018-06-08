(function() {

	var view = $("#sourcesPanel");


	/*

	{
		loading: false,
		list: [
			{
				name: "name",
			}
		]
		selection: 0
	}

	*/

	//default vars
	var defaultVars = {
		loading: true,
		list: [],
		selection: 0
	};

	function createOrDestroy(shouldExist, elm, create) {
		if(shouldExist && elm.length == 0) {
			return create();
		}

		if(!shouldExist && elm.length == 1) {
			elm.remove();
		}

		return elm;
	}

	window.SourcesPanelViewModel = {};
	window.SourcesPanelApply = function(viewModelDiff) {
		patchObject(window.SourcesPanelViewModel, viewModelDiff);

		createOrDestroy(
			window.SourcesPanelViewModel["loading"],
			$(view).children("#loader"),
			function() {
				return $(`
					<div id='loader'>
						<i class='fas fa-spinner fa-spin'></i>\
					</div>
					`).appendTo(view);
			}
		);

		var listElm = createOrDestroy(
			!window.SourcesPanelViewModel["loading"],
			$(view).children(".ItemList"),
			function() {
				return $("<div/>", {
					class: "ItemList"
				}).appendTo(view);
			}
		);

		if(!window.SourcesPanelViewModel["loading"]) {
			for(var i = 0; i < window.SourcesPanelViewModel["list"].length; i++) {
				var itemData = window.SourcesPanelViewModel["list"][i];

				var itemElm = createOrDestroy(true, $(listElm).children(".ItemListChild").eq(i),
					function() {
						return $("<div/>", {
							class: "ItemListChild p-3"
						}).appendTo(listElm);
					}
				);

				itemElm.click((function() {
					const index = i;
					return function() {
						console.log("")
						window.SourcesPanelSetSelection(index);
					};
				})());

				var nameElm = createOrDestroy(true, $(itemElm).children("h5"), 
					function() {
						return $("<h5/>").appendTo(itemElm);
					}
				);

				nameElm.html(itemData.name);
			}

			$(listElm).children(".ItemListChild")
				.removeClass("bg-primary");
			$(listElm).children(".ItemListChild")
				.addClass("bg-secondary");

			$(listElm).children(".ItemListChild")
				.eq(window.SourcesPanelViewModel.selection).removeClass("bg-secondary");
			$(listElm).children(".ItemListChild")
				.eq(window.SourcesPanelViewModel.selection).addClass("bg-primary");

			var addButton = createOrDestroy(true, $(listElm).children("#AddItem"),
				function() {
					return $(`
						<div class='text-center'><button type='button' class='btn btn-success btn-md mt-1'>
							<i class='fas fa-plus'></i>
						</button></div>
					`).appendTo(listElm);
				}
			);
		}
	};

	window.SourcesPanelApply(defaultVars);
})();