import ViewBase from "../../../base/mvc/ViewBase";
import BASE from "../../../base/BASE";

export default class TestUI extends ViewBase {

    RESOURCE_FILENAME = "prefab/testUI";

    RESOURCE_BINDING = [
        ["label", "testLabel", cc.Label]
    ];

    private label: cc.Label;

    protected onLoad(view: cc.Node) {
        console.log("onLoad")
        // this.label = <cc.Label>this.bindMap.label;
    }

    protected onShow() {
        console.log("onShow")
    }

    public onShowed(data?: any | void) {
        console.log("onShowed")
        // this.label.string = data;
    }

    protected onHided() {
        console.log("onHided")      
    }

    protected onDestory() {
        console.log("onDestory")
    }

}

BASE.UIManager.registerUI("TestUI", new TestUI())