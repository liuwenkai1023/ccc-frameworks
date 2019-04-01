import BASE from "../BASE";
import UIComponent from "./ViewBase";

export default class UIManager {
    private static _instance: UIManager;
    private _UIMaps: { [key: string]: UIMessage };

    get UIMaps() {
        return this._UIMaps;
    }

    private constructor() {
        this.init();
    }

    private init() {
        this._UIMaps = {};
    }

    public static instance() {
        if (!this._instance) {
            this._instance = new UIManager();
        }
        return UIManager._instance;
    }
   
    public showUI(UIModel: typeof UIComponent, parentNode?: cc.Node, _handler?: Function) {
        let UIName = UIModel.UIName;
        this.UIMaps[UIName] = !this.UIMaps[UIName] ? { name: UIName, component: null, status: LoadEnum.NORMAL } : this.UIMaps[UIName];
        let UIMsg = this.UIMaps[UIName];
        switch (UIMsg.status) {
            case LoadEnum.LOADING:
                break;
            case LoadEnum.LOADED:
                UIMsg.component.node.active = true;
                _handler && _handler();
                break;
            case LoadEnum.NORMAL:
                UIMsg.status = LoadEnum.LOADING;
                BASE.Loader.load(UIModel.ResourcePath, cc.Prefab, (res: cc.Prefab[]) => {
                    this.initUI(UIModel, res[0], parentNode);
                    _handler && _handler();
                });
                break;
        }
    }

    private initUI(UIModel: typeof UIComponent, prefab: cc.Prefab, parentNode: cc.Node = cc.director.getScene()) {
        let UIMsg = this.UIMaps[UIModel.UIName];
        let UINode = cc.instantiate(prefab);
        if (UINode && parent) {
            UINode.setParent(parentNode);
            UIMsg.status = LoadEnum.LOADED;
            let component = UINode.getComponent(typeof UIModel);
            if (!component) {
                component = UINode.addComponent(<any>UIModel);
            }
            UIMsg.component = component;
            UIMsg.status = LoadEnum.LOADED;
        } else {
            console.log("Error:创建UI时出错", UIMsg.name);
            UIMsg.status = LoadEnum.NORMAL;
        }
        // console.log(this.uiMaps);
    }

    public destoryUI(UIName: string) {
        if (this.UIMaps.hasOwnProperty(UIName)) {
            const UIMsg = this.UIMaps[UIName];
            switch (UIMsg.status) {
                case LoadEnum.LOADING:
                    console.log("销毁UI失败，对应UI不存在(还在创建中)...", UIName);
                    break;
                case LoadEnum.LOADED:
                    UIMsg.component.node.destroy();
                    delete this.UIMaps[UIName];
                    cc.sys.garbageCollect();
                    return true;
            }
        }
        return false;
    }

    public getUI(UIName): UIMessage {
        if (this.UIMaps.hasOwnProperty(UIName)) {
            const UIMsg = this.UIMaps[UIName];
            if (UIMsg.status == LoadEnum.LOADED) {
                return UIMsg;
            }
        }
    }

    public closeUI(UIName: string) {
        if (this.UIMaps.hasOwnProperty(UIName)) {
            const UIMsg = this.UIMaps[UIName];
            if (UIMsg.status == LoadEnum.LOADED) {
                UIMsg.component.node.active = false;
                return true;
            }
        }
        return false;
    }

    public destoryAllUI() {
        for (const UIName in this.UIMaps) {
            this.destoryUI(UIName);
        }
    }

}

enum LoadEnum { NORMAL, LOADING, LOADED, }
interface UIMessage { name: string, status: LoadEnum, component: UIComponent }
