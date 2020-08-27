import { SdkAdapterBase, CallbackHandle } from "../../SdkAdapterBase";

export class WechatAdapter extends SdkAdapterBase {

    // protected _boxAdUnitId: string = "56a089855c04f471178a604937848a55";
    protected _insertAdUnitId: string = "3bf09d7f641116fd226fce1df8404cea";
    protected _bannerAdUnitId: string = "d8b062172af5b2fa90618a8c7015f6e8";
    protected _rewardedVideoAdUnitId: string = "a9595328b3f4bed02c554385a463c3d3";

    private _videoId = null;
    private _bannerAd = null;
    private _insertAd = null;
    private _rewardVideoAd = null;
    private _videoCallback = null;

    private __onCloseCb: Function = null;
    private __onErrorCb: Function = null;
    private __onLoadCb: Function = null;

    get platform() {
        return window['wx'];
    }

    async inited() {
        await 0; // 避免阻塞在这里
        this.platform.showShareMenu({ withShareTicket: true });
        if (!this._insertAd) {
            this._insertAd = this._initInsertAd(this._insertAdUnitId);
        }
        if (!this._bannerAd) {
            this._bannerAd = this._initBannerAd(this._bannerAdUnitId);
        }
        if (!this._rewardVideoAd) {
            this._rewardVideoAd = this._initRewardedVideoAd(this._rewardedVideoAdUnitId, (code) => {
                this._videoCallback && this._videoCallback({ code: code, data: { videoid: this._videoId } });
            });
        }
    }

    openURL(url: string) {
        console.log("no support sdk:openURL");
    }

    openApp(packageName: string) {
        console.log("no support sdk:openApp");
    }

    vibrate(type: number, duration?: number) {
        type ? this.platform.vibrateLong() : this.platform.vibrateShort();
    }

    copyToClipboard(text: string) {
        this.platform.setClipboardData({ data: `${text}` });
    }

    showBoxAd() {
        console.log("no support sdk:showBoxAd");
    }

    showInsertAd() {
        if (!this._insertAd) {
            this._insertAd = this._initInsertAd(this._insertAdUnitId);
        }
        /* 建议放在需要展示插屏广告的时机执行 */
        // 650ms刚好合适
        setTimeout(() => {
            this._insertAd.show().catch((err) => {
                console.error('show', err);
            });
        }, 650);
    }

    showBannerAd(isShow: boolean) {
        if (!this._bannerAd) {
            this._bannerAd = this._initBannerAd(this._bannerAdUnitId);
        }
        isShow ? this._bannerAd.show() : this._bannerAd.hide();
    }

    showVideoAd(videoId: string, callback: CallbackHandle) {
        this._videoId = videoId;
        this._videoCallback = callback;
        if (!this._rewardVideoAd) {
            this._rewardVideoAd = this._initRewardedVideoAd(this._rewardedVideoAdUnitId, (code) => {
                this._videoCallback && this._videoCallback({ code: code, data: { videoid: this._videoId } });
            });
        }
        this._rewardVideoAd.load().then(() => {
            this._rewardVideoAd.show();
        });
    }

    startRecord(callback: Function, stopCallback: Function) {
        console.log("no support sdk:startRecord");
    }

    stopRecord(callback: Function) {
        console.log("no support sdk:stopRecord");
    }

    // --===================================分隔线======================================--

    private _initRewardedVideoAd(adUnitId: string, callback?: (code: number) => void) {
        cc.log("_initRewardedVideoAd");
        const rewardedVideoAd = this.platform.createRewardedVideoAd({ adUnitId: adUnitId });
        // 关闭视频回调
        rewardedVideoAd && rewardedVideoAd.offClose(this.__onCloseCb);
        rewardedVideoAd && rewardedVideoAd.offError(this.__onErrorCb);
        rewardedVideoAd && rewardedVideoAd.offLoad(this.__onLoadCb);
        // 添加新的视频回调
        // onClose
        const onCloseCb = this.__onCloseCb = (res) => {
            cc.log('videoAd onClose', res)
            if (res && res.isEnded || res === undefined) {
                callback && callback(0);
            } else {
                callback && callback(-1);
            }
            this._videoCallback = null;
        };
        // onError
        const onErrorCb = this.__onErrorCb = (res) => {
            cc.log('videoAd onError', res)
            this._rewardVideoAd = null;
            callback && callback(- 2);
        };
        // onLoad
        const onLoadCb = this.__onLoadCb = (res) => {
            cc.log('videoAd onLoad', res);
        }
        rewardedVideoAd && rewardedVideoAd.onClose(onCloseCb);
        rewardedVideoAd && rewardedVideoAd.onError(onErrorCb);
        rewardedVideoAd && rewardedVideoAd.onLoad(onLoadCb);
        return rewardedVideoAd;
    }

    /**
     * 初始化BannerAd
     * @param adUnitId 
     */
    private _initBannerAd(adUnitId: string) {
        cc.log("_initBannerAd");
        const systemInfo = this.platform.getSystemInfoSync();
        const bannerAd = this.platform.createBannerAd({
            adUnitId: adUnitId,
            style: { left: 0, top: systemInfo.windowHeight - 50, width: systemInfo.windowWidth * 0.85, height: 50 }
        })
        // bannerAd.onLoad(() => {
        //     cc.log("onLoad");
        // });
        bannerAd.onError(async (res) => {
            cc.log('bannerAd onError', res);
            await 0;
            this._bannerAd = null;
        });
        bannerAd.onResize(function (size) {
            cc.log("onResize", size);
            const top = (systemInfo.windowHeight - size.height) + 0.05;
            const left = (systemInfo.windowWidth - size.width) / 2;
            bannerAd.style.top == top || (bannerAd.style.top = top);
            bannerAd.style.left == left || (bannerAd.style.left = left);
        });
        return bannerAd;
    }

    /**
     * 初始化插屏
     */
    protected _initInsertAd(_insertAdUnitId: string): any {
        cc.log("_initInsertAd");
        const interstitialAd = this.platform.createInterstitialAd({
            adUnitId: _insertAdUnitId
        });
        interstitialAd.load().catch((err) => {
            console.error('load', err)
        })
        // interstitialAd.onLoad(() => {
        //     cc.log('onLoad event emit')
        // })
        // interstitialAd.onClose(() => {
        //     cc.log('close event emit')
        // })
        // interstitialAd.onError((e) => {
        //     cc.log('error', e)
        // })
        return interstitialAd;
    }

}