import BroadcastReceiver from "./BroadcastReceiver";
import BroadcastComponent from "../components/BroadcastComponent";

/**
 * 单例：广播管理器
 * 不建议直接使用此类,节点还请使用广播组件BroadcastComponent(避免忘记注销广播而引起异常)
 */
export default class BroadcastManager {

    private static _instance: BroadcastManager;

    private _broadcastReceivers: Array<BroadcastReceiver> = [];

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
     * 为节点注册广播组件
     * @param target 节点
     */
    public registerBrocastComponent(target: cc.Node): BroadcastComponent {
        let component = target.getComponent(BroadcastComponent);
        if (!component) {
            component = target.addComponent(BroadcastComponent);
        }
        return component;
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
                if (receiver.handler) receiver.handler(data);
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