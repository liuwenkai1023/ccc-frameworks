import { BaseView } from "../../base/extensions/fgui/BaseView";

export class TestFGUI extends BaseView {

    pkgName = "test";
    resName = "TestUI";

    showEnterAndLeaveAnim = false;

    onCreate(view: fgui.GComponent) {
    }

    onShown() {
        super.onShown();
    }

    onHide() {
        super.onHide();
    }

}