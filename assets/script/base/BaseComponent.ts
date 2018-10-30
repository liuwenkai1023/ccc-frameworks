import BASE from "./BASE";
import BroadcastComponent from "./utils/BroadcastComponent";

/**
 * BaseComponent组件
 * 用户新建的组件脚本建立继承本组件
 * 组件内默认添加广播处理
 */
export default class BaseComponent extends cc.Component {

    protected __broadcastManager: BroadcastComponent;
    protected __receiversConfig: any;

    get broadcastManager() {
        if (!this.__broadcastManager)
            this.__broadcastManager = this.node.addComponent(BroadcastComponent);
        return this.__broadcastManager;
    }


    protected onLoad() {
        this.__initReceiver();
    }


    private __initReceiver() {
        let receiverDatas = this.__receiversConfig ? this.__receiversConfig : [];
        for (const receiverData of receiverDatas) {
            this.broadcastManager.newAndRegisterReceiver(
                receiverData[0],
                receiverData[1] ? receiverData[1] : (
                    this[receiverData[0].toString()] ? this[receiverData[0].toString()].bind(this) : null
                )
            );
        }
    }

}