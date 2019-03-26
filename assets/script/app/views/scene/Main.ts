import BASE from "../../../base/BASE";
import BaseComponent from "../../../base/BaseComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends BaseComponent {

    onInitData() {
    }

    onLoaded() {
        BASE.UIManager.showUI("TestUI");
    }

    start() {
    }

    update(dt: number) {
    }

    onDestory() {
    }

}