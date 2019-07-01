import { IOSAdapter } from "./platform/IOSAdapter";
import { AndroidAdapter } from "./platform/AndroidAdapter";
import { DefaultAdapter } from "./platform/DefaultAdapter";
import { AdapterInterface } from "./AdapterInterface";

export class AdapterManager {

    private _adapter: AdapterInterface;

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
            case cc.sys.ANDROID:
                this._adapter = new AndroidAdapter();
                break;
            case cc.sys.IPHONE:
                this._adapter = new IOSAdapter();
                break;
            default:
                this._adapter = new DefaultAdapter();
                break;
        }
    }

}
