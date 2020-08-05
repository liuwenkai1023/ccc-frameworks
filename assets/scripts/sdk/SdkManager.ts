import { SdkAdapterBase } from "./SdkAdapterBase";
import { IOSAdapter } from "./platform/IOSAdapter";
import { AndroidAdapter } from "./platform/AndroidAdapter";
import { DefaultAdapter } from "./platform/DefaultAdapter";


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
     * 初始化参数
     */
    private init() {
        switch (cc.sys.platform) {
            // TODO 小游戏平台需要添加到 Android/iOS/iPad 之前
            case cc.sys.ANDROID:
                this._adapter = new AndroidAdapter();
                break;

            case cc.sys.IPAD:
            case cc.sys.IPHONE:
                this._adapter = new IOSAdapter();
                break;

            default:
                this._adapter = new DefaultAdapter();
                break;
        }
    }

}
