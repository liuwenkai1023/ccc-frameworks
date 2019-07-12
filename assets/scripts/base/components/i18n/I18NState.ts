import { BaseComponent } from "../../BaseComponent";

const { ccclass, property, menu, requireComponent } = cc._decorator;

@ccclass
@requireComponent(cc.Label)
@menu("扩展组件/多语言/I18NState")
export default class I18NState extends BaseComponent {

    onLoad() {
        this.Event.on("LANGUAGE_CHANGED", this.start.bind(this), this);
    }

    start() {
        this.node.children.forEach((node, index) => {
            node.active = node.name == App.data.LANG;
        });
    }

}