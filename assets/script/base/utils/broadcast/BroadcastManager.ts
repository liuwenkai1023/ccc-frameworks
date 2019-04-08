import BroadcastEvent from "./BroadcastEvent";
import BroadcastComponent from "./BroadcastComponent";

/**
 * 单例：广播管理器
 */
export default class BroadcastManager {

    private static _instance: BroadcastManager;

    private _broadcastEventMap: BroadcastEventMap = {};

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
     * 触发广播事件
     * @param eventName 需要响应的事件名
     * @param data 广播需要传递的数据
     */
    public emit(eventName: string, data?: any | void) {
        let events = this._broadcastEventMap[eventName];
        if (!events) return;
        for (const event of events) {
            if (event != null && event.eventName == eventName) {
                event.call(this,data);
            }
        }
    }


    /**
     * 注册广播事件
     * @param broadcastEvent 广播事件
     */
    public register(broadcastEvent: BroadcastEvent) {
        if (!this._broadcastEventMap[broadcastEvent.eventName]) {
            this._broadcastEventMap[broadcastEvent.eventName] = [];
        }
        this._broadcastEventMap[broadcastEvent.eventName].push(broadcastEvent);
    }


    /**
     * 移除广播事件
     * @param broadcastEvent 广播事件
     */
    public unregister(broadcastEvent: BroadcastEvent) {
        let events = this._broadcastEventMap[broadcastEvent.eventName];
        if (!events) return;
        events.splice(events.indexOf(broadcastEvent), 1);
    }
}

export interface BroadcastEventMap { [key: string]: Array<BroadcastEvent> };