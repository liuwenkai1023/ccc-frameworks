/**
 * 微信一般工具类：WxUtil
 *      开放方法
 *      1、微信转发处理
 *          .设置默认转发        defaultShare2Wx(wxMessage?: WxMessage | void)
 *          .自定义转发      share2Wx(wxMessage?: WxMessage | void)
 *      2、微信广告处理
 *          .Banner广告     initBannerAdd(adUnitId: string)
 *          .激励视频广告    initRewardedVideoAdd(adUnitId: string, closeHandler: RewardedVideoAdCloseHandler)
 *      3、文件路径处理
 *          .得到构建后的文件路径URL getUrl(url:string)
 *      4、微信开放数据域整理
 *          .拉取当前用户所有同玩好友的托管数据。该接口只可在开放数据域下使用          getFriendCloudStorage(object: GetFriendStorageObject)  
 *          .群转发卡片打开游戏，可以通过调用该接口获取群同玩成员的游戏数据。          getGroupCloudStorage(object: GetGroupStorageObject)
 *           该接口只可在开放数据域下使用。                                         
 *          .获取当前用户托管数据当中对应 key 的数据。该接口只可在开放数据域下使用     getUserCloudStorage(object: GetUserStorageObject)
 *          .删除用户托管数据当中对应 key 的数据。没有限制使用位置。                  removeUserCloudStorage(object: RemoveUserStorageObject)
 *          .对用户托管数据进行写数据操作，允许同时写多组 KV 数据，没有限制使用位置。  setUserCloudStorage(object: SetUserStorageObject)
 */
export default class WxUtil {

    private static _instance: WxUtil;
    private _wx = (<any>window).wx;


    get wx() {
        return this._wx;
    }


    private constructor() {
        this.init();
    }


    public static instance(): WxUtil {
        if (!CC_WECHATGAME) {
            console.warn("警告:当前不是微信环境，WxUtil将不可用!")
            return;
        }
        if (!this._instance) {
            this._instance = new WxUtil();
        }
        return this._instance;
    }


    /**
     * 初始化
     */
    private init() {
        // TODO 初始化获取相关权限
        // 初始化默认转发
        (<any>window).wx.updateShareMenu({ withShareTicket: true });
        // this.defaultShare2Wx();
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
        return url;
    }


    /**
     * 进行转发
     * @param wxMessage 转发的具体内容
     */
    public share2Wx(wxMessage?: WxMessage | void) {
        // 可以直接调用,不用关心用户是否授权
        (<any>window).wx.shareAppMessage(wxMessage ? wxMessage : {});
    }


    /**
     * 右上角默认转发
     */
    public defaultShare2Wx(wxMessage?: WxMessage | void) {
        (<any>window).wx.showShareMenu();
        (<any>window).wx.onShareAppMessage(function () {
            return wxMessage ? wxMessage : {}
        });
    }


    /**
     *  初始化激励视频广告
     * @param adUnitId 广告ID
     * @param closeHandler 关闭视频回调
     */
    public initRewardedVideoAd(adUnitId: string, closeHandler: RewardedVideoAdCloseHandler) {
        // 创建激励视频广告
        let rewardedVideoAd = (<any>window).wx.createRewardedVideoAd({ adUnitId: adUnitId });
        // 初始化广告回调
        this.initAdHandler(rewardedVideoAd, "RewardedVideo")
        // 关闭视频
        rewardedVideoAd.onClose(function (res) {
            // 正常播放结束
            if (res && res.isEnded || res === undefined) {
                if (closeHandler.success) closeHandler.success();
            }
            // 播放中途退出
            else {
                if (closeHandler.fail) closeHandler.fail();
            }
        }.bind(this));
        return rewardedVideoAd;
    }


    /**
     * 初始化Banner广告
     * @param adUnitId 广告ID
     */
    public initBannerAd(adUnitId: string, style?: object | void) {
        // 默认样式
        style = style ? style : { left: 10, top: 76, width: 320 };
        // 创建Banner广告
        let bannerAd = (<any>window).wx.createBannerAd({
            adUnitId: adUnitId,
            style: style,
        })
        // 初始化广告回调
        this.initAdHandler(bannerAd, "Banner");
        return bannerAd;
    }


    /**
     * 初始化广告回调
     * @param adComponent 广告组件
     * @param closeHandler 关闭广告回调
     * @param tag 打印标记
     */
    private initAdHandler(adComponent: any, tag?: string | void) {
        // 拉取失败默认处理：广告展示时 拉取失败，重新拉取并展示
        adComponent.show().catch(
            function (err) {
                adComponent.load().then(
                    function () {
                        adComponent.show()
                    }
                )
            }
        );
    }


    /**
     * 拉取当前用户所有同玩好友的托管数据。
     * 该接口只可在开放数据域下使用
     * @param object 参数类型 GetFriendStorageObject
     */
    public getFriendCloudStorage(object: GetFriendStorageObject) {
        this.wx.getFriendCloudStorage(object);
    }


    /**
     * 在小游戏是通过群转发卡片打开的情况下，可以通过调用该接口获取群同玩成员的游戏数据。
     * 该接口只可在开放数据域下使用。
     * @param object 参数类型 GetGroupStorageObject
     */
    public getGroupCloudStorage(object: GetGroupStorageObject) {
        this.wx.getGroupCloudStorage(object);
    }


    /**
     * 获取当前用户托管数据当中对应 key 的数据。
     * 该接口只可在开放数据域下使用。
     * @param object 参数类型 GetUserStorageObject
     */
    public getUserCloudStorage(object: GetUserStorageObject) {
        this.wx.getUserCloudStorage(object);
    }


    /**
     * 删除用户托管数据当中对应 key 的数据。
     * @param object 参数类型 RemoveUserStorageObject
     */
    public removeUserCloudStorage(object: RemoveUserStorageObject) {
        this.wx.removeUserCloudStorage(object);
    }


    /**
     * 对用户托管数据进行写数据操作，允许同时写多组 KV 数据。
     * @param object 参数类型 SetUserStorageObject
     */
    public setUserCloudStorage(object: SetUserStorageObject) {
        this.wx.setUserCloudStorage(object);
    }

}



/**
 * 定义激励视频观看结果回调
 */
export interface RewardedVideoAdCloseHandler {
    success?: Function | void,  // 是 完整观看激励视频
    fail?: Function | void,     // 是 观看失败或者未完整观看激励视频
}


/**
 * 定义微信转发回调
 */
export interface WxShareHandler {
    (result?: any | void): void;  // 是 转发回调处理
}


/**
 * 定义微信转发Message参数接口
 */
export interface WxMessage {
    title?: string | void,              // 否 转发时显示标题，默认为小程序名称
    success?: WxShareHandler | void,    // 否 转发成功时回调（基础库2.3及其以上不支持）
    fail?: WxShareHandler | void,       // 否 转发失败时回调（基础库2.3及其以上不支持）
    complete?: WxShareHandler | void,   // 否 转发失败时回调（基础库2.3及其以上不支持）
    imageUrl?: any | void,              // 否 转发时显示的图片地址
    // 如果希望转发时显示当前canvas,可以这样来使用，官方推荐比例5:4
    // imageUrl: WxUtil.wx.getSharedCanvas().toTempFilePathSync({
    //     destWidth: 500,
    //     destHeight: 400
    //   })
}


/**
 * 微信开放数据使用的键值对象
 */
export interface KVData {
    key: string,    // 数据的 key
    value: string,  // 数据的 value
}


/**
 * 用户及托管游戏数据信息
 */
export interface UserGameData {
    avatarUrl: string,          // 用户的微信头像 url
    nickname: string,           // 用户的微信昵称
    openid: string,             // 用户的 openid
    KVDataList: Array<KVData>,  // 用户的托管 KV 数据列表
}


/**
 * 托管用户游戏数据时需要传入的对象
 */
export interface SetUserStorageObject {
    keyList: Array<string>,	    // 是	是	要修改的 KV 数据列表	
    success?: Function | void,	// 否	接口调用成功的回调函数	
    fail?: Function | void,	    // 否	接口调用失败的回调函数	
    complete?: Function | void,	// 否	接口调用结束的回调函数（调用成功、失败都会执行）
}


/**
 * 移除用户托管的游戏数据时需要传入的对象
 */
export interface RemoveUserStorageObject {
    keyList: Array<string>,	    // 是	要删除掉 key 列表
    success?: Function | void,	// 否	接口调用成功的回调函数	
    fail?: Function | void,	    // 否	接口调用失败的回调函数	
    complete?: Function | void,	// 否	接口调用结束的回调函数（调用成功、失败都会执行）
}


/**
 * 拉取用户托管的游戏数据时需要传入的对象
 */
export interface GetUserStorageObject {
    keyList: Array<string>,	    // 是	要拉取的 key 列表	
    success?: { (data: Array<KVData>) } | void,	//否	接口调用成功的回调函数	
    fail?: Function | void,	    // 否	接口调用失败的回调函数	
    complete?: Function | void,	// 否	接口调用结束的回调函数（调用成功、失败都会执行）
}


/**
 * 拉取托管的微信好友游戏数据时需要传入的对象
 */
export interface GetFriendStorageObject {
    keyList: Array<string>,	    // 是	要拉取的 key 列表	
    success?: { (data: Array<UserGameData>) } | void,	// 否	接口调用成功的回调函数	
    fail?: Function | void,	    // 否	接口调用失败的回调函数	
    complete?: Function | void,	// 否	接口调用结束的回调函数（调用成功、失败都会执行）
}


/**
 * 拉取托管的微信群好友游戏数据时需要传入的对象
 */
export interface GetGroupStorageObject {
    shareTicket: string,	    //是	群转发对应的 shareTicket	
    keyList: Array<string>,		//是	要拉取的 key 列表	
    success?: { (data: Array<UserGameData>) } | void,	//否	接口调用成功的回调函数	
    fail?: Function | void,	    //否	接口调用失败的回调函数	
    complete?: Function | void,	//否	接口调用结束的回调函数（调用成功、失败都会执行）
}