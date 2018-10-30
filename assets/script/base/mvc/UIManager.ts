import ViewBase from "./ViewBase";

export default class UIManager {

    private static _instance: UIManager;
    private _uiMap: { [key: string]: ViewBase };

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
        this._uiMap = {};
    }

    showUI(uiName: string, data?: any, handler?: Function) {
        let view = this._uiMap[uiName];
        if (!view) return;
        let callback = () => {
            if (handler) handler(view);
            view.show();
            view.onShowFinish(data);
        }
        if (!view.isLoaded) {
            view.onCreate(callback);
        } else {
            callback();
        }
    }

    closeUI(uiName: string) {
        let view = this._uiMap[uiName];
        if (!view) return false;
        if (view.isLoaded) {
            view.hide();
            return true;
        }
        return false;
    }

    destoryUI(uiName: string) {
        let view = this._uiMap[uiName];
        if (!view) return;
        view.destory();
    }

    destoryAllUI() {
        let uiMap = this._uiMap;
        for (const key in uiMap) {
            if (uiMap.hasOwnProperty(key)) {
                const view = uiMap[key];
                view.destory();
            }
        }
    }

}