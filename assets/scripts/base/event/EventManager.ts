/**
 * 事件管理器
 */
export default class EventsManager {

    private static _instance: EventsManager;

    private _eventMap: EventMap = {};

    private constructor() { }


    /**
     * 获取事件管理器
     */
    static instance(): EventsManager {
        if (!EventsManager._instance) {
            EventsManager._instance = new EventsManager()
        }
        return this._instance
    }


    /**
     * 触发事件
     * @param eventName 需要响应的事件名
     * @param data 事件需要传递的数据
     * @param target 只触发target上的事件
     */
    emit(eventName: string, data?: any | void, target: Object = null) {
        let events = this._eventMap[eventName];
        if (!events) return;
        let removeEventList = [];
        for (const event of events) {
            if (event != null && event.eventName == eventName) {
                if (!target) { // 触发所有
                    event.data = data;
                    event.handler && event.handler(event, data);
                    event.once && removeEventList.push(event);
                }
                if (target && target == event.target) { // 触发指定target
                    event.data = data;
                    event.handler && event.handler();
                    event.once && removeEventList.push(event);
                }
            }
        }
        // 移除once
        for (const event of removeEventList) {
            let index = removeEventList.indexOf(event);
            events.splice(index, 1);
        }
    }


    /**
     * 注册事件
     * @param eventName 事件名
     * @param handler   事件回调
     * @param target    目标对象
     */
    on(eventName: string, handler: Function, target: Object = null) {
        return this.register(eventName, handler, false, target);
    }


    /**
    * 注册单次事件，回调后移除
    * @param eventName 事件名
    * @param handler   事件回调
    * @param target    目标对象
    */
    once(eventName: string, handler: Function, target: Object = null) {
        return this.register(eventName, handler, true, target);
    }


    /**
     *  移除事件
     * @param eventName 事件名或者事件对象。1> 当传入事件对象时只移除对应事件 2> 当传入事件名时移除所有同名的事件
     * @param target 当有target参数传入时，只移除对应target上的事件
     */
    off(eventName: string | EventObject, target: Object = null) {
        this.unregister(eventName, target);
    }


    // /**
    //  * 注册事件
    //  * @param eventName 事件名
    //  * @param handler   事件回调
    //  * @param once      是否为单次事件
    //  * @param target    目标对象
    //  */
    private register(eventName: string, handler: Function, once: boolean = false, target: Object = null): EventObject {
        let event = { eventName: eventName, handler: handler, once: once, target: target };
        if (!this._eventMap[event.eventName]) {
            this._eventMap[event.eventName] = [];
        }
        this._eventMap[event.eventName].push(event);
        return event;
    }


    // /**
    //  *  移除事件
    //  * @param eventName 事件名或者事件对象。1> 当传入事件对象时只移除对应事件 2> 当传入事件名时移除所有同名的事件
    //  * @param target 当有target参数传入时，只移除对应target上的事件
    //  */
    private unregister(eventName: string | EventObject, target: Object = null) {
        let events = [];
        // 没有传入[事件名/事件对象]
        if (eventName == null) {
            target && this._unregisterByTarget(target);// 只传入[target],移除target上的所有事件
            return;
        }

        // 传入[事件名/事件对象]
        if (typeof eventName === 'string') {
            events = this._eventMap[eventName];
        } else {
            events = [eventName];
        }

        // 从事件列表里移除
        for (const event of events) {
            target && event.target == target && events.splice(events.indexOf(event), 1); // 移除在target上的事件
            (!target) && events.splice(events.indexOf(event), 1); // 移除
        }
    }


    // private _hasEvent(eventName: string, target: Object) {

    // }


    private _unregisterByTarget(target: Object) {
        for (const key in this._eventMap) {
            if (this._eventMap.hasOwnProperty(key)) {
                const events = this._eventMap[key];
                for (const event of events) {
                    event.target == target && events.splice(events.indexOf(event), 1);
                }
            }
        }
    }

}

export interface EventMap { [key: string]: Array<EventObject> };
export interface EventObject { eventName: string, handler: Function, once: boolean, target: Object, data?: Object };