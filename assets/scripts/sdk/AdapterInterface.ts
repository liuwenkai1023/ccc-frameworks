export interface AdapterInterface {

    /**
     * 复制文本到剪切板
     * @param text 
     */
    copyToClipboard(text: string): boolean;

    /**
     * 打开一个网页链接
     * @param url 网页的url地址
     */
    openUrl(url: string);


    /**
     * 展示Banner广告
     * @param isShow   是否展示
     * @param callback 回调函数
     */
    showAdBanner(isShow: boolean);

    /**
     * 展示Video广告
     * @param callback 回调函数
     */
    showAdVideo(callback: (result: { code: number, data?: any }) => void);

}