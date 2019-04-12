
export default class EventManager {

    private static _instance: EventManager;

    private _listenerMap: Map = {};

    private constructor() { }

    static instance(): EventManager {
        if (!EventManager._instance) {
            EventManager._instance = new EventManager();
        }
        return this._instance;
    }

    public dispatch(eventName: string, data?: any) {
        let listeners = this._listenerMap[eventName];
        if (!listeners) return;
        for (const listener of listeners) {
            listener && listener.isValid && listener.call(this, data);
        }
    }

    public registerEventListener(listener: EventListener) {
        if (!this._listenerMap[listener.eventName]) {
            this._listenerMap[listener.eventName] = [];
        }
        this._listenerMap[listener.eventName].push(listener);
    }

    public unregisterEventListener(listener: EventListener) {
        let events = this._listenerMap[listener.eventName];
        if (!events) return;
        events.splice(events.indexOf(listener), 1);
    }

}

export class EventListener {

    private _eventName: string = null;
    private _once: boolean = false;
    private _isValid: boolean = true;
    private _eventCallback: Function = null;

    public constructor(eventName: string, callback: Function, once: boolean = false) {
        this._once = once;
        this._isValid = true;
        this._eventName = eventName;
        this._eventCallback = callback;
    }

    public async call(eventManager: EventManager, data: any) {
        this.eventCallback && this.eventCallback(data);
        if (this.once) {
            this._isValid = false;
            setTimeout(() => { eventManager.unregisterEventListener(this) });
        }
    }

    get once() {
        return this._once;
    }

    get eventName() {
        return this._eventName;
    }

    get eventCallback() {
        return this._eventCallback;
    }

    get isValid() {
        return this._isValid;
    }

}


export interface Map { [key: string]: Array<EventListener> };