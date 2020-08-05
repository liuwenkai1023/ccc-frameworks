import { CallbackHandle } from "./SdkAdapterBase";

export class CallbackManager {
    private _nextCallbackId = 100001;
    private _callbackMap: { [key: number]: CallbackHandle } = {};
    private _tempCalbackMap: { [key: number]: CallbackHandle } = {};

    // private static _instance: CallbackManager = null;
    // private constructor() { }
    // public static getInstance(): CallbackManager {
    //     if (this._instance == null) {
    //         this._instance = new CallbackManager()
    //     }
    //     return this._instance;
    // }

    public clearAll() {
        this._callbackMap = {};
        this._tempCalbackMap = {};
    }

    public doCallbackFunc(callbackId: number, result: { errCode: number, data?: any, msg?: string }) {
        if (callbackId == 0) {
            return;
        }
        const tempFunc = this._tempCalbackMap[callbackId];
        if (tempFunc != null) {
            this._tempCalbackMap[callbackId] = null;
            tempFunc(result);
            return;
        }
        let pCallback = this._callbackMap[callbackId];
        if (pCallback != null) {
            pCallback(result);
            return;
        }
    }

    public perm(callback: CallbackHandle): number {
        let callbackId = this._nextCallbackId += 1;
        this._callbackMap[callbackId] = callback;
        return callbackId;
    }

    public temp(callback: CallbackHandle): number {
        let callbackId = this._nextCallbackId += 1;
        this._tempCalbackMap[callbackId] = callback;
        return callbackId;
    }

    public removePerm(callbackId: number) {
        if (this._callbackMap[callbackId]) {
            this._callbackMap[callbackId] = null;
        }
    }
};