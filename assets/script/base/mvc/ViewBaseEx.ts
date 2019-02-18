import ViewBase from "./ViewBase";
import { BindingData, ReceiverData } from "../BaseComponent";


export default abstract class ViewBaseEX extends ViewBase {

    protected __resourcePath = "_resourcePath"; // 路径配置

    protected pushReceiverData(receiverData: ReceiverData) {
        this.__receiversData.push(receiverData);
    }

    protected pushBindingData(bindingData: BindingData) {
        this.__bindingsData.push(bindingData);
    }

    protected onLoad() {
        CC_DEBUG && console.log(`【${this.__resourcePath}】 -> [onLoad]`);
    }

    protected onStart(view?: cc.Node) {
        CC_DEBUG && console.log(`【${this.__resourcePath}】 -> [onStart]`);
    }

    protected onShow(data?: any) {
        CC_DEBUG && console.log(`【${this.__resourcePath}】 -> [onShow]`);
    }

    protected onClose() {
        CC_DEBUG && console.log(`【${this.__resourcePath}】 -> [onClose]`);
    }

    protected onDestroy() {
        CC_DEBUG && console.log(`【${this.__resourcePath}】 -> [onDestroy]`);
    }

}