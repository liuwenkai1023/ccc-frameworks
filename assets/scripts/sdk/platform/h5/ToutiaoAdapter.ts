import RecorderUtil from "../../RecoderUtil";
import { WechatAdapter } from "./WechatAdapter";

export class ToutiaoAdapter extends WechatAdapter {

    // protected _boxAdUnitId: string = "56a089855c04f471178a604937848a55";
    protected _insertAdUnitId: string = "3bf09d7f641116fd226fce1df8404cea";
    protected _bannerAdUnitId: string = "d8b062172af5b2fa90618a8c7015f6e8";
    protected _rewardedVideoAdUnitId: string = "a9595328b3f4bed02c554385a463c3d3";

    // 西瓜视频bannerAd会有问题，所以屏蔽掉
    private _isXiGua = false;
    private _recorderUtil = RecorderUtil.getInstance();

    get platform() {
        return window['tt'];
    }

    async inited() {
        await 0;
        this._isXiGua = this.platform && this.systemInfo.appName == "XiGua"
        super.inited();
    }

    showInsertAd() {
        // 插屏广告仅今日头条安卓客户端支持
        const isToutiaio = this.systemInfo.appName === "Toutiao";
        if (!isToutiaio) {
            return;
        }
        super.showInsertAd();
    }

    showBannerAd(isShow: boolean) {
        if (this._isXiGua || !this.platform.createBannerAd) {
            return;
        }
        super.showBannerAd(isShow);
    }

    // --===================录屏相关====================--

    /**
     * 开始录屏
     * @param callback 
     * @param stopCallback
     */
    startRecord(callback?: (res) => void, stopCallback?: (res) => void) {
        this._recorderUtil.startRecord(callback, stopCallback);
    }

    /**
     * 结束录屏
     * @param callback 
     */
    stopRecord(callback?: (res) => void) {
        this._recorderUtil.stopRecord(callback);
    }

    /**
     * 分享录屏
     * @param needShowToast 是否需要失败提示
     * @param callback 
     */
    shareVideo(needShowToast: boolean, callback: (code: number) => void) {
        this._recorderUtil.shareVideo(needShowToast, callback);
    }

    // --==================初始化广告===================--

    /**
     * 初始化插屏
     */
    protected _initInsertAd(insertAdUnitId: string): any {
        cc.log("_initInsertAd");
        const interstitialAd = super._initInsertAd(insertAdUnitId);
        interstitialAd && interstitialAd.onClose(() => {
            interstitialAd.destroy();
            this._insertAd = null;
        });
        return interstitialAd;
    }

}