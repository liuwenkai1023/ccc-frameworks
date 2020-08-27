import { SdkAdapterBase, CallbackHandle } from "../SdkAdapterBase";
import { CallbackManager } from "../CallbackManager";
import { SingletonFactory } from "../../base/core/SingleFactory";

export class AndroidAdapter extends SdkAdapterBase {

    openURL(url: string) {
        this.callJavaStaticFunc("org/cocos2dx/javascript/SdkHelper", "openURL", "(Ljava/lang/String;)", url);
    }

    openApp(packageName: string) {
        this.callJavaStaticFunc("org/cocos2dx/javascript/SdkHelper", "openApp", "(Ljava/lang/String;)", packageName);
    }

    vibrate(type: number, duration?: number) {
        this.callJavaStaticFunc("org/cocos2dx/javascript/SdkHelper", "doShakeShake", "(II)B", type, duration);
    }

    copyToClipboard(text: string) {
        this.callJavaStaticFunc("org/cocos2dx/javascript/SdkHelper", "copyToClipboard", "(Ljava/lang/String;)B", text);
    }

    showBoxAd() {
        console.log("no support sdk:showBoxAd");
    }

    showInsertAd() {
        this.callJavaStaticFunc("org/cocos2dx/javascript/SdkHelper", "showInsertAd", "()V");
    }

    showBannerAd(isShow: boolean) {
        this.callJavaStaticFunc("org/cocos2dx/javascript/SdkHelper", "showBannerAd", "(Z)V", isShow);
    }

    showVideoAd(videoId: string, callback: CallbackHandle) {
        this.callJavaStaticFunc("org/cocos2dx/javascript/SdkHelper", "showVideoAd", "(Ljava/lang/String;Ljava/lang/String;)V", videoId, SingletonFactory.getInstance(CallbackManager).temp(callback));
    }

    startRecord(callback: Function, stopCallback: Function) {
        console.log("no support sdk:startRecord");
    }

    stopRecord(callback: Function) {
        console.log("no support sdk:stopRecord");
    }

}