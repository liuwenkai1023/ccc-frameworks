/**
 * Base64字符串处理,支持中文
 */
export class Base64 {

    /**
     * 使用Base64对input进行编码
     * @param input string或者ArrayBuffer
     */
    public static encode(input: string | ArrayBuffer): string {
        if (typeof input === "string") {
            return this.utf8encode(input);
        }
        return this.utf8encode(this.ab2str(input));
    }

    /**
     * 使用Base64对input进行解码
     * @param input 需要被解码的base64字符串
     * @param buffer 是否需要把结果解析成ArrayBuffer
     */
    public static decode(input: string, buffer: boolean = false): any {
        let result = this.utf8decode(input);
        if (!buffer) {
            return result;
        } else {
            return this.str2ab(result);
        }
    }

    /**
     * 将ArrayBuffer转换为string
     * @param input 需要被转换的ArrayBuffer
     */
    public static ab2str(input: ArrayBuffer): string {
        var binary = '';
        var bytes = new Uint16Array(input);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return unescape(binary);
    }

    /**
     * 将string转换为ArrayBuffer
     * @param input 需要被转换的string
     */
    public static str2ab(input: string): ArrayBuffer {
        input = escape(input);
        var buf = new ArrayBuffer(input.length * 2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = input.length; i < strLen; i++) {
            bufView[i] = input.charCodeAt(i);
        }
        return buf;
    }

    private static utf8encode(input: string): string {
        return window.btoa(unescape(encodeURIComponent(input)));
    }

    private static utf8decode(input: string): string {
        try {
            return decodeURIComponent(escape(window.atob(input)));
        } catch (e) {
            return unescape(input);
        }
    }

}