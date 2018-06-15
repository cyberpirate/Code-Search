(function() {

	var view = $("#sourcesPanel");
	var sData = window.GetSyncedData("SourcesPanel");

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

	var viewModel = {};
	function apply(viewModelDiff) {
		patchObject(viewModel, viewModelDiff);

		createOrDestroy(
			viewModel["loading"],
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
			!viewModel["loading"],
			$(view).children(".ItemList"),
			function() {
				return $("<div/>", {
					class: "ItemList"
				}).appendTo(view);
			}
		);

		if(!viewModel["loading"]) {
			for(var i = 0; i < viewModel["list"].length; i++) {
				var itemData = viewModel["list"][i];

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
				.eq(viewModel.selection).removeClass("bg-secondary");
			$(listElm).children(".ItemListChild")
				.eq(viewModel.selection).addClass("bg-primary");

			var addButton = createOrDestroy(true, $(listElm).children("#AddItem"),
				function() {
					return $(`
						<div class='text-center'><button type='button' class='btn btn-success btn-md mt-1'>
							<input id="sourcePath" type="file" style="display: none" webkitdirectory />
							<i class='fas fa-plus'></i>
						</button></div>
					`).appendTo(listElm);
				}
			);

			addButton.click(_ => {
				document.getElementById('sourcePath').click();
			});

			$(addButton).find("input").change(function(e) {
				window.SourcesPanelAddSource(e.target.files[0]);
			});
		}
	};

	apply(defaultVars);

	sData.setListener((newData, data, name) => {
		apply(data);
	});
})();