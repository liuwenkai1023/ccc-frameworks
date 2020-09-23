import { SdkAdapterBase, CallbackHandle } from "../../SdkAdapterBase";

export class WechatAdapter extends SdkAdapterBase {

    protected _appSid: string = null;
    // protected _boxAdUnitId: string = "56a089855c04f471178a604937848a55";
    protected _insertAdUnitId: string = "3bf09d7f641116fd226fce1df8404cea";
    protected _bannerAdUnitId: string = "d8b062172af5b2fa90618a8c7015f6e8";
    protected _rewardedVideoAdUnitId: string = "a9595328b3f4bed02c554385a463c3d3";

    protected _systemInfo = null;
    protected _videoId = null;
    protected _videoCallback = null;

    protected _bannerAd = null;
    protected _insertAd = null;
    protected _rewardVideoAd = null;

    private __onLoadCb: Function = null;
    private __onCloseCb: Function = null;
    private __onErrorCb: Function = null;

    get platform() {
        return window['wx'];
    }

    get systemInfo() {
        if (!this._systemInfo) {
            this._systemInfo = this.platform.getSystemInfoSync();;
        }
        return this._systemInfo;
    }

    async inited() {
        // 避免某些特殊机型因为ES6/ES5原因阻塞在这里
        await 0;

        // 小游戏没有获取唯一设备ID的地方,主动写入本地储存
        const systemInfo = this.systemInfo;
        const uuid = localStorage.getItem("uuid");
        window['uuid'] = `${(uuid && uuid.length > 0) ? uuid : new Date().getTime()}`;
        window['device'] = `${systemInfo.brand} ${systemInfo.model}`;
        localStorage.setItem("uuid", window['uuid']);
        localStorage.setItem("device", window['device']);

        console.log(`** MiniGame ** \n device = ${window['device']}, uuid = ${window['uuid']}`);

        // 设置分享标记
        this.platform.showShareMenu({ withShareTicket: true });

        // 初始化插屏
        if (!this._insertAd) {
            this._insertAd = this._initInsertAd(this._insertAdUnitId);
        }

        // 初始化横幅广告
        if (!this._bannerAd) {
            this._bannerAd = this._initBannerAd(this._bannerAdUnitId);
        }

        // 初始化激励视频
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


    /**
     * 初始化激励视频
     * @param adUnitId  
     * @param callback 
     */
    protected _initRewardedVideoAd(adUnitId: string, callback: (code: number) => void) {
        cc.log("_initRewardedVideoAd");
        const rewardedVideoAd = this.platform.createRewardedVideoAd({ adUnitId: adUnitId, appSid: this._appSid });
        // 关闭视频回调（在发生错误后重新走初始化，需要注销之前的回调）
        rewardedVideoAd && rewardedVideoAd.offLoad(this.__onLoadCb);
        rewardedVideoAd && rewardedVideoAd.offClose(this.__onCloseCb);
        rewardedVideoAd && rewardedVideoAd.offError(this.__onErrorCb);
        //
        const onLoadCb = this.__onLoadCb = (res) => {
            cc.log('videoAd onLoad', res);
        }
        // 关闭视频时验证奖励
        const onCloseCb = this.__onCloseCb = (res) => {
            cc.log('videoAd onClose', res)
            if (res && res.isEnded || res === undefined) {
                callback(0);
            } else {
                callback(-1);
            }
            this._videoCallback = null;
        };
        // 在发生错误时释放rewardVideoAd对象(某些情况不重新创建会一直不展示)
        const onErrorCb = this.__onErrorCb = (res) => {
            cc.log('videoAd onError', res)
            callback(- 2);
            this._rewardVideoAd = null;
            this._videoCallback = null;
        };
        // 注册视频回调
        rewardedVideoAd && rewardedVideoAd.onClose(onCloseCb);
        rewardedVideoAd && rewardedVideoAd.onError(onErrorCb);
        rewardedVideoAd && rewardedVideoAd.onLoad(onLoadCb);
        return rewardedVideoAd;
    }


    /**
     * 初始化BannerAd
     * @param adUnitId 
     */
    protected _initBannerAd(adUnitId: string) {
        cc.log("_initBannerAd");
        const systemInfo = this.systemInfo;
        const bannerAd = this.platform.createBannerAd({
            adUnitId: adUnitId,
            appSid: this._appSid,
            adIntervals: 60,
        });
        // 在发生错误时释放bannerAd对象(某些情况不重新创建会一直不展示)
        bannerAd.onError(async (res) => {
            cc.log('bannerAd onError', res);
            await 0;
            this._bannerAd = null;
        });
        // 在横幅大小变化时更新位置
        bannerAd.onResize((size) => {
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
    protected _initInsertAd(insertAdUnitId: string): any {
        cc.log("_initInsertAd");
        const interstitialAd = this.platform.createInterstitialAd({ adUnitId: insertAdUnitId, appSid: this._appSid, });
        interstitialAd.load().catch((err) => {
            console.error('load', err);
        });
        return interstitialAd;
    }

}