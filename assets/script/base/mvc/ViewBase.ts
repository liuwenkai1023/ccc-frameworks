import BASE from "../BASE";
import Lifecycle from "./Lifecycle";
import TimerManager from "../utils/timer/TimerManager";
import BroadcastComponent from "../utils/broadcast/BroadcastComponent";
import { BindingData, ReceiverData } from "../BaseComponent";
import LoaderKeeper from "../utils/loader/LoaderKeeper";


export default abstract class ViewBase {

    private __bindMap: { [key: string]: cc.Node | typeof cc.Component };
    private __targets: Array<cc.Node>;
    private __rootNode: cc.Node;
    private __bLoading: boolean;
    private __timerManager: TimerManager;
    private __broadcastManager: BroadcastComponent;

    protected __resourcePath: string;
    protected __bindingsData: Array<BindingData>;
    protected __receiversData: Array<ReceiverData>;

    constructor() {
        this.__init();
    }


    /**
     * 初始化参数
     */
    private __init() {
        this.__bindMap = {};
        this.__targets = [];
        this.__bindingsData = [];
        this.__receiversData = [];
        this.__rootNode = null;
        this.__broadcastManager = null;
    }


    /**
     * 初始化UI
     * @param handler 初始化回调
     */
    public onCreate(handler?: Function | void, parentNode?: cc.Node | void) {
        if (!this.__resourcePath || this.__bLoading) return;
        if (this.rootNode) {
            handler && handler();
            return;
        }
        this.__bLoading = true;
        this.onLoad();
        let subLoader = BASE.Loader.createSubLoader();
        subLoader.load(this.__resourcePath, cc.Prefab,
            res => {
                this.__bLoading = false;
                let prefab = res[0];
                let rootNode = <cc.Node>cc.instantiate(prefab);
                let parent = parentNode ? parentNode : cc.director.getScene();
                if (!rootNode) return;
                rootNode.addComponent(LoaderKeeper).loader = subLoader;
                parent.addChild(rootNode);
                this.__rootNode = rootNode;
                this.onCreateView(rootNode);
                handler && handler();
            },
            err => {
                this.__bLoading = false;
                console.error(err);
            }
        );
        return this;
    }


    /**
     * 绑定资源变量和广播组件
     */
    private __createBinding() {
        let resourceBinding = this.__bindingsData ? this.__bindingsData : [];
        for (const bind of resourceBinding) {
            if (bind.name && bind.path) {
                this.__bindMap[bind.name] = this.findView(bind.path);
                if (this.__bindMap[bind.name] && bind.component) {
                    this.__bindMap[bind.name] = <typeof cc.Component>(<any>this.__bindMap[bind.name]).getComponent(bind.component);
                }
                this[bind.name] = this.__bindMap[bind.name];
            }
        }
        this.__bindComponent();
    }


    /**
     * 绑定广播接收者
     */
    private __bindComponent(): any {
        this.__broadcastManager = this.__rootNode.addComponent(BroadcastComponent);
        this.__initReceiver();
    }


    /**
     * 初始化广播接收者
     */
    private __initReceiver() {
        let receiverDatas = this.__receiversData ? this.__receiversData : [];
        for (let receiverData of receiverDatas) {
            this.broadcastManager.newAndRegisterReceiver(
                receiverData.name,
                receiverData.handler ? receiverData.handler : (
                    this[receiverData.name] ? this[receiverData.name].bind(this) : null
                )
            );
        }
    }


    /**
     * 寻找控件
     * @param sPath 相对路径
     * @param referenceNode 相对节点
     */
    public findView(sPath: string, referenceNode: cc.Node = this.__rootNode) {
        let node = cc.find(sPath, referenceNode);
        return node;
    }


    /**
     * 展示界面UI
     */
    public show(data?: any) {
        if (!this.rootNode.active) {
            this.rootNode.active = true;
            this.resume();
        }
        this.onShow(data);
    }


    /**
     * 关闭界面UI
     */
    public close() {
        if (this.rootNode.active) {
            this.rootNode.active = false;
            this.pause();
        }
        this.onClose();
    }


    /**
     * 销毁界面UI,但保留model
     */
    public destory() {
        if (this.rootNode && this.rootNode.isValid) {
            this.rootNode.removeFromParent();
            this.rootNode.destroy();
        }
    }


    public preDestory() {
        this.timerManager && this.timerManager.removeAllTimers();
        this.onDestroy();
        this.__init();
    }


    /**
     * 获取当前UI上的所有节点
     */
    private __getTargets(target: cc.Node) {
        (this.__targets.indexOf(target) == -1) && this.__targets.push(target);
        for (const child of target.children) {
            this.__getTargets(child);
        }
        return this.__targets;
    }


    /**
     * 暂停当前UI所有Timer和Action运行
     */
    protected pause() {
        this.__getTargets(this.rootNode);
        this.timerManager.pause();
        cc.director.getActionManager().pauseTargets(this.__targets);

    }


    /**
     * 恢复当前UI所有Timer和Action
     */
    protected resume() {
        this.timerManager.resume();
        cc.director.getActionManager().resumeTargets(this.__targets);
    }


    /**
     * 资源加载完毕
     * @param view 资源视图cc.Node
     */
    private onCreateView(view: cc.Node) {
        view.addComponent(Lifecycle).viewBase = this;
        this.__createBinding();
        this.onLoaded();
        this.callInNextTick(this.start.bind(this));
    }

    callInNextTick(callback: Function, timeout?: number, ...args: any[]) {
        setTimeout(callback && callback(), timeout, args);
    }

    // 生命周期回调
    abstract onLoad();
    abstract onLoaded();
    abstract start();
    abstract onShow(data?: any);
    abstract onClose();
    abstract onDestroy();
    update(dt?: number) { };
    lateUpdate() { };


    /**
     * 得到绑定的资源节点和组件Map
     */
    get bindMap() {
        return this.__bindMap;
    }

    /**
     * 得到Loader管理器
     */
    get loader() {
        if (!this.isLoaded) {
            return
        }
        return this.rootNode.getComponent(LoaderKeeper).loader;
    }

    /**
     * 得到当前资源节点
     */
    get rootNode(): cc.Node {
        return this.__rootNode;
    }

    /**
     * UI是否已经被加载
     */
    get isLoaded(): boolean {
        return this.__rootNode && this.__rootNode.isValid && this.__rootNode.getParent() != null;
    }

    /**
     * 得到计时器工具类
     */
    get timerManager() {
        if (!this.__timerManager) {
            this.__timerManager = BASE.TimerManager.new();
        }
        return this.__timerManager;
    }

    /**
     * 得到广播管理器
     */
    get broadcastManager(): BroadcastComponent {
        return this.__broadcastManager;
    }

}