import BroadcastComponent from "./utils/broadcast/BroadcastComponent";

/**
 * BaseComponent组件
 * 用户新建的组件脚本建立继承本组件
 * 组件内默认添加广播处理
 */
export default abstract class BaseComponent extends cc.Component {

    private _broadcastManager: BroadcastComponent;

    protected _broadcastEventData: Array<BroadcastEventData>;


    /**
     * 得到广播管理器
     */
    get broadcastManager() {
        if (!this._broadcastManager) {
            this._broadcastManager = this.node.addComponent(BroadcastComponent);
        }

        return this._broadcastManager;
    }

    /**
     * 绑定广播接收者
     */
    public bindBroadEvent(eventName: string, eventCallback?: Function, once?: boolean) {
        this.broadcastManager.on(
            eventName,
            eventCallback ? eventCallback : (this[eventName] ? this[eventName].bind(this) : null),
            once
        );
    }

    public bindView(variableName: string, nodePath: string, component?: typeof cc.Component) {
        let variable = this.findView(nodePath);
        if (variable && component) {
            variable = (<any>variable).getComponent(component);
        }
        this[variableName] = variable;
        return variable;
    }

    /**
     * 寻找控件
     * @param sPath 相对路径
     * @param referenceNode 相对节点
     */
    public findView(sPath: string, referenceNode: cc.Node = this.node) {
        return cc.find(sPath, referenceNode);
    }


    abstract onLoad();
    abstract start();
    abstract update(dt?: number);
    abstract onDestroy();

}

export interface BroadcastEventData { eventName: string, eventCallback?: Function, once?: boolean };
export interface BindingData { variableName: string, nodePath: string, component?: typeof cc.Component };