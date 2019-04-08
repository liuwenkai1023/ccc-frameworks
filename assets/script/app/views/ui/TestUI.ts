import ViewBase from "../../../base/mvc/ViewBase";

export default class TestUI extends ViewBase {

    static UIName = "TestUI";
    static ResourcePath = "prefab/TestUI";

    private label: cc.Label;

    onLoad() {
        this.bindView("label", "testLabel", cc.Label);
        this.bindBroadEvent("HELLO");
        this.label.string = "Label changed by broadcast.";
    }

    start() {
        this.scheduleOnce(() => {
            this.broadcastManager.emit("HELLO", "Hello, this is a broadcst message.");
        }, 2);
    }

}