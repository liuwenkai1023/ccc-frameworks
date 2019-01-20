import ViewBase from "../../../base/mvc/ViewBase";
import BASE from "../../../base/BASE";

export default class TestUI extends ViewBase {

    RESOURCE_FILENAME = "prefab/testUI";

    RECEIVER_CONFIG = [
        "HELLO",
    ];

    RESOURCE_BINDING = [
        ["label", "testLabel", cc.Label]
    ];

    private label: cc.Label;

    public onLoad() {
        // console.warn("[onLoad  ]", "初始化数据");
    }

    public onLoaded() {
        // console.warn("[onLoaded]", "初始化当前UI节点、组件以及监听等");
    }

    private HELLO(data) {
        this.label.string = data;
    }

    public onStart() {
        // console.warn("[onStart ]", "初始化当前UI逻辑、动画等");
        this.label.node.runAction(cc.repeatForever(cc.sequence([
            cc.scaleTo(0.1, 1.05),
            cc.scaleTo(0.1, 1),
        ])));
        this.timerManager.runDelayTimer(() => {
            this.broadcastManager.sendBroadcast("HELLO", "通过广播更新了Label");
        }, 3);
    }

    public onDestroy() {
        // console.warn("[onDestroy]", "已销毁当前UI");
    }

    protected onHided() {
        // console.warn("[onHided ]", "已隐藏当前UI");
    }

    protected onShowed(data?: any) {
        // console.warn("[onShowed]", "已显示当前UI");
        this.label.string = "RESOURCE_BINDING里声明的对象可以直接使用";
    }

    update(dt: number) {
    }

    lateUpdate() {
    }

}

BASE.UIManager.registerUI("TestUI", new TestUI())