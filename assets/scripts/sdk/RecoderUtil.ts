/**
 * 分享参数
 */
export interface ShareParams {
    templateId?: string,
    title?: string,
    desc?: string,
    videoTopicList?: Array<string>
}

/**
 * 录屏工具类
 * 支持 百度/头条
 */
export default class RecorderUtil {

    private static _instance: RecorderUtil;

    private _recorder = null;
    private _videoPath: string = null;

    private _shareParams: ShareParams = {
        title: "分享标题",
        desc: "分享描述",
        templateId: "分享模版ID",
        videoTopicList: ["话题1", "话题2", "话题3", "话题4"]
    };

    get videoPath() {
        return this._videoPath;
    }

    get recording() {
        return this._recorder._recording;
    }

    get recorder() {
        return this._recorder;
    }

    get platform(): any {
        // 头条/百度
        return window[`tt`] || window[`swan`];
    }

    static getInstance() {
        if (!this._instance) {
            this._instance = new RecorderUtil();
        }
        return this._instance;
    }

    private constructor() {
        // 今日头条/百度
        if (this.platform) {
            // 初始化 recorder
            if (this.platform.getVideoRecorderManager) {
                this._recorder = this.platform.getVideoRecorderManager();
            } else if (this.platform.getGameRecorderManager) {
                this._recorder = this.platform.getGameRecorderManager();
            }
            if (!this._recorder) {
                return;
            }
            // 错误打印
            this._recorder.onError(errMsg => {
                console.error(errMsg);
            });
            // 退到后台
            App.Utils.EventManager.on(cc.game.EVENT_HIDE, () => {
                this.recording && this.recorder.pause();
            }, this);
            // 回到前台
            App.Utils.EventManager.on(cc.game.EVENT_HIDE, () => {
                this.recording && this.recorder.resume();
            }, this);
        } else {
            console.error("当前平台不支持使用录屏工具类");
        }
    }


    /**
     * 开始录屏
     * @param callback 开始录屏回调
     * @param stopCallback 自动结束录屏时回调
     */
    startRecord(callback?: (res) => void, stopCallback?: (res) => void) {
        console.warn("调用开始录屏");
        this.recorder && this.recorder.onStart(res => {
            console.warn("录屏开始", res);
            this.recorder._recording = true;
            this.recorder._st = new Date().getTime();
            callback && callback(res);
            this.recorder.resume();
        });
        // 需要考虑录屏超时自动结束的问题
        this.recorder.onStop(res => {
            console.warn("录屏结束(自动)", res);
            this.recorder._recording = false;
            this.recorder._st = 0;
            this._videoPath = res.videoPath;
            // fix 头条上recoder._recording状态不对！！
            stopCallback && setTimeout(() => {
                stopCallback(res);
            });
        });
        // 默认使用最大支持时长 300s
        this.recorder && this.recorder.start({ duration: 300 });
    }


    /**
     * 结束录屏
     * @param callback 结束录屏时回调
     */
    stopRecord(callback?: (res) => void) {
        console.warn("调用结束录屏");
        if (this.recorder) {
            this.recorder.resume();
            if (!this.recorder._recording) {
                console.warn("当前录制器不处于录制中...");
                callback && callback(null);
                return;
            }
            this.recorder.onStop(res => {
                console.warn("录屏结束", res);
                this._videoPath = res.videoPath;
                this.recorder._recording = false;
                this.recorder._st = 0;
                // fix 头条上recoder._recording状态不对！！
                callback && setTimeout(() => {
                    callback(res);
                });
            });
            this.recorder.stop();
        } else {
            callback && callback(null);
        }
    }


    /**
     * 分享录屏
     * @param isShowToast 是否展示toast
     * @param callback 分享结果回调
     * errCode 0成功 -1失败
     */
    shareVideo(isShowToast: boolean, callback: (errCode: number) => void) {
        if (this.platform && this._videoPath && this._videoPath.length > 0) {
            this.platform.shareAppMessage({
                channel: "video",
                templateId: this._shareParams.templateId,
                title: this._shareParams.title,
                desc: this._shareParams.desc,
                extra: {
                    videoPath: this._videoPath, // 可替换成录屏得到的视频地址
                    videoTopics: this._shareParams.videoTopicList
                },
                success: () => {
                    console.log("分享视频成功");
                    callback && callback(0);
                },
                fail: (e) => {
                    console.log("分享视频失败:'" + e.errMsg + "'", e);
                    switch (e.errMsg) {
                        case "shareAppMessage:fail video file is too short":
                            isShowToast && this.showToast(`录制时间太短~`);
                            break;
                        case "shareAppMessage:cancel":
                        case "shareAppMessage:fail publish fail":
                            // isShowToast && this.showToast(`分享取消`);
                            break;
                        default:
                            if (e.errMsg.match(`shareAppMessage:fail unknown error on method onFail`)) {
                                //    this.showToast(`录制时间太短~`);
                            } else {
                                isShowToast && this.showToast(`录制时间太短~`);
                            }
                            break;
                    }
                    callback && callback(-1);
                }
            });
        } else {
            this.showToast("录制时间太短~");
        }
    }


    showToast(title: string, duration: number = 2000) {
        this.platform && this.platform.showToast({
            icon: 'none',
            title: title,
            duration: duration,
            success(res) {
                console.log(`${res}`);
            },
            fail(res) {
                console.log(`showToast调用失败`);
            }
        });
    }

}

window['RecorderUtil'] = RecorderUtil.getInstance();