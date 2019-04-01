import BaseComponent from "../../../base/BaseComponent";
import UIManager from "../../../base/mvc/UIManager";
import TestUI from "../ui/TestUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends BaseComponent {

    onInitData() {
    }

    onLoaded() {
        this.b();

    }

    a() {
        this.scheduleOnce(() => {
            UIManager.instance().destoryUI(TestUI.UIName);
            this.b();
        }, 5)
    }

    b() {
        this.scheduleOnce(() => {
            UIManager.instance().showUI(TestUI);
            this.a();
        }, 5)
    }

    start() {
    }

    update(dt: number) {
    }

    onDestory() {
    }

}