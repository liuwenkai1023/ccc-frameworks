export default class HttpUtil {

    // 请求标记,递增
    private static _seq: number = 1;

    // HTTP请求地址
    private static _host: string = "https://www.baidu.com";


    /**
     * GET
     */
    public static HttpGet(url: string, params: object, handler: Function, customData: object = null, extraHeaders: object = {}) {
        this.HttpRequest(url, "GET", params, handler, customData, extraHeaders);

    }


    /**
     * POST
     */
    public static HttpPost(url: string, params: object, handler: Function, customData: object = null, extraHeaders: object = {}) {
        this.HttpRequest(url, "POST", params, handler, customData, extraHeaders);
    }


    /**
     * HttpRequest
     * @param url           地址
     * @param mothed        方法 POST/GET
     * @param params        参数
     * @param handler       回调
     * @param customData    自定义数据 
     * @param extraHeaders  临时headers
     */
    public static HttpRequest(url: string, mothed: string, params: object, handler: Function, customData: object = null, extraHeaders: object = {}) {
        var xhr = cc.loader.getXMLHttpRequest();
        if (!/^http:\/\//.test(url) && !/^https:\/\//.test(url)) {
            url = this._host + url;
        }
        if (mothed == "GET") {
            url = url + this._encode(params);
        }
        xhr.open(mothed, url);
        xhr.timeout = 5000;
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
                    let response: HttpResponse = { sequence: seq, mothed: method, status: eventname, result: xhr.responseText, customData: customData };
                    CC_DEBUG && console.log(`%c[S->C] [${method}.${seq}] -> ${url} ${eventname} ${xhr.status}`, `color:#f00;`);
                    handler && handler(response);
                }
            };
        });
        // 请求成功回调
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status >= 200) {
                let response: HttpResponse = { sequence: seq, mothed: method, status: "success", result: xhr.responseText, customData: customData };
                CC_DEBUG && console.log(`[S->C] [${method}.${seq}] -> ${url} %c success.\n%c${response.result}`, `color:#19A316;`, `color:#19A316;padding: 3px;border-radius:2px;border:1px solid #000a;`);
                handler && handler(response);
            }
        };
    }


    /**
     * 将参数转为字符串
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
     * @param xhr XMLHttpRequest
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

export interface HttpResponse { sequence: number, mothed: string, status: string, result: string, customData: object }