import BASE from "../../../base/BASE";
import ViewBaseEX from "../../../base/mvc/ViewBaseEx";


export default class TestUI extends ViewBaseEX {

    private label: cc.Label;

    onInitData() {
        this.__resourcePath = "prefab/TestUI";
        this.pushBind({ name: "label", path: "testLabel", component: cc.Label });
        this.pushReceiver({ name: "HELLO", handler: null });
    }

    onLoaded() {
        this.label.string = "Label changed by broadcast.";
    }

    start() {
        this.broadcastManager.sendBroadcast("HELLO", "Hello, this is a broadcst message.")
    }

    HELLO(data) {
        console.log(data);
    }

}

BASE.UIManager.registerUI("TestUI", new TestUI())