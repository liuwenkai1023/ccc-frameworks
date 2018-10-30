import ViewBase from "./ViewBase";

export default class UIManager {

    private static _instance: UIManager;
    private _UIMap: { [key: string]: ViewBase };

    get uiMap() {
        return this._UIMap;
    }

    public static instance() {
        if (!this._instance) {
            this._instance = new UIManager();
        }
        return UIManager._instance;
    }


    private constructor() {
        this.init();
    }


    /**
     * 初始化基本参数
     */
    private init() {
        this._UIMap = {};
    }


    /**
     * 展示某个UI
     * @param UIName UI的名字 
     * @param data 展示UI时传递的数据
     * @param handler UI展示完成的回调
     */
    public showUI(UIName: string, data?: any, handler?: Function) {
        let UIModel = this._UIMap[UIName];
        if (!UIModel) return;
        let callback = () => {
            if (handler) handler(UIModel);
            UIModel.show();
            UIModel.onShowEnd(data);
        }
        if (!UIModel.isLoaded) {
            UIModel.onCreate(callback);
        } else {
            callback();
        }
    }


    /**
     * 关闭某个UI的展示
     * @param UIName UI的名字
     */
    public closeUI(UIName: string) {
        let UIModel = this._UIMap[UIName];
        if (!UIModel) return false;
        if (UIModel.isLoaded) {
            UIModel.hide();
            return true;
        }
        return false;
    }


    /**
     * 销毁某个UI
     * @param UIName UI的名字 
     */
    public destoryUI(UIName: string) {
        if (this._UIMap.hasOwnProperty(UIName)) {
            const UIModel = this._UIMap[UIName];
            UIModel.destory();
            return true;
        }
        return false;
    }


    /**
     * 销毁所有的UI
     */
    public destoryAllUI() {
        let UIMap = this._UIMap;
        for (const UIName in UIMap) {
            this.destoryUI(UIName);
        }
    }

}