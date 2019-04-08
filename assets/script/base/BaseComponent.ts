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


    /**
     * 绑定组件或节点到某个变量
     * @param variableName  变量名
     * @param nodePath      节点路径
     * @param component     绑定为??组件(可选)
     */
    public bindView(variableName: string, nodePath: string, component?: typeof cc.Component, referenceNode?: cc.Node) {
        let variable = this.findView(nodePath, referenceNode);
        if (variable && component) {
            variable = (<any>variable).getComponent(component);
        }
        this[variableName] = variable;
        return variable;
    }


    /**
     * 寻找控件
     * @param sPath         相对路径
     * @param referenceNode 相对于节点
     */
    public findView(sPath: string, referenceNode: cc.Node = this.node) {
        return cc.find(sPath, referenceNode);
    }

}

export interface BroadcastEventData { eventName: string, eventCallback?: Function, once?: boolean };
export interface BindingData { variableName: string, nodePath: string, component?: typeof cc.Component };