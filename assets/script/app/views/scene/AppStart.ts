import { UIManager } from "../../../base/mvc/UIManager";
import { BaseComponent } from "../../../base/BaseComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export class AppStart extends BaseComponent {

    private fadeTime: number;
    private targetTime: number;
    private currentTime: number;
    private preLoaded: boolean;

    onLoad() {
        this.fadeTime = .5;
        this.targetTime = 2;
        this.currentTime = 0;
        this.preLoaded = false;
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
            cc.director.loadScene("Main");
            this.preLoaded = false;
        }
    }

    onDestroy() {
        UIManager.instance().destoryAllUI();
    }

}