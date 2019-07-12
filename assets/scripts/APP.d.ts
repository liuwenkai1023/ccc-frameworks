
declare class SingletonFactory {
    static getInstance<T>(c: { new(): T }): T;
}

declare class MyApps {
    data: any;
    SingletonFactory: typeof SingletonFactory;
}

declare var App: MyApps;