const { ccclass, disallowMultiple, property } = cc._decorator;
import BroadcastReceiver, { BroadcastReceiverHandler } from "./BroadcastReceiver";
import BroadcastManager from "./BroadcastManager";

/**
 * 广播组件
 * 节点上建议使用此组件，广播会在生命周期结束时自动销毁
 */
// @ccclass
@disallowMultiple
export default class BroadcastComponent extends cc.Component {

    private _broadcastReceivers: Array<BroadcastReceiver> = [];
    private _broadcastManager: BroadcastManager;

    /**
     * 实例化并注册广播接收者
     * @param action 广播行为名称
     * @param handler 行为对应的回调
     */
    public newAndRegisterReceiver(action: string, handler: BroadcastReceiverHandler) {
        let receiver = new BroadcastReceiver(action, handler);
        return this.registerReceiver(receiver);
    }


    /**
     * 注册广播接收者
     * @param receiver 广播接收者
     */
    public registerReceiver(receiver: BroadcastReceiver) {
        if (this.checkIsRepeat(receiver)) throw "同一广播组件上不能注册相同的广播行为";
        this._broadcastReceivers.push(receiver);
        this._broadcastManager.addBroadcastReceiver(receiver);
        return receiver;
    }


    /**
     * 检查是否重复注册行为
     * @param receiver 广播行为名称
     */
    private checkIsRepeat(receiver: BroadcastReceiver) {
        for (const mReceiver of this._broadcastReceivers) {
            if (receiver != null && mReceiver != null && receiver.action == mReceiver.action) {
                return true;
            }
        }
        return false;
    }


    /**
     * 移除广播接收者
     * @param receiver 广播接收者
     */
    public removeBroadcastReceiver(receiver: BroadcastReceiver | string) {
        if (typeof receiver === 'string') {
            receiver = this.getBroadcastReceiver(receiver);
        }
        if (receiver != null) {
            this._broadcastReceivers[this._broadcastReceivers.indexOf(receiver)] = null;
            this._broadcastManager.removeBroadcastReceiver(receiver);
        }
    }


    /**
     * 得到对应广播接收者
     * @param action 广播行为名称
     */
    public getBroadcastReceiver(action: string): BroadcastReceiver {
        for (const receiver of this._broadcastReceivers) {
            if (receiver != null && receiver.action == action) {
                return receiver;
            }
        }
        return null;
    }


    /**
     * 发送广播
     * @param action 需要响应广播的行为
     * @param data 广播传递的数据
     */
    public sendBroadcast(action: string, data: any) {
        this._broadcastManager.sendBroadcast(action, data);
    }


    //加载时初始化
    public onLoad() {
        this._broadcastManager = BroadcastManager.instance();
    }


    //销毁时注销所以广播接收者
    public onDestroy() {
        this.removeAllBroadcastReceiver();
        this._broadcastManager = null;
        this._broadcastReceivers = null;
    }


    /**
     * 移除当前组件所有广播接收
     */
    public removeAllBroadcastReceiver() {
        for (const receiver of this._broadcastReceivers) {
            if (receiver != null) {
                this.removeBroadcastReceiver(receiver);
            }
        }
    }
}
