const { ccclass, property, executeInEditMode, menu, requireComponent } = cc._decorator;

export enum FitUIPlatform { ANDROID, IOS, OTHER }

export enum FitUIOrientation { HORIZONTAL, VERTICAL }

const IsH = function () { return this.orientation == FitUIOrientation.HORIZONTAL };
const IsV = function () { return this.orientation == FitUIOrientation.VERTICAL };

@ccclass
@menu("扩展组件/FitUI")
@executeInEditMode
@requireComponent(cc.Widget)
export default class FitUI extends cc.Component {

    // Orientation
    @property({ displayName: "适配方向", type: cc.Enum(FitUIOrientation) })
    orientation: FitUIOrientation = FitUIOrientation.VERTICAL;


    // Android
    @property({ displayName: "安卓设备", type: cc.Enum(FitUIPlatform) })
    get a() { return FitUIPlatform.ANDROID; }

    @property({ displayName: "left", visible: IsH })
    left: boolean = false;

    @property({ displayName: "right", visible: IsH })
    right: boolean = false;

    @property({ displayName: "top", visible: IsV })
    top: boolean = false;

    @property({ displayName: "bottom", visible: IsV })
    bottom: boolean = false;


    // IOS
    @property({ displayName: "苹果设备", type: cc.Enum(FitUIPlatform) })
    get i() { return FitUIPlatform.IOS; }

    @property({ displayName: "left", visible: IsH })
    iLeft: boolean = false;

    @property({ displayName: "right", visible: IsH })
    iRight: boolean = false;

    @property({ displayName: "top", visible: IsV })
    iTop: boolean = false;

    @property({ displayName: "bottom", visible: IsV })
    iBottom: boolean = false;


    // OTHER
    @property({ displayName: "其它设备", type: cc.Enum(FitUIPlatform) })
    get o() { return FitUIPlatform.OTHER; }

    @property({ displayName: "left", visible: IsH })
    oLeft: boolean = false;

    @property({ displayName: "right", visible: IsH })
    oRight: boolean = false;

    @property({ displayName: "top", visible: IsV })
    oTop: boolean = false;

    @property({ displayName: "bottom", visible: IsV })
    oBottom: boolean = false;


    onLoad() {
        CC_EDITOR && this.getComponents(FitUI).length > 2 && this.node.removeComponent(this);
        (!CC_EDITOR) && this.applySettings();
    }


    private applySettings() {
        let size = cc.view.getVisibleSize()
        let nPlatform = cc.sys.platform;
        let tSize = size.width / size.height;
        tSize = this.orientation == FitUIOrientation.VERTICAL ? tSize : 1 / tSize;
        let dSize = 0.56; // 只有全面屏需要适配
        if (tSize >= dSize) {
            this.updateFitStrategy(true, true);
            return;
        } else {
            this.orientation == FitUIOrientation.VERTICAL && this.updateFitStrategy(true, false);
            this.orientation == FitUIOrientation.HORIZONTAL && this.updateFitStrategy(false, true);
        }
        // nPlatform = cc.sys.IPHONE;
        let aRule = { top: this.top, left: this.left, right: this.right, bottom: this.bottom };
        let iRule = { top: this.iTop, left: this.iLeft, right: this.iRight, bottom: this.iBottom };
        let oRule = { top: this.oTop, left: this.oLeft, right: this.oRight, bottom: this.oBottom };
        switch (nPlatform) {
            case cc.sys.ANDROID:
                this.fitPhone(aRule);
                break;
            case cc.sys.IPHONE:
                this.fitPhone(iRule);
                break;
            default: // 非原生
                if (!CC_JSB) {
                    switch (cc.sys.os) {
                        case cc.sys.OS_IOS:
                            this.fitPhone(iRule);
                            break;
                        case cc.sys.OS_ANDROID:
                            this.fitPhone(aRule);
                            break;
                        default: // 无法识别，按OTHER处理
                            this.fitPhone(oRule)
                            break;
                    }
                }
                break;
        }
    }


    private fitPhone(rule: { top: boolean, left: boolean, right: boolean, bottom: boolean }) {
        // 分辨率 375 x 812 
        let size = cc.view.getVisibleSize();
        let height = this.orientation == FitUIOrientation.VERTICAL ? size.height : size.width
        let liuhaiHeight = height * 44 / 812; // 顶部刘海
        let bottomHeight = height * 34 / 812; // 底部安全区域
        // 适配
        switch (this.orientation) {
            case FitUIOrientation.VERTICAL:
                rule.top && this.updateWidget("top", liuhaiHeight);
                rule.bottom && this.updateWidget("bottom", bottomHeight);
                break;
            case FitUIOrientation.HORIZONTAL:
                rule.left && this.updateWidget("left", bottomHeight);
                rule.right && this.updateWidget("right", liuhaiHeight);
                break;
            default:
                break;
        }
    }


    private updateWidget(orientation: string, delta: number) {
        let widget = this.getComponent(cc.Widget);
        if (widget) {
            if (!widget[`default_${orientation}`]) {
                widget[`default_${orientation}`] = widget[`${orientation}`];
            }
            widget[`${orientation}`] = widget[`default_${orientation}`] + delta;
        }
    }


    private updateFitStrategy(fitWidth: boolean, fitHeight: boolean) {
        // console.log(fitWidth, fitHeight);
        let canvas = this.node.getComponent(cc.Canvas);
        if (canvas) {
            canvas.fitWidth = fitWidth;
            canvas.fitHeight = fitHeight;
            // console.log("updateFitStrategy", canvas);
            canvas[`applySettings`]();
        }
    }

    // update (dt) {}
}
