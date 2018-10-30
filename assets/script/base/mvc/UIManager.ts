import ViewBase from "./ViewBase";

export default class UIManager {

    private static _instance: UIManager;
    private _UIMap: { [key: string]: ViewBase };


    public static instance() {
        if (!this._instance) {
            this._instance = new UIManager();
        }
        return UIManager._instance;
    }


    private constructor() {
        this.init();
    }


    private init() {
        this._UIMap = {};
    }


    showUI(UIName: string, data?: any, handler?: Function) {
        let UIModel = this._UIMap[UIName];
        if (!UIModel) return;
        let callback = () => {
            if (handler) handler(UIModel);
            UIModel.show();
            UIModel.onShowFinish(data);
        }
        if (!UIModel.isLoaded) {
            UIModel.onCreate(callback);
        } else {
            callback();
        }
    }


    closeUI(UIName: string) {
        let UIModel = this._UIMap[UIName];
        if (!UIModel) return false;
        if (UIModel.isLoaded) {
            UIModel.hide();
            return true;
        }
        return false;
    }


    destoryUI(UIName: string) {
        let UIModel = this._UIMap[UIName];
        if (!UIModel) return;
        UIModel.destory();
    }


    destoryAllUI() {
        let UIMap = this._UIMap;
        for (const key in UIMap) {
            if (UIMap.hasOwnProperty(key)) {
                const UIModel = UIMap[key];
                UIModel.destory();
            }
        }
    }

}