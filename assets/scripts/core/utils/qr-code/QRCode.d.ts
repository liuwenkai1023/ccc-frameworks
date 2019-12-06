declare module QRCode {


    /**
     * 生成二维码 数组
     * @param data 内容
     * @param options 设置
     */
    export function generate(data: string, options?: QROptions): Array<Array<number>>;


    /**
     * 生成二维码 html
     * @param data 内容
     * @param options 设置
     */
    export function generateHTML(data: string, options?: QROptions): string;


    /**
     * 生成二维码 base64
     * @param data 内容
     * @param options 设置
     */
    export function generatePNG(data: string, options?: QROptions): string;


    export interface QROptions {
        version?: number,
        mask?: number        // [0-8] default -1
        mode: string,        // [numeric、alphanumeric、octet]，default numeric
        ecclevel: string,    // [L、M、Q、H]，default L
    }

}