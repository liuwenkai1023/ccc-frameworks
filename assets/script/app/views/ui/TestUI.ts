import BASE from "../../../base/BASE";
import ViewBase from "../../../base/mvc/ViewBase";


export default class TestUI extends ViewBase {

    RESOURCE_FILENAME = "prefab/testUI";

    RECEIVER_CONFIG = ["HELLO",];

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
    }

    public onShowed(data?: any) {
        console.log("[onShowed]", "已显示当前UI");
    }

    public onClosed() {
        console.log("[onHided ]", "已关闭当前UI");
    }

    public onDestroy() {
        console.log("[onDestroy]", "已销毁当前UI");
    }

    public update(dt: number) {
    }

    public lateUpdate() {
    }

}

BASE.UIManager.registerUI("TestUI", new TestUI())