import BroadcastReceiver from "./BroadcastReceiver";

/**
 * 单例：广播管理器
 */
export default class BroadcastDataManager {

    private static instance: BroadcastDataManager;

    private _broadcastReceivers: Array<BroadcastReceiver> = [];

    private constructor() { }


    /**
     * 获取广播管理器
     */
    static getInstance(): BroadcastDataManager {
        if (!BroadcastDataManager.instance) {
            BroadcastDataManager.instance = new BroadcastDataManager()
        }
        return this.instance
    }


    /**
     * 发送广播
     * @param action 需要响应广播的行为
     * @param data 广播传递的数据
     */
    public sendBroadcast(action: String, data: any) {
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