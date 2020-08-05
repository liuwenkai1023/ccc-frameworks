import { EventsManager } from "./event/EventManager";
import { SingletonFactory } from "./SingleFactory";

/**
 * BaseComponent组件
 * 建议用户新建的组件脚本建立继承本组件
 */
export abstract class BaseComponent extends cc.Component {

    private _eventsManager: EventsManager;


    /**
     * 注册事件
     * @param eventName 事件名
     * @param handler   事件回调
     * @param once      是否为单次消耗事件
     */
    public bindEvent(type: string, callback?: Function, once: boolean = false) {
        let handler = callback ? callback.bind(this) : (this[type] ? this[type].bind(this) : null);
        if (once) {
            return this.Event.once(type, handler, this);
        }
        return this.Event.on(type, handler, this);
    }


    /**
     * 绑定视图
     * @param variableName  变量名
     * @param nodePath      节点相对路径
     * @param component     绑定组件（component不为空将绑定为component）
     * @param referenceNode 相对节点（相对路径起点）
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
     * 按路径获取节点
     * @param sPath 相对路径
     * @param referenceNode 相对节点（相对路径起点）
     */
    public findView(sPath: string, referenceNode: cc.Node = this.node) {
        return cc.find(sPath, referenceNode);
    }


    /**
     * EventsManager
     */
    get Event() {
        if (!this._eventsManager) {
            this._eventsManager = SingletonFactory.getInstance(EventsManager);
            let onDestroy = this.onDestroy;
            this.onDestroy = () => {
                this.Event.offTarget(this);
                onDestroy && onDestroy();
            };
        }
        return this._eventsManager;
    }

}