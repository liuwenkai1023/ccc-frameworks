import { SdkAdapterBase, CallbackHandle } from "../SdkAdapterBase";
import { SingletonFactory } from "../../base/core/SingleFactory";
import { CallbackManager } from "../CallbackManager";

export class IOSAdapter extends SdkAdapterBase {

    openURL(url: string) {
        this.callOcStaticFunc("SdkHelper", "openURL:", url);
    }

    openApp(packageName: string) {
        this.callOcStaticFunc("SdkHelper", "openApp:", packageName);
    }

    vibrate(type: number, duration?: number) {
        this.callOcStaticFunc("SdkHelper", "doShakeShake");
    }

    copyToClipboard(text: string) {
        this.callOcStaticFunc("SdkHelper", "copyToClipboard:", text);
    }

    showBoxAd() {
        console.log("no support sdk:showBoxAd");
    }

    showInsertAd() {
        this.callOcStaticFunc("SdkHelper", "showInsertAd");
    }

    showBannerAd(isShow: boolean) {
        if (isShow) {
            this.callOcStaticFunc("SdkHelper", "showBannerAd");
        } else {
            this.callOcStaticFunc("SdkHelper", "hideBannerAd");
        }
    }

    showVideoAd(videoId: string, callback: CallbackHandle) {
        this.callOcStaticFunc("SdkHelper", "showVideoAd:videoId:", videoId, SingletonFactory.getInstance(CallbackManager).temp(callback) + "");
    }

    startRecord(callback: Function, stopCallback: Function) {
        console.log("no support sdk:startRecord");
    }

    stopRecord(callback: Function) {
        console.log("no support sdk:stopRecord");
    }

}