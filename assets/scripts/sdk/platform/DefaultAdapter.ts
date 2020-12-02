import { SdkAdapterBase, CallbackHandle } from "../SdkAdapterBase";

export class DefaultAdapter extends SdkAdapterBase {

    /**
     * 是否支持录屏，默认为不支持
     */
    protected _isSupportRecord: boolean = false;

    /**
     * 一般在初始化数据配置完成时调用
     */
    inited() {
    }

    /**
     * 打开网页地址
     * @param url 
     */
    openURL(url: string) {
        console.warn("sdk:openURL", url);
        try {
            let a = document.createElement('a');
            a.href = url;
            a.target = "_blank";
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.warn("sdk:openURL failed", url, error);
        }
    }

    /**
     * 打开外部应用
     * @param packageName 
     */
    openApp(packageName: string) {
        console.warn("sdk:openApp", packageName);
    }

    /**
    * 振动
    * @param type 0短振动 1长振动
    * @param duration 持续时间(仅在Android平台生效)
    */
    vibrate(type: number, duration?: number) {
        console.warn("sdk:vibrate", type, duration);
    }

    copyToClipboard(text: string) {
        let status = false;
        try {
            let textArea = document.createElement('textarea');
            textArea.textContent = text;
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.select();
            //通过执行copy指令将选中的信息复制到剪切板
            status = document.execCommand('copy', false, null);
            textArea.remove();
        } catch (error) {

        }
        console.warn("sdk:copyToClipboard", status, text);
    }

    /**
     * 复制文本到剪切板
     * @param text 
     */
    showBoxAd() {
        console.warn("sdk:showBoxAd");
    }

    /**
     * 展示插屏广告
     */
    showInsertAd() {
        console.warn("sdk:showInsertAd");
    }

    /**
     * 展示横幅广告
     * @param isShow 
     */
    showBannerAd(isShow: boolean) {
        console.warn("sdk:showBannerAd", isShow);
    }

    /**
     * 展示激励视频广告
     * @param videoId 
     * @param callback 
     */
    showVideoAd(videoId: string, callback: CallbackHandle) {
        console.warn("sdk:showVideoAd", videoId, callback);
        setTimeout(() => {
            callback && callback({ errCode: 0, data: {} });
        }, 1000);
    }

    /**
     * 开始录屏
     * @param callback 开始录屏回调
     * @param stopCallback 自动停止录屏回调
     */
    startRecord(callback: (res) => void, stopCallback: (res) => void) {
        console.warn("sdk:startRecord");
        setTimeout(() => {
            callback && callback({});
        });
    }

    /**
     * 结束录屏
     * @param callback 结束录屏回调
     */
    stopRecord(callback: (res) => void) {
        console.warn("sdk:callback");
        setTimeout(() => {
            callback && callback({ videoPath: "" });
        });
    }

    /**
     * 分享录屏
     * @param needShowToast 是否需要失败提示
     * @param callback 分享结果回调
     */
    shareVideo(needShowToast: boolean, callback: (code: number) => void) {
        console.warn("sdk:shareVideo");
        setTimeout(() => {
            callback && callback(0);
        });
    }
}