import { Observer } from "./Observer";
import { Observable } from "./Observable";
import { ObservableManager } from "./ObservableManager";

const { disallowMultiple } = cc._decorator;

@disallowMultiple
export class ObservationComponent extends cc.Component {

    private _observerMap: ObserverMap;
    private _observableManager: ObservableManager;

    public on(name: string, callback: Function, once: boolean = false) {
        return this.register(new Observer(name, callback, once));
    }

    public off(name: string | Observer) {
        this.unregister(name);
    }

    public offAll() {
        this.unregisterAll();
    }

    public notify(name: string | Observable, data?: any) {
        this._observableManager.notify(name, data);
    }

    private register(observer: Observer) {
        if (this.hasObserver(observer)) {
            console.warn("警告：您已经在当前Event组件中添加过同名的Observer了");
            return;
        }
        this._observerMap[observer.name] = observer;
        this._observableManager.addObserver(observer);
        return observer;
    }

    private unregister(observer: string | Observer) {
        if (typeof observer === "string") {
            observer = this._observerMap[observer];
        }
        delete this._observerMap[observer.name];
        this._observableManager.deleteObserver(observer);
        // observer && observer.destroy();
    }

    private unregisterAll() {
        for (const observer in this._observerMap) {
            this.unregister(observer);
        }
    }

    private hasObserver(observer: string | Observer): boolean {
        if (!(typeof observer === "string")) {
            observer = observer.name;
        }
        return !!this._observerMap[observer];
    }

    onLoad() {
        this._observerMap = {};
        this._observableManager = ObservableManager.instance();
    }

    onDestroy() {
        this.unregisterAll();
        this._observerMap = null;
        this._observableManager = null;
    }

}

export interface ObserverMap { [key: string]: Observer };
