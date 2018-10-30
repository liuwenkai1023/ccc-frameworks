import BaseComponent from "../BaseComponent";

const { ccclass, property, disallowMultiple } = cc._decorator;

@ccclass
@disallowMultiple
export default class HotUpdatePanelComponent extends BaseComponent {

    @property({ type: cc.Label, displayName: "提示信息", tooltip: "cc.Label" })
    info: cc.Label;

    @property({ type: cc.Label, displayName: "字节进度", tooltip: "cc.Label" })
    byteLabel: cc.Label;

    @property({ type: cc.Label, displayName: "下载进度", tooltip: "cc.Label" })
    fileLabel: cc.Label;

    @property({ type: cc.ProgressBar, displayName: "字节进度条", tooltip: "cc.ProgressBar" })
    byteProgress: cc.ProgressBar;

    @property({ type: cc.ProgressBar, displayName: "下载文件进度条", tooltip: "cc.ProgressBar" })
    fileProgress: cc.ProgressBar;

    @property({ type: cc.Node, displayName: "关闭按钮", tooltip: "cc.Node" })
    close: cc.Node;

    @property({ type: cc.Node, displayName: "检查按钮", tooltip: "cc.Node" })
    checkBtn: cc.Node;

    @property({ type: cc.Node, displayName: "重试按钮", tooltip: "cc.Node" })
    retryBtn: cc.Node;

    @property({ type: cc.Node, displayName: "更新按钮", tooltip: "cc.Node" })
    updateBtn: cc.Node

    protected onLoad() {
        super.onLoad();
        this.close.on(cc.Node.EventType.TOUCH_END, function () {
            this.node.parent.active = false;
        }, this);
    }

}
