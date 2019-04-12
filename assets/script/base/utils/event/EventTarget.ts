const { disallowMultiple } = cc._decorator;
import EventManager, { EventListener } from "./EventManager";


@disallowMultiple
export default class EventTarget extends cc.Component {

    private _listeners: Array<EventListener> = [];
    private _eventManager: EventManager;

    public on(eventName: string, callback: Function, once: boolean = false) {
        let listener = new EventListener(eventName, callback, once);
        return this.register(listener);
    }

    public off(eventName?: string | EventListener) {
        if (typeof eventName === "string") {
            this.unregister(this.getListenerByName(eventName));
            return;
        }
        this.unregister(eventName);
    }

    public offAll() {
        this.unregisterAll();
    }

    public dispatch(eventName: string, data?: any) {
        this._eventManager.dispatch(eventName, data);
    }

    public getListenerByName(eventName: string): EventListener {
        for (const listener of this._listeners) {
            if (listener && listener.eventName == eventName) {
                return listener;
            }
        }
        return null;
    }

    private register(listener: EventListener) {
        if (this.hasListener(listener)) throw "当前组件已存在相同类型的监听";
        this._listeners.push(listener);
        this._eventManager.registerEventListener(listener);
        return listener;
    }

    private hasListener(listener: EventListener) {
        for (const _listener of this._listeners) {
            if (listener && _listener && listener.eventName == _listener.eventName) {
                return true;
            }
        }
        return false;
    }

    private unregister(listener: EventListener | string) {
        if (typeof listener === 'string') {
            listener = this.getListenerByName(listener);
        }
        if (listener != null) {
            delete this._listeners[this._listeners.indexOf(listener)];
            this._eventManager.unregisterEventListener(listener);
        }
    }

    private unregisterAll() {
        for (const broadcastEvent of this._listeners) {
            broadcastEvent && this.unregister(broadcastEvent);
        }
    }

    protected onLoad() {
        this._eventManager = EventManager.instance();
    }

    protected onDestroy() {
        this.unregisterAll();
        this._listeners = null;
        this._eventManager = null;
    }

}
