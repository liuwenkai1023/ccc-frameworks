import BroadcastComponent from "../utils/BroadcastComponent";
import TimerManager from "../utils/timer/TimerManager";
import BASE from "../BASE";

export default abstract class ViewBase {

    private __bindMap: any;
    private __rootNode: cc.Node;
    private __timerManager: TimerManager;
    private __broadcastManager: BroadcastComponent;

    protected RESOURCE_FILENAME: string;
    protected RESOURCE_BINDING: Array<Array<any>>;
    protected RECEIVER_CONFIG: Array<Array<any>>;


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


    /**
     * 得到当前资源节点
     */
    get rootNode(): cc.Node {
        return this.__rootNode;
    }


    /**
     * 当前UIModel是否已经被加载
     */
    get isLoaded(): boolean {
        return this.__rootNode && this.__rootNode.isValid && this.__rootNode.getParent() != null;
    }


    /**
     * 得到绑定的资源节点和组件Map
     */
    get bindMap() {
        return this.__bindMap;
    }


    /**
     * 构造方法
     */
    constructor() {
        this._init();
    }


    /**
     * 初始化参数
     */
    private _init() {
        this.__broadcastManager = null;
        this.__timerManager = null;
        this.__rootNode = null;
        this.__bindMap = {};
    }


    /**
     * 初始化UI
     * @param handler 初始化回调
     */
    public onCreate(handler?: Function | void, parentNode?: cc.Node | void) {
        if (!this.RESOURCE_FILENAME) return;
        // 杜绝连续创建
        if (this.rootNode) { if (handler) handler(); return; }
        cc.loader.loadRes(this.RESOURCE_FILENAME, (error, prefab) => {
            if (error) return;
            // 杜绝连续创建
            if (this.rootNode) { if (handler) handler(); return; }
            let rootNode = <cc.Node>cc.instantiate(prefab);
            if (!rootNode) return;
            let parent = parentNode ? parentNode : cc.director.getScene();
            if (!parent) return;
            parent.addChild(rootNode);
            this.__rootNode = rootNode;
            this.createBinding();
            this.onLoad(rootNode);
            if (handler) handler();
        });
        return this;
    }


    /**
     * 绑定资源变量和广播组件
     */
    private createBinding() {
        let resourceBinding = this.RESOURCE_BINDING ? this.RESOURCE_BINDING : [];
        resourceBinding.forEach(bind => {
            let varName = bind[0];
            let nodePath = bind[1];
            let component = bind[2];
            if (varName && nodePath) {
                this.__bindMap[varName] = cc.find(nodePath, this.__rootNode);
                if (this.__bindMap[varName] && component) {
                    this.__bindMap[varName] = this.__bindMap[varName].getComponent(component);
                    this.__bindMap[varName];
                }
            }
        });
        this.bindComponent();
    }


    /**
     * 绑定广播接收者
     */
    private bindComponent(): any {
        this.__broadcastManager = this.__rootNode.addComponent(BroadcastComponent);
        this.__initReceiver();
    }


    /**
     * 展示界面UI
     */
    public show() {
        if (!this.rootNode.active) {
            this.rootNode.active = true;
            this.timerManager.resume();
        }
        this.onShow();
    }


    /**
     * 隐藏界面UI
     */
    public hide() {
        if (this.rootNode.active) {
            this.rootNode.active = false;
            this.timerManager.pause();
        }
        this.onHided();
    }


    /**
     * 销毁界面UI,但保留model
     */
    public destory() {
        this.onDestory();
        this.rootNode.active = false;
        this.timerManager.pause();
        this.timerManager.removeAllTimers();
        this.broadcastManager.removeAllBroadcastReceiver();
        this.rootNode.removeFromParent();
        this.rootNode.removeAllChildren();
        this._init();
    }


    /**
     * 初始化广播接收者
     */
    private __initReceiver() {
        let receiverDatas = this.RECEIVER_CONFIG ? this.RECEIVER_CONFIG : [];
        for (const receiverData of receiverDatas) {
            this.broadcastManager.newAndRegisterReceiver(
                receiverData[0],
                receiverData[1] ? receiverData[1] : (
                    this[receiverData[0].toString()] ? this[receiverData[0].toString()].bind(this) : null
                )
            );
        }
    }


    // 下面的抽象方法可以理解为生命周期回调

    /**
     * 资源加载完毕
     * @param view 资源视图cc.Node
     */
    protected abstract onLoad(view: cc.Node);

    /**
     * 展示UI时回调
     */
    protected abstract onShow();

    /**
     * 展示UI完成时回调
     * @param data 
     */
    public abstract onShowed(data?: any | void);

    /**
     * 隐藏UI时回调
     */
    protected abstract onHided();

    /**
     * 销毁时回调
     */
    protected abstract onDestory();
}