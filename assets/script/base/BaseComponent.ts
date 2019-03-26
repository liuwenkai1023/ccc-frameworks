import BroadcastComponent from "./utils/broadcast/BroadcastComponent";

/**
 * BaseComponent组件
 * 用户新建的组件脚本建立继承本组件
 * 组件内默认添加广播处理
 */
export default abstract class BaseComponent extends cc.Component {

    private __broadcastManager: BroadcastComponent;
    private __bindMap: { [key: string]: cc.Node | typeof cc.Component };

    /**
     * 节点及组件绑定配置
     */
    protected _bindingsData: Array<BindingData>;

    /**
     * 广播接收者配置
     */
    protected _receiversData: Array<ReceiverData>;


    /**
     * 得到广播管理器
     */
    get broadcastManager() {
        if (!this.__broadcastManager)
            this.__broadcastManager = this.node.addComponent(BroadcastComponent);
        return this.__broadcastManager;
    }


    /**
     * 脚本加载时回调
     * 配置了__receiversData时，请先调用super.onLoad();
     */
    protected onLoad() {
        this.onInitData();
        this.__initBinding();
        this.__initReceiver();
        this.onLoaded();
    }



    /**
     * 初始化广播接收者
     */
    private __initReceiver() {
        let receiverDatas = this._receiversData ? this._receiversData : [];
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
    * 绑定资源
    */
    private __initBinding() {
        let resourceBinding = this._bindingsData ? this._bindingsData : [];
        this.__bindMap = this.__bindMap ? this.__bindMap : {};
        for (const bind of resourceBinding) {
            if (bind.name && bind.path) {
                this.__bindMap[bind.name] = this.findView(bind.path);
                if (this.__bindMap[bind.name] && bind.component) {
                    this.__bindMap[bind.name] = <typeof cc.Component>(<any>this.__bindMap[bind.name]).getComponent(bind.component);
                }
                this[bind.name] = this.__bindMap[bind.name];
            }
        }
    }


    /**
     * 寻找控件
     * @param sPath 相对路径
     * @param referenceNode 相对节点
     */
    public findView(sPath: string, referenceNode: cc.Node = this.node) {
        return cc.find(sPath, referenceNode);
    }

    protected onDestroy() {
        this._bindingsData = null;
        this._receiversData = null;
        this.__bindMap = null;
        this.__broadcastManager = null;
    }

    protected rPush(receiverData: ReceiverData) {
        this._receiversData = this._receiversData ? this._receiversData : [];
        this._receiversData.push(receiverData);
    }

    protected bPush(bindingData: BindingData) {
        this._bindingsData = this._bindingsData ? this._bindingsData : [];
        this._bindingsData.push(bindingData);
    }

    abstract onInitData();
    abstract onLoaded();
    abstract start();
    abstract update(dt?: number);
    abstract onDestory();
    // update(dt?: number) { };
    // onDestory() { };
}

export interface ReceiverData { name: string, handler?: Function };
export interface BindingData { name: string, path: string, component?: typeof cc.Component };