import { SdkAdapterBase, CallbackHandle } from "../../SdkAdapterBase";

export class BaiduAdapter extends SdkAdapterBase {

    openURL(url: string) {
    }

    openApp(packageName: string) {
    }

    vibrate(type: number, duration?: number) {
    }

    copyToClipboard(text: string) {
    }

    showBoxAd() {
        console.log("no support sdk:showBoxAd");
    }

    showInsertAd() {
    }

    showBannerAd(isShow: boolean) {
    }

    showVideoAd(videoId: string, callback: CallbackHandle) {
    }

    startRecord(callback: Function, stopCallback: Function) {
    }

    stopRecord(callback: Function) {
    }

}