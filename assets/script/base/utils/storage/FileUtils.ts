/**
 * FileUtils文件管理工具类
 */
export default class FileUtils {

    private static _instance: FileUtils;
    private static _writeablePath: string;


    private constructor() {
        FileUtils._writeablePath = FileUtils.writeablePath;
    }


    get writeablePath() {
        return FileUtils.writeablePath;
    }


    static get writeablePath() {
        if (!this._writeablePath && cc.sys.isNative) {
            this._writeablePath = jsb.fileUtils.getWritablePath();
        }
        return this._writeablePath;
    }


    /**
     * 得到instance单例
     */
    public static instance() {
        if (!cc.sys.isNative) { console.warn('当前非原生平台，FileUtils相关方法将不可用'); }
        if (!this._instance) {
            this._instance = new FileUtils();
        }
        return this._instance;
    }


    /**
     * 异步将数据保存到文件(自动判断)
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
    public saveString2File(str: string, savePath: string) {
        if (!str) { console.warn('saveString2File:保存的数据为空，将不会进行保存', savePath); return }
        if (cc.sys.isNative) {
            this.createDirectory(savePath);
            return jsb.fileUtils.writeStringToFile(str, savePath);
        }
    }


    /**
     * 创建文件
     * @param savePath 文件路径
     */
    public createFile(savePath) {
        if (cc.sys.isNative) {
            this.createDirectory(savePath);
            return jsb.fileUtils.writeStringToFile(' ', savePath);
        }
    }


    /**
     * 根据路径创建一个文件夹（存在则不重新创建）
     * 创建时需要带上'/'，例如：createDirectory('resources/data/')
     * 最后一个'/'后的字符将会被忽略，例如：createDirectory('resources/data/xxxx') 和 createDirectory('resources/data/') 等价
     * @param savePath 文件保存路径
     */
    public createDirectory(savePath: string) {
        if (cc.sys.isNative) {
            let relativePath = savePath.substring(FileUtils.writeablePath.length, savePath.length);
            let result = relativePath.split("/");
            let path = FileUtils.writeablePath;
            let length = result.length;
            // // 根据最后一个参数是否带文件后缀来判断（已舍弃）
            // let fileExtension = jsb.fileUtils.getFileExtension(relativePath);
            // console.log("文件后缀 = " + jsb.fileUtils.getFileExtension(relativePath));
            // if (!(fileExtension == null || fileExtension == undefined || fileExtension.length == 0)) {
            // length--;
            // }
            // for (let i = 0; i < length; i++) {
            for (let i = 0; i < length - 1; i++) {
                const dir = result[i];
                path += dir + "/";
                if (!jsb.fileUtils.isDirectoryExist(path)) {
                    jsb.fileUtils.createDirectory(path);
                }
            }
        }
    }


    /**
     * 保存数据流到文件
     * @param data 需要保存的数据
     * @param savePath 保存路径
     */
    public saveData2File(data: ArrayBufferLike, savePath: string) {
        if (!data) { console.warn('saveData2File:保存的数据为空，将不会进行保存', savePath); return }
        if (cc.sys.isNative) {
            this.createDirectory(savePath);
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


    /**
     * 移除文件
     * @param filePath 文件路径
     */
    public removeFile(filePath: string) {
        if (cc.sys.isNative) {
            return jsb.fileUtils.removeFile(filePath);
        }
    }


    /**
     * 移除文件夹
     * @param dirPath 文件夹路径
     */
    public removeDirectory(dirPath: string, force: boolean) {
        if (cc.sys.isNative) {
            console.log("removeDirectory：" + dirPath);
            return jsb.fileUtils.removeDirectory(dirPath);
        }
    }


    /**
     * 
     * @param filePath 文件路径
     */
    public isFileExist(filePath: string) {
        if (cc.sys.isNative) {
            return jsb.fileUtils.isFileExist(filePath);
        }
    }


    /**
     * 规范化路径
     * @param path 原始路径
     */
    public normalizePath(path: string) {
        if (cc.sys.isNative) {
            return jsb.fileUtils.normalizePath(path);
        }
    }


    /**
     * 文件列表
     * @param path 路径
     */
    public listFiles(path: string) {
        if (cc.sys.isNative) {
            return jsb.fileUtils.listFiles(path);
        }
    }


    /**
     * 文件大小
     * @param filePath 文件路径 
     */
    public getFileSize(filePath: string) {
        if (cc.sys.isNative) {
            return jsb.fileUtils.getFileSize(filePath);
        }
    }


    /**
     * 重命名文件（全路径）
     * @param oldFullPath 旧文件名(全路径) 三个参数时当path
     * @param newFullPath 新文件名(全路径) 三个参数时当oldName
     * @param name 新文件名 三个参数时当newName
     */
    public renameFile(oldFullPath: string, newFullPath: string, name?: string | void) {
        if (cc.sys.isNative) {
            if (name) {
                let path = oldFullPath;
                let oldName = newFullPath;
                return jsb.fileUtils.renameFile(path + oldName, path + name);
            } else {
                return jsb.fileUtils.renameFile(oldFullPath, newFullPath);
            }
        }
    }

}