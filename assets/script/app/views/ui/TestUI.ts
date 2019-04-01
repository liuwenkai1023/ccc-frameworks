import ViewBase from "../../../base/mvc/ViewBase";
import UIManager from "../../../base/mvc/UIManager";

export default class TestUI extends ViewBase {

    static UIName = "TestUI";
    static ResourcePath = "prefab/TestUI";

    private label: cc.Label;

    onInitData() {
        this.bPush({ name: "label", path: "testLabel", component: cc.Label });
        this.rPush({ name: "HELLO", handler: null });
    }

    onLoaded() {
        this.label.string = "Label changed by broadcast.";
    }

    start() {
        this.broadcastManager.sendBroadcast("HELLO", "Hello, this is a broadcst message.")
    }

    update(dt?: number) {
    }

    onDestory() {
    }

    HELLO(data) {
    }

}