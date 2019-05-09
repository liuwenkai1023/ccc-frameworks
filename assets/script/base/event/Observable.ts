import { Observer } from "./Observer";

export class Observable {

    private _data: any;
    private _name: string;
    private _observerList: Array<Observer>;
    private _disableObserverList: Array<Observer>;

    constructor(name: string) {
        this._name = name;
        this._observerList = [];
        this._disableObserverList = [];
    }

    addObserver(observer: Observer) {
        this._observerList.push(observer);
    }

    deleteObserver(observer: Observer) {
        let index = this._observerList.indexOf(observer);
        if (index >= 0) {
            observer.isValid && observer.destroy();
            this._observerList.splice(index, 1);
        } else {
            console.log("警告：当前Observable中未添加过对应Observer");
        }
    }

    notifyObserver(data?: any) {
        for (const observer of this._observerList) {
            observer.update(this, data);
            observer.isValid || this._disableObserverList.push(observer);
        }
        for (const observer of this._disableObserverList) {
            this.deleteObserver(observer);
        }
        this._disableObserverList = [];
    }

    get data() {
        return this._data;
    }

    get name() {
        return this._name;
    }

    get observerList() {
        return this._observerList;
    }

}