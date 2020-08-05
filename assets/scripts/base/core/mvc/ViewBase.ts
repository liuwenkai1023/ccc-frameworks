import { BaseComponent } from "../BaseComponent";

export class ViewBase extends BaseComponent {

    static zIndex = 1;

    static UIName = "UIComponent";

    static ResourcePath = "prefab/TestUI";


    protected onClickedBtnExit() {
        // App.Utils.UIManager.destoryUI(ViewBase.UIName);
    }

}