import BASE from "./BASE";
import BroadcastComponent from "./utils/BroadcastComponent";

/**
 * BaseComponent组件
 * 用户新建的组件脚本建立继承本组件
 * 组件内默认添加广播处理
 */
export default abstract class BaseComponent extends cc.Component {

    private __broadcastManager: BroadcastComponent;

    /**
     * 广播接收者配置
     */
    protected __receiversData: Array<Array<string>>;

    /**
     * 得到广播管理器
     */
    get broadcastManager() {
        if (!this.__broadcastManager)
            this.__broadcastManager = this.node.addComponent(BroadcastComponent);
        return this.__broadcastManager;
    }

    /**
     * 脚本加载时回调
     * 配置了__receiversData时，请先调用super.onLoad();
     */
    protected onLoad() {
        this.__initReceiver();
    }

    /**
     * 初始化广播接收者
     */
    private __initReceiver() {
        let receiverDatas = this.__receiversData ? this.__receiversData : [];
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