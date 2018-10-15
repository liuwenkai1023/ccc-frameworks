export default class FileUtils {

    private static _instance: FileUtils;

    private static _writeablePath: string;

    private constructor() {
        FileUtils._writeablePath = FileUtils.writeablePath;
    }

    static get writeablePath() {
        if (!this._writeablePath && cc.sys.isNative) {
            this._writeablePath = jsb.fileUtils.getWritablePath();
        }
        return this._writeablePath;
    }


    public static instance() {
        if (!cc.sys.isNative) { console.warn('当前非原生平台，FileUtils相关方法将不可用'); }
        if (!this._instance) {
            this._instance = new FileUtils();
        }
        return this._instance;
    }


    /**
     * 异步将数据保存到文件
     * @param data 需要保存的数据
     * @param savePath 保存路径
     */
    public async saveFile(data: any, savePath: string) {
        if (!data) { console.warn('saveFile:保存的数据为空，将不会进行保存', savePath); return }
        // 保存字符串
        if (typeof data === 'string') {
            return this.saveString2File(data, savePath);
        }
        // 保存数据流
        else if (data instanceof ArrayBuffer) {
            return this.saveData2File(data, savePath);
        }
        // 其它类型的Object->转换为JSON字符串存到本地
        else {
            return this.saveString2File(JSON.stringify(data), savePath);
        }
    }


    /**
     * 保存字符串到文件
     * @param str 需要保存的字符
     * @param savePath 保存路径
     */
    private saveString2File(str: string, savePath: string) {
        if (!str) { console.warn('saveString2File:保存的数据为空，将不会进行保存', savePath); return }
        if (cc.sys.isNative) {
            return jsb.fileUtils.writeStringToFile(str, savePath);
        }
    }


    /**
     * 保存数据流到文件
     * @param data 需要保存的数据
     * @param savePath 保存路径
     */
    private saveData2File(data: ArrayBufferLike, savePath: string) {
        if (!data) { console.warn('saveData2File:保存的数据为空，将不会进行保存', savePath); return }
        if (cc.sys.isNative) {
            return jsb.fileUtils.writeToFile(data, savePath);
        }
    }


    /**
     * 异步从文件中得到数据流
     * @param filePath 文件路径
     * 使用方式如下：
     * FileUtils.instance().getDataFromFile(FileUtils.instance().writeablePath + 'data.json').then(data => {
     *       console.log(data);
     *   }).catch(err=>{
     *       console.error(err);
     *   });
     */
    public async getDataFromFile(filePath: string) {
        if (cc.sys.isNative) {
            return jsb.fileUtils.getDataFromFile(filePath);
        }
    }


    /**
     * 异步从文件中得到字符串
     * @param filePath 文件路径
     * 使用方式如下：
     * FileUtils.instance().getStringFromFile(FileUtils.instance().writeablePath + 'data.json').then(data => {
     *       console.log(data);
     *   }).catch(err=>{
     *       console.error(err);
     *   });
     */
    public async getStringFromFile(filePath: string) {
        if (cc.sys.isNative) {
            return jsb.fileUtils.getStringFromFile(filePath);
        }
    }

}