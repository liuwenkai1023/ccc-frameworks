import ViewBase from "./ViewBase";

export default class UIManager {

    private static _instance: UIManager;
    private _UIMaps: { [key: string]: ViewBase };

    get uiMaps() {
        return this._UIMaps;
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
        this._UIMaps = {};
    }


    /**
     * 在UIManager中注册UIModel
     * @param UIName UI的名字
     * @param UIModel 对应的UIModel（ViewBase）
     */
    public registerUI(UIName: string, UIModel: ViewBase): boolean {
        if (UIName && UIName.length > 0 && UIModel && UIModel instanceof ViewBase) {
            this._UIMaps[UIName] = UIModel;
            return true;
        }
        return false;
    }


    /**
     * 展示某个UI
     * @param UIName     UI的名字 
     * @param data       UI展示时传递的数据
     * @param handler    UI展示完成的回调
     * @param parentNode UI的父节点
     */
    public showUI(UIName: string, data?: any | void, handler?: Function | void, parentNode?: cc.Node | void) {
        let UIModel = this._UIMaps[UIName];
        if (!UIModel) return;
        let callback = () => {
            handler && handler(UIModel);
            UIModel.show(data);
        }
        if (!UIModel.isLoaded) {
            UIModel.onCreate(callback, parentNode);
        } else {
            callback();
        }
    }


    /**
     * 关闭某个UI的展示
     * @param UIName UI的名字
     */
    public closeUI(UIName: string) {
        let UIModel = this._UIMaps[UIName];
        if (!UIModel) return false;
        if (UIModel.isLoaded) {
            UIModel.close();
            return true;
        }
        return false;
    }


    /**
     * 销毁某个UI
     * @param UIName UI的名字 
     */
    public destoryUI(UIName: string) {
        if (this._UIMaps.hasOwnProperty(UIName)) {
            const UIModel = this._UIMaps[UIName];
            UIModel.destory();
            return true;
        }
        return false;
    }


    /**
     * 销毁所有的UI
     */
    public destoryAllUI() {
        let UIMaps = this._UIMaps;
        for (const UIName in UIMaps) {
            this.destoryUI(UIName);
        }
    }

}