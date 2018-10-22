/**
 * 广播接收者回调接口
 */
export interface BroadcastReceiverHandler {
    (data: any);
};


/**
 * 广播接收者
 */
export default class BroadcastReceiver {
    private _action: string;
    private _handler: BroadcastReceiverHandler;


    /**
     * 构造方法
     * @param action 广播行为名称
     * @param handler 行为对应的回调
     */
    public constructor(action: string, handler: BroadcastReceiverHandler) {
        this._action = action;
        this._handler = handler;
    }


    /**
     * 得到广播行为名称
     */
    get action() {
        return this._action;
    }


    /**
     * 得到广播行为对应的回调
     */
    get handler() {
        return this._handler;
    }
}