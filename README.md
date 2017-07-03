# Akashic Atsumaru Plugin

Akashic Engineのアツマール用プラグインです。

## 使い方

`build/atsumaru.js` をコピーして、アツマール投稿用のHTMLで呼び出すようにしてください。

一般的な利用方法は、以下のテンプレート側で見る事も出来ます。
- https://github.com/tsugehara/akashic-atsumaru-template

pluginは、initメソッドを呼び出す必要があります。以下のようなコードが必要です。
```
var plugin = require("./lib/index");
plugin.init({
	atsumaru: window.RPGAtsumaru,
	game: window.sandboxDeveloperProps.game,
	gameDriver: window.sandboxDeveloperProps.driver,
	amflow: window.sandboxDeveloperProps.amflow,
	gdr: window.sandboxDeveloperProps.gdr
});
```

## 開発方法

以下でビルドできます。

```sh
npm install
npm run build
```

## 参考資料

- アツマールのゲームAPI: https://github.com/tsugehara/atsumaru-gameapi
    - ゆくゆくはこちらに移したい: 
- 一般的な利用方法を記述したテンプレート: https://github.com/tsugehara/akashic-atsumaru-template
- サンプルゲーム: https://github.com/tsugehara/akashic-minesweeper
- 動いている様子: TODO
