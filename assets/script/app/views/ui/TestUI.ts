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
        console.log("[onLoad  ]", "初始化数据");
    }

    public onLoaded() {
        console.log("[onLoaded]", "初始化当前UI节点、组件以及监听等");
    }

    public onStart() {
        console.log("[onStart ]", "初始化当前UI逻辑、动画等");
        this.label.node.runAction(cc.repeatForever(cc.sequence([
            cc.scaleTo(0.1, 1.05),
            cc.scaleTo(0.1, 1),
        ])));
        this.timerManager.runDelayTimer(() => {
            this.broadcastManager.sendBroadcast("HELLO", "通过广播更新了Label");
            this.pause();
            // cc.director.loadScene("helloworld");
        }, 3);
        BASE.TimerManager.runDelayTimer(() => {
            this.resume();
        }, 6); 
        BASE.TimerManager.runDelayTimer(() => {
            this.pause(true);
        }, 9);
    }

    public onDestroy() {
        console.log("[onDestroy]", "已销毁当前UI");
    }

    public onClosed() {
        console.log("[onHided ]", "已关闭当前UI");
    }

    public onShowed(data?: any) {
        console.log("[onShowed]", "已显示当前UI");
        this.label.string = "RESOURCE_BINDING里声明的对象可以直接使用";
    }

    public update(dt: number) {
    }

    public lateUpdate() {
    }

    HELLO(data) {
        this.label.string = data;
    }
}

BASE.UIManager.registerUI("TestUI", new TestUI())