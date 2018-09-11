/**
 * 本地存储管理
 */
export default class LocalStorageManager {

    private static instance: LocalStorageManager;

    private constructor() { };

    public static getInstance() {
        if (!this.instance) {
            this.instance = new LocalStorageManager();
        }
        return this.instance;
    }


    /**
     * 存储布尔值 
     */
    public setBool(key: string, value: boolean) {
        cc.sys.localStorage.setItem(key, value.toString());
    }


    /**
     * 获取布尔值 
     */
    public getBool(key: string): boolean {
        return cc.sys.localStorage.getItem(key) == "false" ? false : true;
    }


    /**
     * 存储Number 
     */
    public setNumber(key: string, value: number) {
        cc.sys.localStorage.setItem(key, value.toString());
    }


    /**
     * 获取Number 
     */
    public getNumber(key: string): number {
        return Number(cc.sys.localStorage.getItem(key));
    }


    /**
     * 存储字符串 
     */
    public setString(key: string, value: string) {
        cc.sys.localStorage.setItem(key, value);
    }


    /**
     * 获取字符串 
     */
    public getString(key: string): string {
        return cc.sys.localStorage.getItem(key);
    }


    /**
     * 存储Object 
     */
    public setObject(key: string, value: Object) {
        cc.sys.localStorage.setItem(key, JSON.stringify(value));
    }


    /**
     * 获取Object 
     */
    public getObject(key: string): Object {
        return JSON.parse(cc.sys.localStorage.getItem(key));
    }


    public clear() {
        cc.sys.localStorage.clear();
    }
}
