import { TestUI } from "../page/TestUI";
// import { UIManager } from "../../base/core/mvc/UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export class Main extends cc.Component {

  @property(cc.Node)
  uiNode: cc.Node = null;

  onLoad() {
    // App.SingletonFactory.getInstance(UIManager).showUI(TestUI);
    App.Utils.UIManager.showUI(TestUI, this.uiNode);
  }

}