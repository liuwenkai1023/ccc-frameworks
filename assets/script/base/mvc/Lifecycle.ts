import BaseComponent from "../BaseComponent";
import ViewBase from "./ViewBase";

export default class Lifecycle extends BaseComponent {
   
    private __viewBase: ViewBase = null;

    set viewBase(viewBase) {
        this.__viewBase = viewBase;
    }

    get viewBase() {
        return this.__viewBase;
    }

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