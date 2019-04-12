import EventTarget from "./utils/event/EventTarget";

/**
 * BaseComponent组件
 * 用户新建的组件脚本建立继承本组件
 */
export default abstract class BaseComponent extends cc.Component {

    private _eventTarget: EventTarget;

    public bindEvent(type: string, callback?: Function, once?: boolean) {
        return this.eventTarget.on(type, callback ? callback.bind(this) : (this[type] ? this[type].bind(this) : null), once);
    }

    public bindView(variableName: string, nodePath: string, component?: typeof cc.Component, referenceNode?: cc.Node) {
        let variable = this.findView(nodePath, referenceNode);
        if (variable && component) {
            variable = (<any>variable).getComponent(component);
        }
        this[variableName] = variable;
        return variable;
    }

    public findView(sPath: string, referenceNode: cc.Node = this.node) {
        return cc.find(sPath, referenceNode);
    }

    get eventTarget() {
        if (!this._eventTarget) {
            this._eventTarget = this.node.addComponent(EventTarget);
        }
        return this._eventTarget;
    }

}

export interface BroadcastEventData { eventName: string, eventCallback?: Function, once?: boolean };
export interface BindingData { variableName: string, nodePath: string, component?: typeof cc.Component };