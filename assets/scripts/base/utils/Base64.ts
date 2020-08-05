/**
 * Base64字符串处理,支持中文
 */
export class Base64 {

    /**
     * 使用Base64对input进行编码
     * @param input string或者ArrayBuffer
     */
    public static encode(input: string): string {
        return this._utf8encode(input);
    }

    /**
     * 使用Base64对input进行解码
     * @param input 需要被解码的base64字符串
     * @param utf8 默认编码存在utf8字符进行解码，如果确认编码的字符里不存在utf8字符可以传false
     */
    public static decode(input: string, utf8: boolean = true): any {
        return this._utf8decode(input, utf8);
    }

    private static _utf8encode(input: string): string {
        try {
            return window.btoa(input);
        } catch (e) {
            return window.btoa(unescape(encodeURIComponent(input)));
        }
    }

    private static _utf8decode(input: string, utf8: boolean): string {
        if (utf8) {
            try {
                return decodeURIComponent(escape(window.atob(input)));
            } catch (e) {
                return window.atob(unescape(input));
            }
        }
        return window.atob(input);
    }

}