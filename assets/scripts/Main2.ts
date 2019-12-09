import { UITest } from "./app/test_fgui/UITest";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        fgui.UIConfig.modalLayerColor = new cc.Color(0, 0, 0, 127.5);
        fgui.addLoadHandler();
        fgui.GRoot.create();
        fgui.UIPackage.loadPackage(`UI/common`, () => { });
    }

    start() {
        this.addComponent(UITest);
    }

    // update (dt) {}
}
