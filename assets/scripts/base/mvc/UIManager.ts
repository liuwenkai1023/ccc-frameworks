import { ViewBase } from "./ViewBase";
import { Lifecycle } from "./Lifecycle";
import { Loader } from "./loader/Loader";

export class UIManager {

    // private static _instance: UIManager;

    private _seq: number = 0;
    private _scene: cc.Scene;
    private _UIMap: { [key: string]: UIMessageI };


    constructor() {
        this.init();
    }


    private init() {
        this._UIMap = {};
    }


    // public static getInstance() {
    //     if (!this._instance) {
    //         this._instance = new UIManager();
    //     }
    //     return this._instance;
    // }


    public showUI(viewBase: typeof ViewBase, parentNode?: cc.Node, callback?: Function) {
        let UIName = viewBase.UIName;
        this.UIMap[UIName] = !this.UIMap[UIName] ? { name: UIName, component: null, status: LoadEnum.NORMAL, canceled: false } : this.UIMap[UIName];
        let UIMessage = this.UIMap[UIName];
        switch (UIMessage.status) {
            case LoadEnum.LOADING:
                UIMessage.canceled && this.log(UIName, "loading restore...");
                UIMessage.canceled = false;
                break;
            case LoadEnum.LOADED:
                this.log(UIName, "already loaded");
                UIMessage.component.node.active = true;
                callback && callback();
                break;
            case LoadEnum.NORMAL:
                this.log(UIName, "loading start...");
                UIMessage.status = LoadEnum.LOADING;
                App.SingletonFactory.getInstance(Loader).load(viewBase.ResourcePath, cc.Prefab, (res: cc.Prefab[]) => {
                    if (UIMessage.canceled) {
                        UIMessage.status = LoadEnum.NORMAL;
                    } else {
                        this.initUI(viewBase, res[0], parentNode) && callback && callback();
                    }
                });
                break;
        }
    }


    private initUI(viewBase: typeof ViewBase, prefab: cc.Prefab, parentNode: cc.Node = cc.director.getScene()) {
        let UIMessage = this.UIMap[viewBase.UIName];
        let UINode = cc.instantiate(prefab);
        if (UINode && parentNode && parentNode.isValid) {
            UINode.setParent(parentNode);
            UIMessage.status = LoadEnum.LOADED;
            let component = UINode.getComponent(viewBase);
            if (!component) {
                component = UINode.addComponent(<any>viewBase);
            }
            (!UINode.getComponent(Lifecycle)) && UINode.addComponent(Lifecycle).init(viewBase);
            UIMessage.component = component;
            this.log(viewBase.UIName, "loaded");
            return true;
        }
        CC_DEBUG && console.log("Error:创建UI时出错", UIMessage.name);
        UIMessage.status = LoadEnum.NORMAL;
        return false;
    }


    public destoryUI(UIName: string) {
        if (this.UIMap.hasOwnProperty(UIName)) {
            const UIMessage = this.UIMap[UIName];
            switch (UIMessage.status) {
                case LoadEnum.LOADING:
                    this.log(UIName, "loading cancel...");
                    UIMessage.canceled = true;
                    return true;
                case LoadEnum.LOADED:
                    UIMessage.component.isValid && UIMessage.component.node.destroy();
                    delete this.UIMap[UIName];
                    cc.sys.garbageCollect();
                    return true;
                default:
                    return true;
            }
        }
        return false;
    }


    public getUI(UIName): UIMessageI {
        if (this.UIMap.hasOwnProperty(UIName)) {
            const UIMessage = this.UIMap[UIName];
            if (UIMessage.status == LoadEnum.LOADED) {
                return UIMessage;
            }
        }
    }


    public closeUI(UIName: string) {
        if (this.UIMap.hasOwnProperty(UIName)) {
            const UIMessage = this.UIMap[UIName];
            if (UIMessage.status == LoadEnum.LOADED) {
                UIMessage.component.node.active = false;
                return true;
            }
        }
        return false;
    }


    public destoryAllUI() {
        for (const UIName in this.UIMap) {
            this.destoryUI(UIName);
        }
    }


    private log(UIName: string, status: string) {
        if (CC_DEBUG) {
            let seq = ++this._seq;
            let scene = cc.director.getScene();
            this._scene = scene ? scene : this._scene;
            console.log(`[${seq}][Scene：${this._scene.name}][UI：${UIName}] -> ${status}.`);
        }
    }


    get UIMap() {
        return this._UIMap;
    }

}

export enum LoadEnum {
    NORMAL,
    LOADING,
    LOADED
}

export interface UIMessageI {
    canceled: boolean, name: string, status: LoadEnum, component: ViewBase, scene?: cc.Scene
}
