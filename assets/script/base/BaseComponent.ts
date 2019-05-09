import { ObservationComponent } from "./event/ObservationComponent";

/**
 * BaseComponent组件
 * 建议用户新建的组件脚本建立继承本组件
 */
export abstract class BaseComponent extends cc.Component {

    private _eventComponent: ObservationComponent;

    public bindEvent(type: string, callback?: Function, once: boolean = false) {
        return this.Event.on(type, callback ? callback.bind(this) : (this[type] ? this[type].bind(this) : null), once);
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

    get Event() {
        if (!this._eventComponent) {
            this._eventComponent = this.node.addComponent(ObservationComponent);
        }
        return this._eventComponent;
    }

}