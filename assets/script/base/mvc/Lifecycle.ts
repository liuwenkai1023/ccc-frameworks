import BaseComponent from "../BaseComponent";
import ViewBase from "./ViewBase";

const { ccclass, property, requireComponent, disallowMultiple, executeInEditMode } = cc._decorator;

export default class Life extends BaseComponent {
    private __viewBase: ViewBase = null;
    set viewBase(viewBase) {
        this.__viewBase = viewBase;
    }
    get viewBase() {
        return this.__viewBase;
    }

    // onLoad() {
    //     this.viewBase.onLoad(this.node);
    // }

    // start() {
    //     this.viewBase.onStart();
    //     this.viewBase.show();
    // }

    // onEnable() {
    //     this.viewBase.onEnable();
    // }

    onDestroy() {
        this.viewBase.destory();
    }

    update(dt: number) {
        this.viewBase.update(dt);
    }

    lateUpdate() {
        this.viewBase.lateUpdate();
    }

}