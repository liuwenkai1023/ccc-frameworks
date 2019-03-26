import BASE from "../../../base/BASE";
import BaseComponent from "../../../base/BaseComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class AppStart extends BaseComponent {

    private fadeTime: number;
    private targetTime: number;
    private currentTime: number;
    private preLoaded: boolean;

    onInitData() {
        this.fadeTime = .5;
        this.targetTime = 2;
        this.currentTime = 0;
        this.preLoaded = false;
    }

    onLoaded() {
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(this.fadeTime));
    }

    start() {
        cc.director.preloadScene("Main", null, () => {
            this.preLoaded = true;
        });
    }

    update(dt: number) {
        this.currentTime += dt;
        if (this.preLoaded && this.currentTime >= this.targetTime) {
            // let icon = this.findView("background/icon", this.node);
            // icon.runAction(cc.sequence([cc.rotateBy(0.15, 90), cc.delayTime(0.25), cc.callFunc(() => {
            cc.director.loadScene("Main");
            // })]));
            this.preLoaded = false;
        }
    }

    onDestory() {
    }

}