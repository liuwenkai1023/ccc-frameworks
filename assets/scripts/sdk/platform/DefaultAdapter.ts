import { SdkAdapterBase, CallbackHandle } from "../SdkAdapterBase";

export class DefaultAdapter extends SdkAdapterBase {

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

    openApp(packageName: string) {
        console.warn("sdk:openApp", packageName);
    }

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

    showBoxAd() {
        console.warn("sdk:showBoxAd");
    }

    showInsertAd() {
        console.warn("sdk:showInsertAd");
    }

    showBannerAd(isShow: boolean) {
        console.warn("sdk:showBannerAd", isShow);
    }

    showVideoAd(videoId: string, callback: CallbackHandle) {
        console.warn("sdk:showVideoAd", videoId, callback);
        setTimeout(() => {
            callback && callback({ errCode: 0, data: {} });
        }, 1000);
    }

    startRecord(callback: Function, stopCallback: Function) {
        console.warn("sdk:startRecord", callback, stopCallback);
    }

    stopRecord(callback: Function) {
        console.warn("sdk:stopRecord", callback);
    }

}