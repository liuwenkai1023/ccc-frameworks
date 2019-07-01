/**
 * 单例工厂
 */
export default class SingletonFactory {

    private static instanceList: Map<{ new() }, Object> = new Map<{ new() }, Object>();

    public static getInstance<T>(c: { new(): T }): T {
        if (!SingletonFactory.instanceList.has(c)) {
            let obj = new c();
            SingletonFactory.instanceList.set(c, obj);
            return obj;
        }
        return <T>SingletonFactory.instanceList.get(c);
    }
}