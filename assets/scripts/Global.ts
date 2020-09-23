
import ScreenCapture from "./base/components/ScreenCapture";

import { Base64 } from "./base/utils/Base64";
import { SdkManager } from "./sdk/SdkManager";
import { LocalData } from "./base/core/data/LocalData";
import { DataManager } from "./base/core/data/DataManager";
import { BaseComponent } from "./base/core/BaseComponent";
import { EventsManager } from "./base/core/event/EventManager";
import { AudioManager } from "./base/core/audio/AudioMananger";
import { TimerManager } from "./base/core/timer/TimerManager";
import { UIManager } from "./base/core/mvc/UIManager";
import { SingletonFactory } from "./base/core/SingleFactory";
import { LocalStorageManager } from "./base/core/storage/StorageManager";
import { CallbackManager } from "./sdk/CallbackManager";
import { ToutiaoAdapter } from "./sdk/platform/h5/ToutiaoAdapter";
import { BaiduAdapter } from "./sdk/platform/h5/BaiduAdapter";


/**
 * Utils
 */
export class Utils {
    Base64 = Base64;
    LocalData = SingletonFactory.getInstance(LocalData);
    DataManager = SingletonFactory.getInstance(DataManager);
    EventManager = SingletonFactory.getInstance(EventsManager);
    AudioManager = SingletonFactory.getInstance(AudioManager);
    TimerManager = SingletonFactory.getInstance(TimerManager);
    StorageManager = SingletonFactory.getInstance(LocalStorageManager);
    UIManager = SingletonFactory.getInstance(UIManager);
}


/**
 * App 快捷方法
 */
export class MyApp {

    Sdk = SingletonFactory.getInstance(SdkManager).adapter;
    Utils: Utils = SingletonFactory.getInstance(Utils);

    BaseComponent = BaseComponent;
    SingletonFactory = SingletonFactory;


    /**
     * 原生到脚本回调
     * @param callbackId 回调id
     * @param result     回调结果
     */
    doCallbackFunc(callbackId: number, result: { errCode: number, data?: any, msg?: string }) {
        SingletonFactory.getInstance(CallbackManager).doCallbackFunc(callbackId, result);
    }

    /**
    * 截屏
    */
    async screenCapture() {
        const screenCapture = cc.director.getScene().getComponentInChildren(ScreenCapture);
        return screenCapture.captureScreenAndSaveData();
    }

    /**
     * 支持录屏？
     */
    get isSupportRecord() {
        return App.Sdk instanceof ToutiaoAdapter || App.Sdk instanceof BaiduAdapter;
    }

    /**
     * Toast提示消息
     * @param text 
     * @param duration 
     */
    showToast(text: string, duration?: number) {
        SingletonFactory.getInstance(EventsManager).emit("SHOW_TOAST", { text: text, duration: duration });
    }

    /**
     * 展示顶层Mask
     * @param show 
     */
    showMask(show: boolean) {
        const mask = cc.find("mask");
        mask.active = show;
        mask.zIndex = cc.macro.MAX_ZINDEX;
    }

    /**
     * 垃圾回收
     */
    triggerGC() {
        if (CC_WECHATGAME) {
            window['wx'].triggerGC();
        } else if (CC_JSB) {
            cc.sys.garbageCollect();
        }
    }

    /**
     * 格式化日期
     * @example App.formatDate(date, `yyyy-MM-dd hh:mm:ss`);
     *  "M+"月份 "d+"日 "h+"小时 "m+"分 "s+"秒 "q+"季度 "S"毫秒 
     * @param date 
     * @param format
     */
    formatDate(date: Date, format: string): string {
        return date['format'](format);
    }

    /**
     * 格式化数字(按一定的结构)
     * @param num 
     * @param charList
     */
    formatNum(num: number, charList: Array<string> = ["", "k", "m", "b", "g", "t", "p", "e", "z", "y", "n", "d", "s"]) {
        let tempNum = num = Math.floor(Number(num));
        let index = 0;
        while (tempNum / 1000 >= 1) {
            index++;
            tempNum = tempNum / 1000;
        }
        return Math.round(tempNum * 100) / 100 + charList[index];
    }

}

/**
 * 定义Global变量
 */
declare global {
    export let App: MyApp;
    export let Utils: Utils;
    interface Window {
        App: MyApp;
        Utils: Utils;
    }
}

window.App = SingletonFactory.getInstance(MyApp);
cc.macro.ENABLE_WEBGL_ANTIALIAS = true;