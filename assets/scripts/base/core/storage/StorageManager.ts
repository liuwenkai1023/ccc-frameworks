/**
 * 本地存储管理
 */
export class LocalStorageManager {

    // private static _instance: LocalStorageManager;

    constructor() { };

    // public static getInstance() {
    //     if (!this._instance) {
    //         this._instance = new LocalStorageManager();
    //     }
    //     return this._instance;
    // }


    /**
     * 存储布尔值 
     */
    public setBool(key: string, value: boolean) {
        localStorage.setItem(key, value.toString());
    }


    /**
     * 获取布尔值 
     */
    public getBool(key: string): boolean {
        return localStorage.getItem(key) == "false" ? false : true;
    }


    /**
     * 存储Number 
     */
    public setNumber(key: string, value: number) {
        localStorage.setItem(key, value.toString());
    }


    /**
     * 获取Number 
     */
    public getNumber(key: string): number {
        return Number(localStorage.getItem(key));
    }


    /**
     * 存储字符串 
     */
    public setString(key: string, value: string) {
        localStorage.setItem(key, value);
    }


    /**
     * 获取字符串 
     */
    public getString(key: string): string {
        return localStorage.getItem(key);
    }


    /**
     * 存储Object 
     */
    public setObject(key: string, value: Object) {
        let jsonStr = null;
        try {
            jsonStr = JSON.stringify(value);
        } catch (error) {
            console.error(error);
            return;
        }
        localStorage.setItem(key, jsonStr);
    }


    /**
     * 获取Object 
     */
    public getObject(key: string): Object {
        let object = null;
        try {
            object = JSON.parse(localStorage.getItem(key));
        } catch (error) {
            console.error(error);
        }
        return object;
    }


    public clear() {
        localStorage.clear();
    }
}
