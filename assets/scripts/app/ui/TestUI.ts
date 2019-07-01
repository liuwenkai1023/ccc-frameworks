import { ViewBase } from "../../base/mvc/ViewBase";

export class TestUI extends ViewBase {

    static UIName = "TestUI";
    static ResourcePath = "prefab/TestUI";

    private label: cc.Label;

    onLoad() {
        this.bindView("label", "testLabel", cc.Label);
        this.bindEvent("HELLO", this.sayHello.bind(this));
    }

    start() {
        this.scheduleOnce(() => {
            this.Event.emit("HELLO", "Hello, this is a event message.");
        }, 1);
    }

    sayHello(data) {
        this.label.string = data.data;
    }

}