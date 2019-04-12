import ViewBase from "../../../base/mvc/ViewBase";

export default class TestUI extends ViewBase {

    static UIName = "TestUI";
    static ResourcePath = "prefab/TestUI";

    private label: cc.Label;

    onLoad() {
        this.bindView("label", "testLabel", cc.Label);
        this.bindEvent("HELLO", this.sayHello);
    }

    start() {
        this.scheduleOnce(() => {
            this.eventTarget.dispatch("HELLO", "Hello, this is a event message.");
        }, 2);
    }

    sayHello(data) {
        this.label.string = data;
    }

}