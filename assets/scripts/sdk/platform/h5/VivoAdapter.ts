import { SdkAdapterBase, CallbackHandle } from "../../SdkAdapterBase";

export class VivoAdapter extends SdkAdapterBase {
    
    inited() {
        // throw new Error("Method not implemented.");
    }

    openURL(url: string) {
        // throw new Error("Method not implemented.");
    }

    openApp(packageName: string) {
        // throw new Error("Method not implemented.");
    }

    vibrate(type: number, duration?: number) {
        // throw new Error("Method not implemented.");
    }

    copyToClipboard(text: string) {
        // throw new Error("Method not implemented.");
    }

    showBoxAd() {
        // throw new Error("Method not implemented.");
    }

    showInsertAd() {
        // throw new Error("Method not implemented.");
    }

    showBannerAd(isShow: boolean) {
        // throw new Error("Method not implemented.");
    }

    showVideoAd(videoId: string, callback: CallbackHandle) {
        // throw new Error("Method not implemented.");
    }

    startRecord(callback: Function, stopCallback: Function) {
        // throw new Error("Method not implemented.");
    }

    stopRecord(callback: Function) {
        // throw new Error("Method not implemented.");
    }

}