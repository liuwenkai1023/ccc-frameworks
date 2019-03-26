import BASE from "../../../base/BASE";
import ViewBaseEX from "../../../base/mvc/ViewBaseEx";


export default class TestUI extends ViewBaseEX {

    // prefab的路径
    protected __resourcePath = "prefab/TestUI";

    private label: cc.Label;

    protected initData() {
        // 资源绑定配置
        this.pushBindingData({ name: "label", path: "testLabel", component: cc.Label });
        // 广播接收者配置
        this.pushReceiverData({ name: "HELLO", handler: null });
    }

    protected onLoad() {
        super.onLoad();
        this.initData();
    }

    protected onStart(view?: cc.Node) {
        super.onStart();
        this.broadcastManager.sendBroadcast("HELLO", null);
    }

    protected onShow(data?: any) {
        super.onShow();
    }

    protected onClose() {
        super.onClose();
    }

    protected onDestroy() {
        super.onDestroy();
    }

    HEELO() {
        console.log("Say Hello!");
    }

}

BASE.UIManager.registerUI("TestUI", new TestUI())