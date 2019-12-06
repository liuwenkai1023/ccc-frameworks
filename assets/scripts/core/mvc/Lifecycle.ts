import { ViewBase } from "./ViewBase";
import { UIManager } from "./UIManager";


export class Lifecycle extends cc.Component {

    private viewBase: typeof ViewBase;


    init(viewBase: typeof ViewBase) {
        this.viewBase = viewBase;
    }


    onDestroy() {
        App.SingletonFactory.getInstance(UIManager).destoryUI(this.viewBase.UIName);
        this.viewBase = null;
    }

}
