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

	var fRunner = window.getFunctionRunner("SourcesPanel");

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

		var addButton = createOrDestroy(true, $(listElm).children("#AddItem"),
			function() {
				var btn = $(`
					<div class='text-center' id='AddItem'><button type='button' class='btn btn-success btn-md mt-1'>
						<input id="sourcePath" type="file" style="display: none" webkitdirectory />
						<i class='fas fa-plus'></i>
					</button></div>
				`).appendTo(listElm);
				
				btn.click((event) => {
					if(!$(event.target).is("input")) {
						document.getElementById('sourcePath').click();
					}
				});
		
				$(btn).find("input").change(function(e) {
					fRunner("addSource", {
						"source": e.target.files[0].path
					});
				});

				return btn;
			}
		);

		if(!viewModel["loading"]) {
			for(var i = 0; i < viewModel["list"].length; i++) {
				var itemData = viewModel["list"][i];

				var itemElm = createOrDestroy(true, $(listElm).children(".ItemListChild").eq(i),
					function() {
						var ret = $("<div/>", {
							class: "ItemListChild p-3"
						}).insertBefore(addButton);

						ret.click((event) => {
							var elm = event.currentTarget;
							const index = Array.from(elm.parentNode.children).indexOf(elm);
							fRunner("setSelection", {
								"index": index
							});
						});

						return ret;
					}
				);

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
		}
	};

	apply(defaultVars);

	sData.setListener((newData, data, name) => {
		apply(data);
	});
})();