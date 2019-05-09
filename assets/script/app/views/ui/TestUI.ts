import { ViewBase } from "../../../base/mvc/ViewBase";
import { Base64 } from "../../../base/utils/Base64";

export class TestUI extends ViewBase {

    static UIName = "TestUI";
    static ResourcePath = "prefab/TestUI";

    private label: cc.Label;

    onLoad() {
        this.bindView("label", "testLabel", cc.Label);
        this.bindEvent("HELLO", this.sayHello);
    }

    start() {
        this.scheduleOnce(() => {
            this.Event.notify("HELLO", "Hello, this is a broadcast message.");
        }, 2);
    }

    sayHello(data) {
        this.label.string = data.data;
    }

}