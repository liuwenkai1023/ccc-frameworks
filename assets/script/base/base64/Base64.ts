/**
 * Base64字符串处理,支持中文
 */
export default class Base64 {
    private map: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    private static _instance: Base64;


    private constructor() { }


    public static instance() {
        if (!Base64._instance) {
            Base64._instance = new Base64();
        }
        return this._instance
    }


    /**
     * Base64 decode
     * @param s 需要解密的字符串
     */
    public decode(s): string {
        s += "";
        let len = s.length;

        if ((len === 0) || (len % 4 !== 0)) {
            return s;
        }

        let pads = 0;
        if (s.charAt(len - 1) === this.map[64]) {
            pads++;
            if (s.charAt(len - 2) === this.map[64]) {
                pads++;
            }
            len -= 4;
        }

        var i, b, map = this.map, x = [];
        for (i = 0; i < len; i += 4) {
            b = (map.indexOf(s.charAt(i)) << 18) | (map.indexOf(s.charAt(i + 1)) << 12) | (map.indexOf(s.charAt(i + 2)) << 6) | map.indexOf(s.charAt(i + 3));
            x.push(String.fromCharCode(b >> 16, (b >> 8) & 0xff, b & 0xff));
        }

        switch (pads) {
            case 1:
                b = (map.indexOf(s.charAt(i)) << 18) | (map.indexOf(s.charAt(i)) << 12) | (map.indexOf(s.charAt(i)) << 6);
                x.push(String.fromCharCode(b >> 16, (b >> 8) & 0xff));
                break;
            case 2:
                b = (map.indexOf(s.charAt(i)) << 18) | (map.indexOf(s.charAt(i)) << 12);
                x.push(String.fromCharCode(b >> 16));
                break;
        }

        return unescape(x.join(''));
    }

    /**
     * Base64 encode
     * @param s 需要加密的字符串
     */
    public encode(s): string {
        if (!s) {
            return;
        }

        s += '';
        if (s.length === 0) {
            return s;
        }
        s = escape(s);

        var i, b, x = [], map = this.map, padchar = map[64];
        var len = s.length - s.length % 3;

        for (i = 0; i < len; i += 3) {
            b = (s.charCodeAt(i) << 16) | (s.charCodeAt(i + 1) << 8) | s.charCodeAt(i + 2);
            x.push(map.charAt(b >> 18));
            x.push(map.charAt((b >> 12) & 0x3f));
            x.push(map.charAt((b >> 6) & 0x3f));
            x.push(map.charAt(b & 0x3f));
        }

        switch (s.length - len) {
            case 1:
                b = s.charCodeAt(i) << 16;
                x.push(map.charAt(b >> 18) + map.charAt((b >> 12) & 0x3f) + padchar + padchar);
                break;
            case 2:
                b = (s.charCodeAt(i) << 16) | (s.charCodeAt(i + 1) << 8);
                x.push(map.charAt(b >> 18) + map.charAt((b >> 12) & 0x3f) + map.charAt((b >> 6) & 0x3f) + padchar);
                break;
        }
        return x.join('');
    }

}