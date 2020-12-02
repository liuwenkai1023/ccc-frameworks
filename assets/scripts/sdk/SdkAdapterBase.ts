import RecorderUtil from "./RecoderUtil";

export enum ErrorCode {
    SUCCESS = 0,
    USER_CANCEL = -1,
    ERROR_OCCURRED = -2,
}

export interface CallbackHandle { (result: { errCode: number, data?: any, msg?: string }): void; }

export abstract class SdkAdapterBase {

    /**
     * 是否支持录屏，默认为不支持
     */
    protected _isSupportRecord: boolean = false;
    get isSupportRecord() {
        return this._isSupportRecord;
    }

    /**
     * 一般在初始化数据配置完成时调用
     */
    abstract inited();

    /**
     * 打开网页地址
     * @param url 
     */
    abstract openURL(url: string);

    /**
     * 打开外部应用
     * @param packageName 
     */
    abstract openApp(packageName: string);

    /**
    * 振动
    * @param type 0短振动 1长振动
    * @param duration 持续时间(仅在Android平台生效)
    */
    abstract vibrate(type: number, duration?: number)

    /**
     * 复制文本到剪切板
     * @param text 
     */
    abstract copyToClipboard(text: string);

    /**
     * 展示插屏广告
     */
    abstract showBoxAd();

    /**
     * 展示插屏广告
     */
    abstract showInsertAd();

    /**
     * 展示横幅广告
     * @param isShow 
     */
    abstract showBannerAd(isShow: boolean);

    /**
     * 展示激励视频广告
     * @param videoId 
     * @param callback 
     */
    abstract showVideoAd(videoId: string, callback: CallbackHandle);

    /**
     * 开始录屏
     * @param callback 开始录屏回调
     * @param stopCallback 自动停止录屏回调
     */
    startRecord(callback: (res) => void, stopCallback: (res) => void) {
        this.isSupportRecord && RecorderUtil.getInstance().startRecord(callback, stopCallback);
    }

    /**
     * 结束录屏
     * @param callback 结束录屏回调
     */
    stopRecord(callback: (res) => void) {
        this.isSupportRecord && RecorderUtil.getInstance().stopRecord(callback);
    }

    /**
     * 分享录屏
     * @param needShowToast 是否需要失败提示
     * @param callback 分享结果回调
     */
    shareVideo(needShowToast: boolean, callback: (code: number) => void) {
        this.isSupportRecord && RecorderUtil.getInstance().shareVideo(needShowToast, callback);
    }

    /**
     * 调用Java静态方法(Android)
     * @param className 类全名
     * @param methodNmae 方法名
     * @param paramType Java类型签名 
     * int     -> I
     * float   -> F
     * boolean -> Z 
     * string  -> Ljava/lang/String;
     * @param params 参数
     */
    protected callJavaStaticFunc(className: string, methodNmae: string, paramTypeSignatures: string, ...params) {
        if (cc.sys.isNative && cc.sys.platform == cc.sys.ANDROID) {
            return jsb.reflection.callStaticMethod(className, methodNmae, paramTypeSignatures, ...params);
        }
    }


    /**
     * 调用OC静态方法(IOS)
     * @param className 类全名
     * @param methodNmae 方法名
     * @param params 参数
     */
    protected callOcStaticFunc(className: string, methodNmae: string, ...params) {
        if (cc.sys.isNative && (cc.sys.platform == cc.sys.IPHONE || cc.sys.platform == cc.sys.IPAD)) {
            return jsb.reflection.callStaticMethod(className, methodNmae, ...params);
        }
    }
}