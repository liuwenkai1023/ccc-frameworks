import { SdkAdapterBase } from "./SdkAdapterBase";
import { IOSAdapter } from "./platform/IOSAdapter";
import { AndroidAdapter } from "./platform/AndroidAdapter";
import { DefaultAdapter } from "./platform/DefaultAdapter";
import { WechatAdapter } from "./platform/h5/WechatAdapter";
import { QQAdapter } from "./platform/h5/QQAdapter";
import { ToutiaoAdapter } from "./platform/h5/ToutiaoAdapter";
import { BaiduAdapter } from "./platform/h5/BaiduAdapter";
import { VivoAdapter } from "./platform/h5/VivoAdapter";
import { OppoAdapter } from "./platform/h5/OppoAdapter";


export class SdkManager {

    private _adapter: SdkAdapterBase;

    // private static _instance: AdapterManager;

    constructor() {
        this.init();
    }


    // 获取适配器
    get adapter() {
        return this._adapter;
    }


    // /**
    //  * 获取单例
    //  */
    // static getInstance(): AdapterManager {
    //     if (!AdapterManager._instance) {
    //         AdapterManager._instance = new AdapterManager();
    //     }
    //     return this._instance;
    // }


    /**
     * 初始化Sdk
     */
    private init() {
        // TODO 小游戏平台需要添加到 Android/iOS/iPad 之前
        switch (cc.sys.platform) {

            // 微信小游戏、头条小游戏、QQ小游戏
            case cc.sys.WECHAT_GAME:
                // this._adapter = new QQAdapter();
                this._adapter = new WechatAdapter();
                // this._adapter = new ToutiaoAdapter();
                break;

            // OPPO小游戏
            case cc.sys.OPPO_GAME:
                this._adapter = new OppoAdapter();
                break;

            // VIVO小游戏
            case cc.sys.VIVO_GAME:
                this._adapter = new VivoAdapter();
                break;

            // 百度小游戏
            case cc.sys.BAIDU_GAME:
                this._adapter = new BaiduAdapter();
                break;

            // 原生安卓
            case cc.sys.ANDROID:
                this._adapter = new AndroidAdapter();
                break;

            // 原生iOS
            case cc.sys.IPAD:
            case cc.sys.IPHONE:
                this._adapter = new IOSAdapter();
                break;

            // 默认适配器
            default:
                this._adapter = new DefaultAdapter();
                break;
        }
    }

}
