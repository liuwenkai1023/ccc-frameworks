import { Observer } from "./Observer";
import { Observable } from "./Observable";

export class ObservableManager {

    private _observableMap: Map = {};

    private static _instance: ObservableManager;

    private constructor() { }

    static instance(): ObservableManager {
        if (!ObservableManager._instance) {
            ObservableManager._instance = new ObservableManager();
        }
        return this._instance;
    }

    public notify(observable: string | Observable, data?: any) {
        if (typeof observable === "string") {
            observable = this.getObservable(observable);
        }
        observable && observable.notifyObserver(data);
    }

    public getObservable(name: string, force: boolean = false) {
        let observable = this._observableMap[name];
        if (force && !observable) {
            observable = this._observableMap[name] = new Observable(name);
        }
        return observable;
    }

    public addObserver(observer: Observer) {
        let observable = this.getObservable(observer.name, true);
        observable.addObserver(observer);
        return true;
    }

    public deleteObserver(observer: Observer) {
        let observable = this._observableMap[observer.name];
        if (observable) {
            observable.deleteObserver(observer);
            return true;
        }
        return false;
    }

}


export interface Map { [key: string]: Observable };