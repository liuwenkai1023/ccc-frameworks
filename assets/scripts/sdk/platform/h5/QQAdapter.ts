import { SdkAdapterBase, CallbackHandle } from "../../SdkAdapterBase";
import { WechatAdapter } from "./WechatAdapter";

export class QQAdapter extends WechatAdapter {

    protected _boxAdUnitId: string = "4fc3c5c4000e4bc27a195f3985a246d8";
    protected _insertAdUnitId: string = "2e7e5e7644a564e41992f6f5b8254892";
    protected _bannerAdUnitId: string = "992e0eacea536f90ef090fc31cbac390";
    protected _rewardedVideoAdUnitId: string = "6fdd00bcfc6655821d6a21df493c378a";


    get platform() {
        return window["qq"];
    }

    showBoxAd() {
        const appbox = this.platform.createAppBox({
            adUnitId: this._boxAdUnitId
        });
        appbox.load().then(() => {
            appbox.show();
        });
    }

}