import { Observable } from "./Observable";

export class Observer {
    private _name: string;
    private _once: boolean;
    private _isValid: boolean;
    private _callback: Function;

    constructor(name: string, callback: Function, once: boolean = false) {
        this._name = name;
        this._once = once;
        this._isValid = true;
        this._callback = callback;
    }

    update(observable: Observable, data?: any) {
        this._callback && this._callback({ observable: observable, data: data });
        this._once && this._isValid && this.destroy();
    }

    destroy() {
        this._name = null;
        this._once = null;
        this._isValid = false;
        this._callback = null;
    }

    get name() {
        return this._name;
    }

    get once() {
        return this._once;
    }

    get isValid() {
        return this._isValid;
    }

    get callback() {
        return this._callback;
    }
}