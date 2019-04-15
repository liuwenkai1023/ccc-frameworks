import ViewBase from "./ViewBase";
import Loader from "../utils/loader/Loader";

export default class UIManager {
    private static _instance: UIManager;
    private _UIMaps: { [key: string]: UIMessageI };


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
        return this._instance;
    }


    public showUI(viewBase: typeof ViewBase, parentNode?: cc.Node, callback?: Function) {
        let UIName = viewBase.UIName;
        this.UIMaps[UIName] = !this.UIMaps[UIName] ? { name: UIName, component: null, status: LoadEnum.NORMAL } : this.UIMaps[UIName];
        let UIMessage = this.UIMaps[UIName];
        switch (UIMessage.status) {
            case LoadEnum.LOADING:
                break;
            case LoadEnum.LOADED:
                if (UIMessage.component && UIMessage.component.isValid) {
                    UIMessage.component.node.active = true;
                } else {
                    UIMessage.status = LoadEnum.DESTORY;
                    this.showUI(viewBase, parentNode, callback);
                    return;
                }
                callback && callback();
                break;
            case LoadEnum.DESTORY:
            case LoadEnum.NORMAL:
                UIMessage.status = LoadEnum.LOADING;
                Loader.instance().load(viewBase.ResourcePath, cc.Prefab, (res: cc.Prefab[]) => {
                    this.initUI(viewBase, res[0], parentNode);
                    callback && callback();
                });
                break;
        }
    }


    private initUI(viewBase: typeof ViewBase, prefab: cc.Prefab, parentNode: cc.Node = cc.director.getScene()) {
        let UIMessage = this.UIMaps[viewBase.UIName];
        let UINode = cc.instantiate(prefab);
        if (UINode && parentNode) {
            UINode.setParent(parentNode);
            UIMessage.status = LoadEnum.LOADED;
            let component = UINode.getComponent(viewBase);
            if (!component) {
                component = UINode.addComponent(<any>viewBase);
            }
            UIMessage.component = component;
            UIMessage.status = LoadEnum.LOADED;
        } else {
            console.log("Error:创建UI时出错", UIMessage.name);
            UIMessage.status = LoadEnum.NORMAL;
        }
    }


    public destoryUI(UIName: string) {
        if (this.UIMaps.hasOwnProperty(UIName)) {
            const UIMessage = this.UIMaps[UIName];
            switch (UIMessage.status) {
                case LoadEnum.LOADING:
                    console.log("销毁UI失败，对应UI不存在(还在创建中)...", UIName);
                    break;
                case LoadEnum.LOADED:
                    UIMessage.component.node.destroy();
                    delete this.UIMaps[UIName];
                    cc.sys.garbageCollect();
                    return true;
            }
        }
        return false;
    }


    public getUI(UIName): UIMessageI {
        if (this.UIMaps.hasOwnProperty(UIName)) {
            const UIMessage = this.UIMaps[UIName];
            if (UIMessage.status == LoadEnum.LOADED) {
                return UIMessage;
            }
        }
    }


    public closeUI(UIName: string) {
        if (this.UIMaps.hasOwnProperty(UIName)) {
            const UIMessage = this.UIMaps[UIName];
            if (UIMessage.status == LoadEnum.LOADED) {
                UIMessage.component.node.active = false;
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


    get UIMaps() {
        return this._UIMaps;
    }

}

export enum LoadEnum {
    NORMAL,
    LOADING,
    LOADED,
    DESTORY
}
export interface UIMessageI { name: string, status: LoadEnum, component: ViewBase }
