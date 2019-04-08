const { ccclass, disallowMultiple, property } = cc._decorator;
import BroadcastManager from "./BroadcastManager";
import BroadcastEvent from "./BroadcastEvent";

/**
 * 广播组件
 */
// @ccclass
@disallowMultiple
export default class BroadcastComponent extends cc.Component {

    private _broadcastEvents: Array<BroadcastEvent> = [];
    private _broadcastManager: BroadcastManager;

    public onLoad() {
        this._broadcastManager = BroadcastManager.instance();
    }

    /**
     * 注册广播事件
     * @param eventName     广播事件名称
     * @param eventCallback 广播事件的回调
     * @param once          广播事件是否只执行1次
     */
    public on(eventName: string, eventCallback: Function, once: boolean = false) {
        let event = new BroadcastEvent(eventName, eventCallback, once);
        return this.register(event);
    }


    /**
     * 注册广播事件
     * @param broadcastEvent 广播事件
     */
    public register(broadcastEvent: BroadcastEvent) {
        if (this.checkRepeat(broadcastEvent)) throw "同一广播组件上不能注册相同的广播事件";
        this._broadcastEvents.push(broadcastEvent);
        this._broadcastManager.register(broadcastEvent);
        return broadcastEvent;
    }


    /**
     * 检查事件是否重复注册行为
     * @param broadcastEvent 广播事件名称
     */
    private checkRepeat(broadcastEvent: BroadcastEvent) {
        for (const _broadcastEvent of this._broadcastEvents) {
            if (broadcastEvent != null && _broadcastEvent != null && broadcastEvent.eventName == _broadcastEvent.eventName) {
                return true;
            }
        }
        return false;
    }


    /**
     * 得到广播事件
     * @param eventName 广播事件名称
     */
    public getEventByName(eventName: string): BroadcastEvent {
        for (const broadcastEvent of this._broadcastEvents) {
            if (broadcastEvent != null && broadcastEvent.eventName == eventName) {
                return broadcastEvent;
            }
        }
        return null;
    }


    /**
    * 触发广播事件
    * @param eventName 广播事件名称
    * @param data 触发事件传递的数据
    */
    public emit(eventName: string, data: any) {
        this._broadcastManager.emit(eventName, data);
    }


    /**
     * 移除广播事件
     * @param broadcastEvent 广播事件
     */
    public unregister(broadcastEvent: BroadcastEvent | string) {
        if (typeof broadcastEvent === 'string') {
            broadcastEvent = this.getEventByName(broadcastEvent);
        }
        if (broadcastEvent != null) {
            delete this._broadcastEvents[this._broadcastEvents.indexOf(broadcastEvent)];
            this._broadcastManager.unregister(broadcastEvent);
        }
    }


    /**
     * 移除当前组件所有广播事件
     */
    public unregisterAll() {
        for (const broadcastEvent of this._broadcastEvents) {
            broadcastEvent && this.unregister(broadcastEvent);
        }
    }


    onDestroy() {
        this.unregisterAll();
        this._broadcastEvents = null;
        this._broadcastManager = null;
    }

}
