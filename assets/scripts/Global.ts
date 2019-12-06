import { SdkManager } from "./sdk/SdkManager";
import { BaseComponent } from "./core/BaseComponent";
import { HttpUtil } from "./core/utils/HttpUtil";
import { AudioManager } from "./core/extension/audio/AudioMananger";
import { DataManager } from "./core/extension/data/DataManager";
import { Base64 } from "./core/utils/Base64";
import { LocalData } from "./core/extension/data/LocalData";
import { TimerManager } from "./core/extension/timer/TimerManager";
import { LocalStorageManager } from "./core/extension/storage/StorageManager";
import { SingletonFactory } from "./core/utils/SingleFactory";
import { EventsManager } from "./core/extension/event/EventManager";
import ScreenCapture from "./core/components/ScreenCapture";


declare global {
    export let App: MyApp;
    export let gg: Global;
    interface Window {
        App: MyApp;
        gg: Global;
    }
}


export class Global {

}


export class MyApp {

    SDK = SingletonFactory.getInstance(SdkManager).adapter;
    Utils: Utils = SingletonFactory.getInstance(Utils);
    BaseComponent = BaseComponent;
    SingletonFactory = SingletonFactory;


    /**
     * 垃圾回收
     */
    triggerGC() {
        if (CC_WECHATGAME) {
            window['wx'].triggerGC();
        }
        else if (CC_JSB) {
            cc.sys.garbageCollect();
        }
        else {
            // cc.log("当前平台无法手动GC");
        }
    }


    // /**
    //  * 加载FGUI中的图片资源
    //  * @param itemURL 
    //  */
    // loadResInFGUI(itemURL: string): cc.SpriteFrame {
    //     let contentItem = fgui.UIPackage.getItemByURL(itemURL);
    //     if (contentItem != null) {
    //         contentItem.load();
    //         if (contentItem.type == fgui.PackageItemType.Image) {
    //             if (contentItem.asset) {
    //                 return contentItem.asset as any;
    //             }
    //         }
    //     }
    // }


    // /**
    //  * 加载网络图片
    //  * @param loader    fgui.GLoader
    //  * @param picUrl    图片地址
    //  * @param tag       标记
    //  * @param overwrite 是否覆盖
    //  */
    // loadResInNet(loader: fgui.GLoader, picUrl: string, tag: string, overwrite: boolean = false) {
    //     CC_JSB && HttpUtil.HttpDownload(picUrl, `${tag}.png`, (err, path) => {
    //         loader.url = null;
    //         cc.loader.load(path, () => { loader.url = path; });
    //     }, overwrite);
    // }


    // playMusic(soundId: string) {
    //     return App.SingletonFactory.getInstance(AudioManager).playMusic(App.SingletonFactory.getInstance(DataManager).getDataByNameAndId("Sounds", soundId)[`Name`]);
    // }


    // playEffect(soundId: string, loop: boolean = false, callback?: Function) {
    //     return App.SingletonFactory.getInstance(AudioManager).playEffect(App.SingletonFactory.getInstance(DataManager).getDataByNameAndId("Sounds", soundId)[`Name`], loop, callback);
    // }


    showToast(str: string) {
        App.SingletonFactory.getInstance(EventsManager).emit("SHOW_TOAST", str);
    }


    /**
     * 将数子转换为 带单位的字符串
     * ["", "K", "M", "B", "G", "T", "P", "E", "Z", "Y", "N", "D"]
     * @param num 
     */
    formatNum(num: number) {
        let tempNum = num = Math.floor(Number(num));
        // let char = ["", "K", "M", "B", "G", "T", "P", "E", "Z", "Y", "N", "D"];
        let char = ["", "k", "m", "b", "g", "t", "p", "e", "z", "y", "n", "d"];
        let index = 0;
        while (tempNum / 1000 >= 1) {
            index++;
            tempNum = tempNum / 1000;
        }
        return Math.round(tempNum * 100) / 100 + char[index];
    }


    /**
     * 截屏
     */
    async screenCapture() {
        const screenCapture = cc.director.getScene().getComponentInChildren(ScreenCapture);
        return screenCapture.captureScreenAndSaveData();
    }

}


export class Utils {
    Base64 = Base64;
    HttpUtil = HttpUtil;
    LocalData = SingletonFactory.getInstance(LocalData);
    DataManager = SingletonFactory.getInstance(DataManager);
    EventManager = SingletonFactory.getInstance(EventsManager);
    AudioManager = SingletonFactory.getInstance(AudioManager);
    TimerManager = SingletonFactory.getInstance(TimerManager);
    StorageManager = SingletonFactory.getInstance(LocalStorageManager);
}

cc.macro.ENABLE_WEBGL_ANTIALIAS = true;
cc.view.enableAntiAlias(true);

window.App = SingletonFactory.getInstance(MyApp);
window.gg = new Global();