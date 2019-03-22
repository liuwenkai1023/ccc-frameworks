import BroadcastReceiver from "./BroadcastReceiver";
import BroadcastComponent from "./BroadcastComponent";

/**
 * 单例：广播管理器
 * 不建议直接使用此类,节点还请使用广播组件BroadcastComponent(避免忘记注销广播而引起异常)
 */
export default class BroadcastManager {

    private static _instance: BroadcastManager;

    private _broadcastReceiverMap: BroadcastReceiverMap = {};

    private constructor() { }


    /**
     * 获取广播管理器
     */
    static instance(): BroadcastManager {
        if (!BroadcastManager._instance) {
            BroadcastManager._instance = new BroadcastManager()
        }
        return this._instance
    }


    /**
     * 发送广播
     * @param action 需要响应广播的行为
     * @param data 广播传递的数据
     */
    public sendBroadcast(action: string, data?: any | void) {
        let receivers = this._broadcastReceiverMap[action];
        if (!receivers) return;
        for (const receiver of receivers) {
            if (receiver != null && receiver.action == action) {
                if (receiver.handler) receiver.handler(data);
            }
        }
    }


    /**
     * 记录广播接收者
     * @param receiver 广播接收者
     */
    public addBroadcastReceiver(receiver: BroadcastReceiver) {
        if (!this._broadcastReceiverMap[receiver.action]) {
            this._broadcastReceiverMap[receiver.action] = [];
        }
        this._broadcastReceiverMap[receiver.action].push(receiver);
    }


    /**
     * 移除广播接收者
     * @param receiver 广播接收者
     */
    public removeBroadcastReceiver(receiver: BroadcastReceiver) {
        let receivers = this._broadcastReceiverMap[receiver.action];
        if (!receivers) return;
        receivers.splice(receivers.indexOf(receiver), 1);
    }
}

export interface BroadcastReceiverMap { [key: string]: Array<BroadcastReceiver> };