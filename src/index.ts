export interface AtsumaruPluginParamter {
	atsumaru: AtsumaruGameAPI;
	game: g.Game;
	gameDriver: any;
	amflow: any;
	gdr: any;
}
export function init(param: AtsumaruPluginParamter) {
	param.game.external.atsumaru = new AtsumaruPlugin(param);
}

export class AtsumaruAPI {
	atsumaru: AtsumaruGameAPI;
	game: g.Game;
	gameDriver: any;
	amflow: any;
	gdr: any;

	constructor(param: AtsumaruPluginParamter) {
		this.atsumaru = param.atsumaru;
		this.game = param.game;
		this.gameDriver = param.gameDriver;
		this.amflow = param.amflow;
		this.gdr = param.gdr;
	}
}

export class AtsumaruPlugin {
	storage: StorageAPI;
	comment: CommentAPI;
	// controller: ControllerAPI;

	constructor(param: AtsumaruPluginParamter) {
		this.storage = new StorageAPI(param);
		this.comment = new CommentAPI(param);
	}

}

declare var console: any;
export class StorageAPI extends AtsumaruAPI {
	saveCurrentPlaylog(slotId: string) {
		// 動かない・・
		const dump = this.amflow.dump();
		return this.save(slotId, JSON.stringify(dump));
	}

	loadPlaylog(slotId: string) {
		this.load(slotId).then((value) => {
			const playlog = JSON.parse(value);
			this.amflow._tickList = playlog.tickList;
			this.amflow._startPoints = playlog.startPoints;
			// 非公開I/Fのようなので強引に飛ばす
			(<any>this.game).requestNotifyAgePassed(playlog.tickList[1]);
			(<any>this.game).agePassedTrigger.handle((age: number) => {
				this.gameDriver.changeState({
					driverConfiguration: {
						executionMode: this.gdr.ExecutionMode.Active,
						playToken: this.gdr.MemoryAmflowClient.TOKEN_ACTIVE
					},
					loopConfiguration: {
						playbackRate: 1,
						loopMode: this.gdr.LoopMode.Realtime,
						delayIgnoreThreshold: 6,
						jumpTryThreshold: 90000
					}
				}, (err: any) => {
					if (err) {
						console.log(err);
						return;
					}
					this.gameDriver.setNextAge(playlog.tickList[1] + 1);
					this.gameDriver.startGame();
				});
				return false;
			});
			this.gameDriver.changeState({
				driverConfiguration: {
					executionMode: this.gdr.ExecutionMode.Passive,
					playToken: this.gdr.MemoryAmflowClient.TOKEN_PASSIVE
				},
				loopConfiguration: {
					playbackRate: playlog.tickList[1] > 1000 ? 20 : 5,	// 実行速度適当
					loopMode: this.gdr.LoopMode.Replay,
					targetAge: 0,
					delayIgnoreThreshold: Number.MAX_VALUE,
					jumpTryThreshold: Number.MAX_VALUE
				}
			}, (err: any) => {
				if (err) {
					console.log(err);
					return;
				}
			});
		});
	}

	listPlaylog() {
		// TODO
	}

	save(slotId: string, data: any): Promise<void> {
		return this.atsumaru.storage.getItems().then((items) => {
			let matched = false;
			for (let i = 0; i < items.length; i++) {
				if (items[i].key === slotId) {
					items[i].value = data;
					matched = true;
					break;
				}
			}
			if (! matched) {
				items.push({
					key: slotId,
					value: data
				});
			}
			return this.atsumaru.storage.setItems(items);
		});
	}

	load(slotId: string): Promise<string> {
		return this.atsumaru.storage.getItems().then((items) => {
			const targetItems = items.filter((item) => item.key === slotId);
			if (targetItems.length === 0) {
				return Promise.reject<string>(new Error(slotId + " not found."));
			}
			return Promise.resolve(targetItems[0].value);
		});
	}

	remove(slotId: string): Promise<void> {
		return this.atsumaru.storage.removeItem(slotId);
	}
}

export class CommentAPI extends AtsumaruAPI {
	autoChangeScene: boolean;
	sceneIndex: number;

	constructor(param: AtsumaruPluginParamter) {
		super(param);
		this.sceneIndex = 0;
		this.autoChangeScene = false;
		param.game._sceneChanged.handle(this, this.onSceneChanged);
	}

	pushContextFactor(factor: string) {
		return this.atsumaru.comment.pushContextFactor(factor);
	}

	pushMinorContext() {
		return this.atsumaru.comment.pushMinorContenxt();
	}

	resetAndChangeScene(sceneName: string) {
		return this.atsumaru.comment.resetAndChangeScene(sceneName);
	}

	changeScene(sceneName: string) {
		return this.atsumaru.comment.changeScene(sceneName);
	}

	setContext(context: string) {
		return this.atsumaru.comment.setContext(context);
	}

	onSceneChanged(scene: g.Scene) {
		this.sceneIndex++;
		if (this.autoChangeScene) {
			this.atsumaru.comment.changeScene(scene.name || "" + this.sceneIndex);
		}
	}
}

// TODO: あとで
// export class ControllerAPI extends AtsumaruAPI {
// 	subscrive(observer: Observer) {
// 		return RPGAtsumaru.controllers.defaultController.subscribe(observer);
// 	}
// }
