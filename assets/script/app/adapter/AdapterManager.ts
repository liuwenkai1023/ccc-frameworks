import Adapter from "./platform/Adapter";
import AndroidAdapter from "./platform/AndroidAdapter";
import IOSAdapter from "./platform/IOSAdapter";
import DefaultAdapter from "./platform/DefualtAdapter";

export default class AdapterManager {

    private _adapter: Adapter;

    private static _instance: AdapterManager;

    private constructor() {
        this.init();
    }


    // 获取适配器
    get adapter() {
        return this._adapter;
    }


    /**
     * 获取单例
     */
    static instance(): AdapterManager {
        if (!AdapterManager._instance) {
            AdapterManager._instance = new AdapterManager()
        }
        return this._instance
    }


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
