import { UIManager } from "../../core/mvc/UIManager";
import { BaseComponent } from "../../core/BaseComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export class AppStart extends BaseComponent {

    private fadeTime: number;
    private targetTime: number;
    private currentTime: number;
    private preLoaded: boolean;

    onLoad() {
        // cc.view.enableAntiAlias(false);
        this.initData();
        this.CCMaskHook();
        this.CCButtonHook();
    }

    CCMaskHook() {
        let prototype = cc.Mask.prototype as any;
        let onLoad = prototype.onLoad;
        prototype.onLoad = function () {
            onLoad.bind(this)();
            let canvasSize = cc.view.getCanvasSize();
            this._clearGraphics.rect(-canvasSize.width / 2, -canvasSize.height / 2, 3000, 3000);
            this._clearGraphics.fill();
        }
    }

    CCButtonHook() {
        let prototype = cc.Button.prototype as any;
        let _onTouchEnded = prototype._onTouchEnded;
        prototype._soundId = "SOUND_CLICK";
        prototype._onTouchEnded = function (event) {
            _onTouchEnded.bind(this)(event);
            // 播放通用按钮音效
        };
    }

    initData() {
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
        App.SingletonFactory.getInstance(UIManager).destoryAllUI();
    }

}