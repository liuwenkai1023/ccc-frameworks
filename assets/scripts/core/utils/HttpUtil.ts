/**
 * HTTP工具类
 */
export class HttpUtil {

    // 请求标记,递增
    private static _seq: number = 1;

    // HTTP请求地址
    private static _host: string = "https://blog.liuwenkai.org";


    /**
     * GET
     */
    public static HttpGet(url: string, params: object, handler: Function, customData: object = null, extraHeaders: object = {}) {
        this.HttpRequest(url, "GET", params, handler, true, customData, extraHeaders);
    }


    /**
     * POST
     */
    public static HttpPost(url: string, params: object, handler: Function, customData: object = null, extraHeaders: object = {}) {
        this.HttpRequest(url, "POST", params, handler, true, customData, extraHeaders);
    }


    /**
     * 同步的POST请求
     */
    public static HttpPostSync(url: string, params: object, customData: object = null, extraHeaders: object = {}) {
        return this.HttpRequestSync(url, "GET", params, customData, extraHeaders);
    }


    /**
     * 同步的GET请求
     */
    public static HttpGetPSync(url: string, params: object, customData: object = null, extraHeaders: object = {}) {
        return this.HttpRequestSync(url, "GET", params, customData, extraHeaders);
    }


    /**
     * HttpRequestSync
     * @param url           地址
     * @param mothed        方法 POST/GET
     * @param params        参数
     * @param customData    自定义数据 
     * @param extraHeaders  临时headers
     */
    public static HttpRequestSync(url: string, method: string, params: object, customData: object = null, extraHeaders: object = {}): Promise<HttpResponse> {
        return new Promise((resolve, reject) => {
            try {
                this.HttpRequest(url, method, params, (response) => { resolve(response); }, true, customData, extraHeaders);
            } catch (error) {
                reject(error);
            }
        });
    }


    /**
     * HttpRequest
     * @param url           地址
     * @param mothed        方法 POST/GET
     * @param params        参数
     * @param handler       回调
     * @param async         是否异步请求
     * @param customData    自定义数据 
     * @param extraHeaders  临时headers
     */
    public static HttpRequest(url: string, mothed: string, params: object, handler: Function, async: boolean = false, customData: object = null, extraHeaders: object = {}) {
        let xhr = cc.loader.getXMLHttpRequest();
        if (!/^http:\/\//.test(url) && !/^https:\/\//.test(url)) {
            url = this._host + url;
        }
        if (mothed == "GET") {
            url = url + this._encode(params);
        }
        xhr.open(mothed, url, async);
        xhr.timeout = 5000;
        this._extraHeaders(xhr, extraHeaders);
        mothed == "GET" && xhr.send();
        mothed == "POST" && xhr.send(JSON.stringify(params));
        this._registerScriptHandler(this._seq++, xhr, handler, url, mothed, params, customData);
    }


    /**
     * 下载文件
     * @param url       文件地址
     * @param fileName  文件保存路径
     * @param handler   文件下载结果回调
     * @param overwrite 是否覆盖同名文件
     */
    public static HttpDownload(url: string, fileName: string, handler: Function, overwrite: boolean = false) {
        if (CC_JSB) {
            this.checkPathExist(fileName);
            const fullPath = jsb.fileUtils.getWritablePath() + fileName; // 文件保存路径
            if (jsb.fileUtils.isFileExist(fullPath) && (!overwrite)) { // 是否需要重复下载
                handler && handler(null, fullPath);
                return;
            }
        }
        const seq = this._seq++;
        const self = this;
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = CC_JSB ? 'arraybuffer' : 'blob';
        xhr.onload = () => {
            if (xhr.status == 200) {
                CC_JSB ? self.saveFileInNative(xhr.response, fileName, handler, overwrite) : self.saveFileInBrowser(xhr.response, fileName);
                cc.log(`[S->C] [Download.${seq}] -> ${url}%c success`, `color:#19A316;`);
            } else {
                cc.log(`%c[S->C] [Download.${seq}] -> ${url} failed`, `color:#f00;`);
                handler && handler("error", null);
            }
        };
        xhr.send();
        cc.log(`[C->S] [Download.${seq}] -> ${url}`);
    }


    /**
     * 检查文件路径是否存在，不存在则创建
     * @param path 相对于可写路径的路径
     * 例1：HttpUtil.checkPath("dir1/dir2/dir3/");
     * 例2：HttpUtil.checkPath("dir1/dir2/dir3/file");
     * 例1和例2等效
     */
    public static checkPathExist(path: string) {
        let paths = path.split("/");
        let dirPath = "";
        for (let i = 0; i < paths.length - 1; i++) {
            const str = paths[i];
            dirPath += str + "/";
            if (!jsb.fileUtils.isDirectoryExist(dirPath)) {
                jsb.fileUtils.createDirectory(dirPath);
            }
        }
        return path;
    }


    /**
     * 保存文件 In Native
     * @param arrayBuffer   文件流
     * @param relativePath  相对路径
     * @param handler       保存结果回调 (error, result) => { }
     * @param overwrite     是否覆盖
     */
    public static saveFileInNative(arrayBuffer: ArrayBuffer, relativePath: string, handler: Function, overwrite: boolean) {
        let fullPath = jsb.fileUtils.getWritablePath() + this.checkPathExist(relativePath);
        overwrite && jsb.fileUtils.isFileExist(fullPath) && jsb.fileUtils.removeFile(fullPath);
        let success = jsb.fileUtils.writeDataToFile(new Uint8Array(arrayBuffer), fullPath);
        if (success) {
            cc.log("save file data success!", fullPath);
            handler && handler(null, fullPath);
        }
        else {
            cc.log("save file data failed!", fullPath);
            handler && handler("error", null);
        }
    }


    /**
     * 下载文件 In Browser
     */
    public static saveFileInBrowser(blob: Blob, fileName: string) {
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(blob, fileName);
        } else {
            let URL = window.URL || window[`webkitURL`]
            let objectUrl = URL.createObjectURL(blob);
            if (fileName) {
                var a = document.createElement('a');
                if (typeof a.download === 'undefined') {
                    (window as any).location = objectUrl;
                } else {
                    a.href = objectUrl;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
            } else {
                (window as any).location = objectUrl;
            }
            URL.revokeObjectURL(objectUrl);
        }
    }


    /**
     * 注册网络请求事件回调
     * @param seq       请求sequence标记，递增
     * @param xhr       xhr实例
     * @param handler   请求回调
     * @param url       网络请求地址
     * @param method    请求类型 GET POST
     * @param params    请求参数
     */
    private static _registerScriptHandler(seq, xhr, handler, url, method, params, customData) {
        cc.log(`[C->S] [${method}.${seq}] -> ${url}`);
        // 失败和超时回调
        ['loadstart', 'abort', 'error', 'load', 'loadend', 'timeout'].forEach(function (eventname) {
            xhr["on" + eventname] = function () {
                if (eventname == "error" || eventname == "timeout") {
                    let response: HttpResponse = {
                        seq: seq,
                        code: xhr.status,
                        mothed: method,
                        status: eventname,
                        result: xhr.responseText,
                        customData: customData
                    };
                    CC_JSB ?
                        cc.log(`[S->C] [${method}.${seq}] -> ${url} ${eventname} ${xhr.status}`) :
                        cc.log(`%c[S->C] [${method}.${seq}] -> ${url} ${eventname} ${xhr.status}`, `color:#f00;`);
                    handler && handler(response);
                }
            };
        });
        // 请求完成回调
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                // 请求成功
                if (((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304)) {
                    let response: HttpResponse = {
                        seq: seq,
                        code: xhr.status,
                        mothed: method,
                        status: "success",
                        result: xhr.responseText,
                        customData: customData
                    };
                    CC_JSB ?
                        cc.log(`[S->C] [${method}.${seq}] -> ${url} success ${xhr.status}\n${response.result}`) :
                        cc.log(`[S->C] [${method}.${seq}] -> ${url}%c success ${xhr.status}\n%c${response.result}`, `color:#19A316;`, `color:#19A316;padding: 3px;border-radius:2px;border:1px solid #000a;`);
                    handler && handler(response);
                } else {
                    // 请求失败
                    let response: HttpResponse = {
                        seq: seq,
                        code: xhr.status,
                        mothed: method,
                        status: "failed",
                        errMsg: xhr.responseText,
                        customData: customData
                    };
                    CC_JSB ?
                        cc.log(`[S->C] [${method}.${seq}] -> ${url} failed ${xhr.status} ${response.errMsg}`) :
                        cc.log(`%c[S->C] [${method}.${seq}] -> ${url} failed ${xhr.status} ${response.errMsg}`, `color:#f00;`);
                    handler && handler(response);
                }
            }
        }
    }


    /**
     * 将参数转为字符串GET
     * @param params
     */
    private static _encode(params: object = {}): string {
        let str = "?";
        if (params != null && params != undefined) {
            for (const key in params) {
                if (params.hasOwnProperty(key)) {
                    str = str + key + "=" + params[key] + "&"
                }
            }
        }
        return str;
    }


    /**
     * 添加通用header
     * @param xhr           XMLHttpRequest
     * @param extraHeaders  自定义Headers
     */
    private static _extraHeaders(xhr: XMLHttpRequest, extraHeaders: object = {}) {
        // Default Headers
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        // xhr.setRequestHeader('Authorization', 'Bearer ' + "");
        // Extra Headers
        for (const key in extraHeaders) {
            if (extraHeaders.hasOwnProperty(key)) {
                const value = extraHeaders[key];
                xhr.setRequestHeader(key, value);
            }
        }
    }

}

export interface HttpResponse { seq: number, code: string, mothed: string, status: string, errMsg?: string, result?: string, customData?: object }