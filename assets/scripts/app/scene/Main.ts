import { TestUI } from "../page/TestUI";
import { UIManager } from "../../core/mvc/UIManager";
import { BaseComponent } from "../../core/BaseComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export class Main extends BaseComponent {

  onLoad() {
    App.SingletonFactory.getInstance(UIManager).showUI(TestUI);
  }

}