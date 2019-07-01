import { TestUI } from "../ui/TestUI";
import { UIManager } from "../../base/mvc/UIManager";
import { BaseComponent } from "../../base/BaseComponent";
import SingletonFactory from "../../base/utils/SingleFactory";

const { ccclass, property } = cc._decorator;

@ccclass
export class Main extends BaseComponent {

  onLoad() {
    SingletonFactory.getInstance(UIManager).showUI(TestUI);
  }

}