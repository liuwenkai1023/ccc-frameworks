import BASE from "../BASE";
import UIComponent from "./ViewBase";

export default class UIManager {
    private static _instance: UIManager;
    private _UIMaps: { [key: string]: UI };

    get uiMaps() {
        return this._UIMaps;
    }

    private constructor() {
        this.init();
    }

    public static instance() {
        if (!this._instance) {
            this._instance = new UIManager();
        }
        return UIManager._instance;
    }

    private init() {
        this._UIMaps = {};
    }

    public ShowUI(UIModel: typeof UIComponent, parentNode?: cc.Node, _handler?: Function) {
        let UIName = UIModel.UIName;
        this.uiMaps[UIName] = !this.uiMaps[UIName] ? { name: UIName, component: null, status: LoadEnum.NORMAL } : this.uiMaps[UIName];
        let UIMessage = this.uiMaps[UIName];
        switch (UIMessage.status) {
            case LoadEnum.LOADING:
                break;
            case LoadEnum.LOADED:
                UIMessage.component.node.active = true;
                _handler && _handler();
                break;
            case LoadEnum.NORMAL:
                UIMessage.status = LoadEnum.LOADING;
                BASE.Loader.load(UIModel.ResourcePath, cc.Prefab, (res: cc.Prefab[]) => {
                    this.initUI(UIModel, res[0], parentNode);
                    _handler && _handler();
                });
                break;
        }
    }

    private initUI(UIModel: typeof UIComponent, prefab: cc.Prefab, parentNode: cc.Node = cc.director.getScene()) {
        let UIMessage = this.uiMaps[UIModel.UIName];
        let uiNode = cc.instantiate(prefab);
        if (uiNode && parent) {
            uiNode.setParent(parentNode);
            UIMessage.status = LoadEnum.LOADED;
            let component = uiNode.getComponent(typeof UIModel);
            if (!component) {
                component = uiNode.addComponent(<any>UIModel);
            }
            UIMessage.component = component;
            UIMessage.status = LoadEnum.LOADED;
        } else {
            console.log("Error:创建UI时出错", UIMessage.name);
            UIMessage.status = LoadEnum.NORMAL;
        }
        // console.log(this.uiMaps);
    }

    public destoryUI(UIName: string) {
        if (this.uiMaps.hasOwnProperty(UIName)) {
            const UIMessage = this.uiMaps[UIName];
            switch (UIMessage.status) {
                case LoadEnum.LOADING:
                    console.log("销毁UI失败，对应UI不存在(还在创建中)...", UIName);
                    break;
                case LoadEnum.LOADED:
                    UIMessage.component.node.destroy();
                    delete this.uiMaps[UIName];
                    return true;
            }
        }
        return false;
    }

    public closeUI(UIName: string) {
        if (this.uiMaps.hasOwnProperty(UIName)) {
            const UIMessage = this.uiMaps[UIName];
            if (UIMessage.status == LoadEnum.LOADED) {
                UIMessage.component.node.active = false;
                return true;
            }
        }
        return false;
    }

    public destoryAllUI() {
        for (const UIName in this.uiMaps) {
            this.destoryUI(UIName);
        }
    }

}

enum LoadEnum { NORMAL, LOADING, LOADED, }
interface UI { name: string, status: LoadEnum, component: UIComponent }
