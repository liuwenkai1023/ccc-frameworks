import ViewBase from "./ViewBase";
import { BindingData, ReceiverData } from "../BaseComponent";


export default abstract class ViewBaseEX extends ViewBase {

    protected __resourcePath = "_resourcePath"; // 路径配置

    protected pushReceiver(receiverData: ReceiverData) {
        this.__receiversData.push(receiverData);
    }

    protected pushBind(bindingData: BindingData) {
        this.__bindingsData.push(bindingData);
    }

    onLoad() {
        this.onInitData();
    }

    onShow(data?: any) { }
    onClose() { }

    abstract onInitData();
    abstract onLoaded();
    abstract start();
    // abstract onShow(data?: any);
    // abstract onClose();
    update(dt?: number) { };
    onDestroy() { };

}