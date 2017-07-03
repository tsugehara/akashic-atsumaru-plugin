window.addEventListener("load", function() {
	window.sandboxDeveloperProps.driver.gameCreatedTrigger.handle(function(game) {
		window.sandboxDeveloperProps.game = game;
		var saveButton = document.getElementById("btn_save");
		var loadButton = document.getElementById("btn_load");
		if (window.RPGAtsumaru) {
			var plugin = require("./lib/index");
			plugin.init({
				atsumaru: window.RPGAtsumaru,
				game: window.sandboxDeveloperProps.game,
				gameDriver: window.sandboxDeveloperProps.driver,
				amflow: window.sandboxDeveloperProps.amflow,
				gdr: window.sandboxDeveloperProps.gdr
			});
		}

		// TODO: ちょっと不細工だけどいったんデバッグ用に
		if (saveButton) {
			saveButton.addEventListener("click", function() {
				if (window.RPGAtsumaru) {
					game.external.atsumaru.storage.saveCurrentPlaylog("1");
				} else {
					// ただのデバッグ用
					console.log("save playlog", window.sandboxDeveloperProps.amflow.dump());
				}
			});
		}
		var driver = window.sandboxDeveloperProps.driver;
		if (loadButton) {
			loadButton.addEventListener("click", function() {
				if (window.RPGAtsumaru) {
					game.external.atsumaru.storage.loadPlaylog("1");
				} else {
					// ただのデバッグ用
					console.log("load playlog");
				}
			});
		}
		return false;
	});
});
