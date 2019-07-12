import { BaseComponent } from "../../BaseComponent";
import { DataManager } from "../../extension/data/DataManager";

const { ccclass, property, menu, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Label)
@menu("扩展组件/多语言/I18NLabel")
export default class I18NLabel extends BaseComponent {

    private label: cc.Label = null;

    private args = [];

    @property
    key: string = "";

    onLoad() {
        this.Event.on("LANGUAGE_CHANGED", this.updateLanguage.bind(this), this);
        this.label = this.getComponent(cc.Label);
        this.updateArgs();
    }

    updateLanguage() {
        this.updateArgs(this.args);
    }

    updateArgs(...args) {
        let str = App.SingletonFactory.getInstance(DataManager).getDataByNameAndId("GameString", this.key)[App.data.LANG] + "";
        if (this.args && this.args.length > 0) {
            this.args = args;
            str = cc.js.formatStr(str, ...args);
        }
        this.label.string = str;
        CC_DEBUG && str && str.length > 0 && console.log(`Load string:[${this.key}] => ${str}`);
    }

}