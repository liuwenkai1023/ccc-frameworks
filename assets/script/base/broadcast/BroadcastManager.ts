import BroadcastReceiver from "./BroadcastReceiver";

/**
 * 单例：广播管理器
 * 不建议直接使用此类,节点还请使用广播组件BroadcastComponent(避免忘记注销广播而引起异常)
 */
export default class BroadcastManager {

    private static instance: BroadcastManager;

    private _broadcastReceivers: Array<BroadcastReceiver> = [];

    private constructor() { }


    /**
     * 获取广播管理器
     */
    static getInstance(): BroadcastManager {
        if (!BroadcastManager.instance) {
            BroadcastManager.instance = new BroadcastManager()
        }
        return this.instance
    }


    /**
     * 发送广播
     * @param action 需要响应广播的行为
     * @param data 广播传递的数据
     */
    public sendBroadcast(action: String, data?: any | void) {
        // 平均每个console.log()会额外消耗1ms左右
        // console.info("[INFO]Sending the broadcast \"" + action + "\"");
        for (const receiver of this._broadcastReceivers) {
            if (receiver != null && receiver.action == action) {
                // console.info("[INFO]Received the broadcast \"" + action + "\". data =", data, ".")
                receiver.handler(data);
            }
        }
    }


    /**
     * 记录广播接收者
     * @param receiver 广播接收者
     */
    public addBroadcastReceiver(receiver: BroadcastReceiver) {
        this._broadcastReceivers.push(receiver);
    }


    /**
     * 移除广播接收者
     * @param receiver 广播接收者
     */
    public removeBroadcastReceiver(receiver: BroadcastReceiver) {
        this._broadcastReceivers[this._broadcastReceivers.indexOf(receiver)] = null;
    }
}