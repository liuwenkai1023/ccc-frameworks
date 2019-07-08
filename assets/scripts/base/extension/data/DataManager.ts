export class DataManager {

    private _configList: Map<string, Map<string, object>>;

    constructor() { this.reset(); }


    /**
     * 清空配置表
     */
    public reset() {
        this._configList = new Map();
    }


    /**
     *  加载配置Json
     * @param configPath 配置存放路径
     * @param configName 配置文件名称
     * @param convertKey 是否使用ID作为key
     * @param handler    加载配置完成后回调
     */
    public loadJsonData(configPath: string, configName: string, convertKey: boolean = false, handler: Function = null): void {
        cc.loader.loadRes(configPath, (error, contents) => {
            if (error) return;
            let config: Map<string, object> = new Map();
            let types = <Array<Object>>contents.json["types"];
            let fields = <Array<Object>>contents.json["fields"];
            let valuesList = <Array<Object>>contents.json["values"];
            for (let idx in valuesList) {
                let values = valuesList[idx];
                let object = {};
                for (let i = 0; i < types.length; ++i) {
                    let field = <string>fields[i];
                    let type = <string>types[i];
                    switch (type) {
                        case "I":
                            object[field] = Number(values[i]);
                            break;
                        case "B":
                            object[field] = Number(values[i]) == 1;
                            break;
                        case "S":
                            object[field] = values[i] + "";
                            break;
                    }
                }
                if (convertKey == true) {
                    let key = object["ID"];
                    config.set(key, object);
                } else {
                    config.set(idx, object);
                }
            }
            this._configList[configName] = config;
            handler && handler();
        });
    }


    /**
     * 获取配置
     * @param configName 配置名
     */
    public getDataByName(configName: string): Object {
        return this._configList.get(configName);
    }


    /**
     * 获取配置对应参数
     * @param configName 配置名
     * @param id         参数ID
     */
    public getDataByNameAndId(configName: string, id: string) {
        let config = this._configList.get(configName);
        if (config) {
            return config.get(id);
        }
    }


    /**
     * 移除配置
     * @param configName 配置名
     */
    public clearDataByName(configName: string): void {
        this._configList.delete(configName);
    }

}