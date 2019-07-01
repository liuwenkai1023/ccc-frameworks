declare class SingletonFactory {
    static getInstance<T>(c: { new(): T }): T;
}

declare class MyApps {
    SingletonFactory: typeof SingletonFactory;
}

declare var APP: MyApps;