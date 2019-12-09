import { BaseComponent } from "../../core/BaseComponent";
import { UIManager } from "../../core/mvc/UIManager";
import { TestUI } from "../page/TestUI";

const { ccclass, property } = cc._decorator;

@ccclass
export class Main extends cc.Component {

  onLoad() {
    App.SingletonFactory.getInstance(UIManager).showUI(TestUI);
  }

}