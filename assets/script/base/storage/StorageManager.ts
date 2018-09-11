// TODO: 本地存储管理
export default class StorageManager {

    public setBool(key, value) {
        cc.sys.localStorage.setItem(key, value.toString())
    }

    public getBool(key) {
        return cc.sys.localStorage.getItem(key) == "false" ? false : true
    }

    public setInt(key, value) {
        cc.sys.localStorage.setItem(key, value.toString())
    }

    public getInt(key) {
        return Number(cc.sys.localStorage.getItem(key))
    }

    public setString(key, value) {
        cc.sys.localStorage.setItem(key, value)
    }

    public getString(key) {
        return cc.sys.localStorage.getItem(key)
    }

    public setObject(key, value) {
        cc.sys.localStorage.setItem(key, JSON.stringify(value))
    }

    public getObject(key) {
        return JSON.parse(cc.sys.localStorage.getItem(key))
    }

    public clear() {
        cc.sys.localStorage.clear();
    }
}
