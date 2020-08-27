import { SdkAdapterBase, CallbackHandle } from "../../SdkAdapterBase";
import RecorderUtil from "../../RecoderUtil";

const tt = window['tt'];

export class ToutiaoAdapter extends SdkAdapterBase {

    // 西瓜视频bannerAd会有问题，所以屏蔽掉
    public _isXiGua = tt && tt.getSystemInfoSync().appName == "XiGua";
    private _recorderUtil = RecorderUtil.getInstance();

    private _bannerAdUnitId: string = "4jhe3ab052lc00je1s";
    private _insertAdUnitId: string = "3r3ii5j2kre0ke607h";
    private _rewardedVideoAdUnitId: string = "1j7gbj26jb4bj2rlff";

    private _videoId = null;
    private _bannerAd = null;
    private _rewardVideoAd = null;
    private _videoCallback = null;
    private _interstitialAd = null;

    constructor() {
        super();
        tt.showShareMenu({ withShareTicket: true });
    }

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
        /* 建议放在需要展示插屏广告的时机执行 */
        const isToutiaio = tt.getSystemInfoSync().appName === "Toutiao";
        // 插屏广告仅今日头条安卓客户端支持
        if (isToutiaio) {
            if (!this._interstitialAd) {
                this._interstitialAd = tt.createInterstitialAd({
                    adUnitId: this._insertAdUnitId
                });
                this._interstitialAd.onClose(() => {
                    this._interstitialAd.destroy();
                    this._interstitialAd = null;
                });
            }
            this._interstitialAd
                .load()
                .then(() => {
                    this._interstitialAd.show();
                })
                .catch(err => {
                    // console.log(err);
                    // window['_lastInsertAdTime'] = new Date().getTime() - 60000;
                });
        }
    }

    showBannerAd(isShow: boolean) {
        if (this._isXiGua || !tt.createBannerAd) {
            return;
        }
        this._bannerAd = this._initBannerAd(this._bannerAdUnitId);
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


    // --===================录屏相关====================--

    /**
     * 开始录屏
     * @param callback 
     */
    startRecord(callback?: (res) => void) {
        this._recorderUtil.startRecord(callback);
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
     *  初始化激励视频广告
     * @param adUnitId 广告ID
     * @param callback 关闭视频回调
     */
    private _initRewardedVideoAd(adUnitId: string, callback: (code: number) => void) {
        if (!callback) return;
        const rewardedVideoAd = tt.createRewardedVideoAd({ adUnitId: adUnitId });
        // 关闭视频回调
        rewardedVideoAd && rewardedVideoAd.onClose(function (res) {
            if (res && res.isEnded || res === undefined) {
                callback(0);
                rewardedVideoAd.load();
            } else {
                callback(-1);
                rewardedVideoAd.load();
            }
        }.bind(this));
        // 加载视频失败需要进行提示
        rewardedVideoAd && rewardedVideoAd.onError((res) => {
            console.log('videoAd onError', res)
            this._recorderUtil.showToast("暂无可播放视频", 1000);
            this._rewardVideoAd = null;
            callback(- 2);
        });

        rewardedVideoAd && rewardedVideoAd.onLoad(function (res) {
            console.log('videoAd onLoad', res);
        });

        return rewardedVideoAd;
    }

    /**
     * 初始化Banner广告
     * @param adUnitId 广告ID
     */
    private _initBannerAd(adUnitId: string) {
        const systemInfo = tt.getSystemInfoSync();
        // console.log(systemInfo);
        const bannerAd = tt.createBannerAd({
            adUnitId: adUnitId,
            adIntervals: 50,
            style: { left: 0, top: systemInfo.windowHeight - 90, width: systemInfo.windowWidth }
        })
        bannerAd.onLoad(() => { cc.log("onLoad"); });
        bannerAd.onError(async (res) => {
            await 0;
            console.log('bannerAd onError', res);
            this._bannerAd = null;
        });
        bannerAd.onResize(function (size) {
            CC_DEBUG && cc.log("onResize", size);
            const top = (systemInfo.windowHeight - size.height) + 0.1;
            const left = (systemInfo.windowWidth - size.width) / 2;
            bannerAd.style.top == top || (bannerAd.style.top = top);
            bannerAd.style.left == left || (bannerAd.style.left = left);
        });
        return bannerAd;
    }


}