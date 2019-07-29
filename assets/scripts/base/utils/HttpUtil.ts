export default class HttpUtil {

    // 请求标记,递增
    private static _seq: number = 1;

    // HTTP请求地址
    private static _host: string = "https://blog.liuwenkai.org";


    /**
     * GET
     */
    public static HttpGet(url: string, params: object, handler: Function, async: boolean = true, customData: object = null, extraHeaders: object = {}) {
        this.HttpRequest(url, "GET", params, handler, async, customData, extraHeaders);

    }


    /**
     * POST
     */
    public static HttpPost(url: string, params: object, handler: Function, async: boolean = true, customData: object = null, extraHeaders: object = {}) {
        this.HttpRequest(url, "POST", params, handler, async, customData, extraHeaders);
    }


    /**
     * 下载文件
     * @param url           下载地址
     * @param nameOrPath    文件名/文件保存路径
     * @param handler       下载完成回调 (error, result) => { }
     * @param overwrite     是否覆盖原文件
     */
    public static HttpDownload(url: string, nameOrPath: string, handler: Function, overwrite: boolean = false) {
        let fullName = nameOrPath;
        if (CC_JSB) {
            fullName = jsb.fileUtils.getWritablePath() + nameOrPath; // 文件保存路径
            if (jsb.fileUtils.isFileExist(fullName) && (!overwrite)) { // 是否需要重复下载
                handler && handler(fullName);
                return;
            }
        }
        let seq = this._seq++;
        let self = this;
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        if (CC_JSB) {
            xhr.responseType = 'arraybuffer';
        } else {
            xhr.responseType = 'blob';
        }
        xhr.onload = function (e) {
            if (this.status == 200) {
                (!CC_JSB) && self.saveFileInBrowser(this.response, nameOrPath);
                (CC_JSB) && self.saveFileInNative(this.response, nameOrPath, handler, overwrite);
                CC_DEBUG && console.log(`[S->C] [Download.${seq}] -> ${url}%c success`, `color:#19A316;`);
            } else {
                CC_DEBUG && console.log(`%c[S->C] [Download.${seq}] -> ${url} failed`, `color:#f00;`);
                handler && handler("error", null);
            }
        };
        xhr.send();
        CC_DEBUG && console.log(`[C->S] [Download.${seq}] -> ${url}`);
    }


    /**
     * 保存文件 In Native
     * @param arrayBuffer   文件流
     * @param relativePath  相对路径
     * @param handler       保存结果回调 (error, result) => { }
     * @param overwrite     是否覆盖
     */
    public static saveFileInNative(arrayBuffer: ArrayBuffer, relativePath: string, handler: Function, overwrite: boolean) {
        let fullPath = jsb.fileUtils.getWritablePath() + this.checkPath(relativePath);
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
     * 检查relativePath中包含路径，并确保路径中的文件夹存在
     * @param relativePath 相对路径
     */
    private static checkPath(relativePath: string) {
        let paths = relativePath.split("/");
        let dirPath = "";
        for (let i = 0; i < paths.length - 1; i++) {
            const str = paths[i];
            dirPath += str + "/";
            if (!jsb.fileUtils.isDirectoryExist(dirPath)) {
                jsb.fileUtils.createDirectory(dirPath);
            }
        }
        return relativePath;
    }


    /**
     * 保存文件 In Browser
     * @param blob      Blob对象
     * @param fileName  保存文件名
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
                    window.location = objectUrl;
                } else {
                    a.href = objectUrl;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                }
            } else {
                window.location = objectUrl;
            }
            URL.revokeObjectURL(objectUrl);
        }
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
    public static HttpRequest(url: string, mothed: string, params: object, handler: Function, async: boolean = true, customData: object = null, extraHeaders: object = {}) {
        let xhr = cc.loader.getXMLHttpRequest();
        if (!/^http:\/\//.test(url) && !/^https:\/\//.test(url)) {
            url = this._host + url;
        }
        if (mothed == "GET") {
            url = url + this._encode(params);
        }
        xhr.open(mothed, url, async);
        if (async) xhr.timeout = 5000;
        this._extraHeaders(xhr, extraHeaders);
        mothed == "GET" && xhr.send();
        mothed == "POST" && xhr.send(JSON.stringify(params));
        this.registerScriptHandler(this._seq++, xhr, handler, url, mothed, params, customData);
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
    private static registerScriptHandler(seq, xhr, handler, url, method, params, customData) {
        CC_DEBUG && console.log(`[C->S] [${method}.${seq}] -> ${url}`);
        // 失败和超时回调
        ['loadstart', 'abort', 'error', 'load', 'loadend', 'timeout'].forEach(function (eventname) {
            xhr["on" + eventname] = function () {
                if (eventname == "error" || eventname == "timeout") {
                    let response: HttpResponse = { seq: seq, code: xhr.status, mothed: method, status: eventname, result: xhr.responseText, customData: customData };
                    (!CC_JSB) && CC_DEBUG && console.log(`%c[S->C] [${method}.${seq}] -> ${url} ${eventname} ${xhr.status}`, `color:#f00;`);
                    (CC_JSB) && CC_DEBUG && console.log(`[S->C] [${method}.${seq}] -> ${url} ${eventname} ${xhr.status}`);
                    handler && handler(response);
                }
            };
        });
        // 请求完成回调
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304)) { // 成功
                    let response: HttpResponse = { seq: seq, code: xhr.status, mothed: method, status: "success", result: xhr.responseText, customData: customData };
                    (!CC_JSB) && CC_DEBUG && console.log(`[S->C] [${method}.${seq}] -> ${url}%c success ${xhr.status}\n%c${response.result}`, `color:#19A316;`, `color:#19A316;padding: 3px;border-radius:2px;border:1px solid #000a;`);
                    (CC_JSB) && CC_DEBUG && console.log(`[S->C] [${method}.${seq}] -> ${url} success ${xhr.status}\n${response.result}`);
                    handler && handler(response);
                } else { // 失败
                    let response: HttpResponse = { seq: seq, code: xhr.status, mothed: method, status: "failed", errMsg: xhr.responseText, customData: customData };
                    (!CC_JSB) && CC_DEBUG && console.log(`%c[S->C] [${method}.${seq}] -> ${url} failed ${xhr.status} ${response.errMsg}`, `color:#f00;`);
                    (CC_JSB) && CC_DEBUG && console.log(`[S->C] [${method}.${seq}] -> ${url} failed ${xhr.status} ${response.errMsg}`);
                    handler && handler(response);
                }

            }
        };
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