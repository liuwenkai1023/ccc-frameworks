import ViewBase from "./ViewBase";

export default class Lifecycle extends cc.Component {

    private __viewBase: ViewBase = null;

    set viewBase(viewBase) {
        this.__viewBase = viewBase;
    }

    get viewBase() {
        return this.__viewBase;
    }

    onDestroy() {
        this.viewBase && this.viewBase.preDestory();
        this.viewBase = null;
    }

    update(dt: number) {
        this.viewBase && this.viewBase.update(dt);
    }

    lateUpdate() {
        this.viewBase && this.viewBase.lateUpdate();
    }

}