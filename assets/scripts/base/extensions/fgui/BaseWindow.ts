import { TimerManager } from "../../core/timer/TimerManager";
import { EventsManager } from "../../core/event/EventManager";

/**
 * 基础窗口类
 * 重写私有方法 _init 需要忽略报红
 */
export abstract class BaseWindow extends fgui.Window {

    private _timerManager: TimerManager;
    private _eventsManager: EventsManager;

    protected pkgName: string = "";
    protected resName: string = "";
    protected showEnterAndLeaveAnim: boolean = true;

    constructor() {
        super();
        this._timerManager = App.Utils.TimerManager.new();
    }

    get timer() {
        return this._timerManager;
    }

    get rootView() {
        return this.contentPane;
    }

    // 重写私有方法 _init 忽略报红
    private _init() {
        fgui.UIPackage.loadPackage(`ui/${this.pkgName}`, (err) => {
            super['_init']();
        });
    }


    protected onInit() {
        this.contentPane = fgui.UIPackage.createObject(`${this.pkgName}`, `${this.resName}`).asCom;
        (!this.closeButton) && (this.closeButton = this.contentPane.getChild("closeButton"));
        this.center(true);
        this.modal = true;
        this.onCreate(this.contentPane);
        // console.log("showEnterAndLeaveAnim", this.showEnterAndLeaveAnim);
    }


    abstract onCreate(view: fgui.GComponent);


    protected doShowAnimation() {
        if (this.showEnterAndLeaveAnim) {
            this.contentPane.node.scale = 0.45;
            this.contentPane.node.runAction(
                cc.sequence([
                    cc.scaleTo(0.15, 1.05),
                    cc.scaleTo(0.05, 1),
                ])
            );
        }
        const enterAnim = this.rootView.getTransition("enter_anim");
        enterAnim && enterAnim.play();
        this.onShown();
    }


    protected doHideAnimation() {
        this.hideImmediately();
    }


    protected onShown() {
        this.bringToFront();
        // App.SDK.showBannerAd(null);
    }


    protected onHide() {
        // App.SDK.hideBannerAd();
    }


    // --==============================分隔线================================--


    /**
     * 调度一个自定义的回调函数。
	 * 如果回调函数已调度，那么将不会重复调度它，只会更新时间间隔参数。
     * @param handler 回调
     * @param interval 间隔时间
     * @param repeat 重复次数（实际运行repeat + 1次）
     * @param delay 延迟多少时间后开始执行
     * @param pause 是否暂停
     */
    schedule(handler: Function, interval: number, repeat: number, delay: number, pause: boolean) {
        this._timerManager.runTimer(handler, interval, repeat, delay, pause);
    }


    /**
     * 调度一个只运行一次的回调函数，可以指定 0 让回调函数在下一帧立即执行或者在一定的延时之后执行。
     * @param handler 回调
     * @param delay 延迟多少时间后开始执行
     */
    scheduleOnce(handler: Function, delay: number = 0,) {
        this._timerManager.runDelayTimer(handler, delay);
    }


    /**
     * 注册事件
     * @param eventName 事件名
     * @param handler   事件回调
     * @param once      是否为单次消耗事件
     */
    public bindEvent(type: string, callback?: Function, once: boolean = false) {
        let handler = callback ? callback.bind(this) : (this[type] ? this[type].bind(this) : null);
        if (once) {
            return this.Event.once(type, handler, this);
        }
        return this.Event.on(type, handler, this);
    }


    /**
     * 寻找fgui对象
     * @param sPath 路径
     * @param refrenceNode 相对组件
     */
    public findGObj(sPath: string, refrenceNode: fgui.GComponent = this.rootView): fgui.GObject {
        let arr: Array<string> = sPath.split("/");
        let obj: fgui.GObject = null;
        for (let i = 0; i < arr.length; i++) {
            if (obj && obj.asCom && obj.asCom.getChild) {
                obj = obj.asCom.getChild(arr[i]);
            } else {
                obj = refrenceNode.getChild(arr[i]);
            }
        }
        return obj;
    }


    /**
     * 销毁window
     */
    public destroy() {
        cc.log("销毁window", this.resName);
        this.dispose();
    }


    /**
     * EventsManager
     */
    get Event() {
        if (!this._eventsManager) {
            this._eventsManager = App.SingletonFactory.getInstance(EventsManager);
            let onDestroy = this.onDestroy.bind(this);
            this.onDestroy = () => {
                this.Event.offTarget(this);
                onDestroy && onDestroy();
            };
        }
        return this._eventsManager;
    }


    protected onDestroy() {
        this._timerManager.removeAllTimers();
    }


}