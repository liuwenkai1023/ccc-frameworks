/**
 * 定义激励视频观看结果回调
 */
export interface RewardedVideoAdCloseHandler {
    success: Function, fail: Function
}


/**
 * 定义微信转发结果回调
 */
export interface WxResultHandler {
    success: { (result: any, message: string): void; },
    fail: { (result: any, message: string): void; }
}


/**
 * 定义微信Message回调,暂定为内部使用
 */
export interface WxHandler {
    (result: any): void;
}


/**
 * 定义微信转发Message参数接口
 */
export interface WxMessage {
    title?: string | void,
    path?: string | void,
    success?: WxHandler | void,
    fail?: WxHandler | void,
    imageUrl?: any | void,
}



/**
 * 微信一般工具类：WxUtil
 *      开放方法
 *      1、微信转发处理
 *          .转发到群       share2WxGroup(wxResultHandler: WxResultHandler) 
 *          .转发到个人     share2WxFriend(wxResultHandler: WxResultHandler)
 *      2、微信广告处理
 *          .Banner广告     initBannerAdd(adUnitId: string)
 *          .激励视频广告    initRewardedVideoAdd(adUnitId: string, closeHandler: RewardedVideoAdCloseHandler)
 *      3、文件路径处理
 *          .得到构建后的文件路径URL getUrl(url:string)
 */
export default class WxUtil {

    // 分享成功,但没按要求分享
    public static readonly SHARE_OPERATE_EXCEPITION = 0;
    // 分享成功,按要求分享
    public static readonly SHARE_OPERATE_SUCCESS = 1;
    // 分享失败
    public static readonly SHARE_OPERATE_ERROR = -1;

    private static instance: WxUtil;

    private _wx = (<any>window).wx;
    get wx() {
        return this._wx;
    }


    private constructor() {
        this.init();
    }


    public static getInstance(): WxUtil {
        if (!CC_WECHATGAME) {
            // console.warn("警告:当前不是微信环境，WxUtil将不可用!")
            return;
        }
        if (!this.instance) {
            this.instance = new WxUtil();
        }
        return this.instance;
    }


    /**
     * 初始化
     */
    private init() {
        // TODO 初始化获取相关权限
        // 初始化默认分享
        (<any>window).wx.updateShareMenu({ withShareTicket: true });
        this.defaultShare2Wx();
    }


    /**
     * 得到构建后的文件路径URL
     * @param url 原始文件目录
     */
    public getURL(url) {
        url = cc.url.raw(url);
        if (cc.loader.md5Pipe) {
            url = cc.loader.md5Pipe.transformURL(url);
        }
        try {
            this.wx.getFileSystemManager().accessSync(url)
        } catch (error) {
            url = (<any>window).wxDownloader.REMOTE_SERVER_ROOT + "/" + url;
        }
        // console.log(url);
        return url;
    }


    /**
     * 分享给好友
     */
    public share2WxFriend(wxResultHandler: WxResultHandler) {
        // console.log("share2WxFriend");
        let share2WxFriendMsg: WxMessage = {
            title: "转发给好友",
            success: function (res) {
                if (!res.shareTickets) {
                    // console.log("转发成功");
                    wxResultHandler.success(res, "转发成功");
                } else {
                    // console.log("没有按要求转发");
                    wxResultHandler.fail(res, "没有按要求转发");
                }
            },
            fail: function (res) {
                // console.log("转发失败");
                wxResultHandler.fail(res, "转发失败");
            },
        };
        this.share2Wx(share2WxFriendMsg);
    }


    /**
     * 分享到微信群
     */
    public share2WxGroup(wxResultHandler: WxResultHandler) {
        let share2WxGroupMsg: WxMessage = {
            title: "转发微信群",
            success: function (res) {
                if (!res.shareTickets) {
                    // console.log("没有按要求转发");
                    wxResultHandler.fail(res, "没有按要求转发");
                } else {
                    // console.log("转发成功");
                    wxResultHandler.success(res, "转发成功");
                }
            },
            fail: function (res) {
                // console.log("转发失败");
                wxResultHandler.fail(res, "转发失败");
            },
        };
        this.share2Wx(share2WxGroupMsg);
    }


    /**
     * 进行转发
     * @param wxMessage 转发的具体内容
     */
    private share2Wx(wxMessage: WxMessage) {
        // 可以直接调用,不用关心用户是否授权
        // console.log("share2Wx", wxMessage);
        (<any>window).wx.shareAppMessage(wxMessage);
    }


    /**
     * 右上角默认转发
     */
    private defaultShare2Wx() {
        (<any>window).wx.onShareAppMessage(function () {
            return {
                title: '右上角默认转发',
                success: function (res) {
                    // 转发成功
                    // console.log("右上角转发成功", res.shareTickets);
                },
                fail: function (res) {
                    // 转发失败
                    // console.log("右上角转发失败", res)
                }
            }
        });
    }


    /**
     *  初始化激励视频广告
     * @param adUnitId 广告ID
     * @param closeHandler 关闭视频回调
     */
    public initRewardedVideoAd(adUnitId: string, closeHandler: RewardedVideoAdCloseHandler) {
        // 创建激励视频广告（这里不用管，微信会自己返回一个全局唯一单例）
        let rewardedVideoAd = (<any>window).wx.createRewardedVideoAd({ adUnitId: adUnitId });
        // 初始化广告回调
        this.initAdHandler(rewardedVideoAd, "")
        // 没传入激励视频关闭回调就不覆盖原始回调
        if (!closeHandler) return;
        // 激励视频广告有onClose事件
        rewardedVideoAd.onClose(function (res) { // 用户点击了【关闭广告】按钮
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            if (res && res.isEnded || res === undefined) { // 正常播放结束，可以下发游戏奖励
                closeHandler.success();
            }
            else { // 播放中途退出，不下发游戏奖励
                closeHandler.fail();
            }
        }.bind(this));
        return rewardedVideoAd;
    }


    /**
     * 初始化Banner广告
     * @param adUnitId 广告ID
     */
    public initBannerAd(adUnitId: string) {
        // 创建Banner广告（这里不用管，微信会自己返回一个全局唯一单例）
        let bannerAd = (<any>window).wx.createBannerAd({
            adUnitId: adUnitId,
            style: {
                left: 10,
                top: 76,
                width: 320
            }
        })
        // 初始化广告回调
        this.initAdHandler(bannerAd, "Banner");
        return bannerAd;
    }


    /**
     * 初始化广告回调
     * @param adComponent 广告组件
     * @param closeHandler 关闭广告回调
     * @param tag 控制台打印标记
     */
    private initAdHandler(adComponent: any, tag: string) {
        // 回调：广告加载失败
        adComponent.onError(
            function (err) {
                // console.log(err);
            }
        );
        // 回调：广告加载成功
        adComponent.onLoad(
            function () {
                // console.log(tag, '广告加载成功');
            }
        );
        // 回调：广告展示时 拉取失败，重新拉取并展示
        adComponent.show().catch(
            function (err) {
                // console.log(tag, err)
                adComponent.load().then(
                    function () {
                        adComponent.show()
                    }
                )
            }
        );
        // 回调：广告拉取并展示成功
        adComponent.show().then(
            function () {
                // console.log(tag, '广告已经成功显示')
            }
        );
    }

}
