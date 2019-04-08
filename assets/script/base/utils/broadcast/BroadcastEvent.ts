import BroadcastManager from "./BroadcastManager";

/**
 * 广播事件
 */
export default class BroadcastEvent {


    private _once: boolean = false;
    private _isValid: boolean = true;
    private _eventCallback: Function = null;
    private _eventName: string = null;


    /**
     * 构造广播事件
     * @param eventName     播行为名称
     * @param eventCallback 行为对应的回调
     * @param once          执行后失效
     */
    public constructor(eventName: string, eventCallback: Function, once: boolean = false) {
        this._once = once;
        this._eventName = eventName;
        this._eventCallback = eventCallback;
        this._isValid = true;
    }

    public async call(broadcastManager: BroadcastManager, data: any) {
        if (this.isValid) {
            this.eventCallback && this.eventCallback();
            if (this.once) {
                this.isValid = false;
                setTimeout(() => { broadcastManager.unregister(this) });
            }
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

    set isValid(isValid: boolean) {
        this._isValid = isValid;
    }

}