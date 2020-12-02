import { ToutiaoAdapter } from "./ToutiaoAdapter";

export class BaiduAdapter extends ToutiaoAdapter {

    // protected _boxAdUnitId: string = "56a089855c04f471178a604937848a55";
    // protected _insertAdUnitId: string = "3bf09d7f641116fd226fce1df8404cea";
    protected _bannerAdUnitId: string = "d8b062172af5b2fa90618a8c7015f6e8";
    protected _rewardedVideoAdUnitId: string = "a9595328b3f4bed02c554385a463c3d3";

    get platform() {
        return window['swan'];
    }

    // 百度目前不支持插屏
    showInsertAd() {
    }

    // 百度目前不支持插屏
    _initInsertAd() {
    }

}