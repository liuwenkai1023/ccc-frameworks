/**
 * Timer组件
 */
export default class TimerComponent extends cc.Component {

    //timer回调集合
    private _timers = [];

    /**
     * Timer延迟执行
     * @param handler 回调
     * @param delayTime 延迟时间
     */
    public RunDelayTimer(handler: (dt: number) => void, delayTime: number = 0.01) {
        this._schedule(handler, 0, 1, delayTime);
    }


    /**
     * Timer循环执行
     * @param handler 回调
     * @param intervlTime 间隔时间
     */
    public RunLoopTimer(handler: (dt: number) => void, intervlTime: number = 0.01) {
        this._schedule(handler, intervlTime, NaN, 0);
    }


    /**
     * 移除计时器Timer
     * @param handler 回调
     */
    public RemoveTimer(handler: (dt: number) => void) {
        this._unschedule(handler);
    }


    /**
     * Timer开始调度
     * @param handler 回调
     * @param interval 间隔时间
     * @param repeat 重复次数
     * @param delay 间隔时间
     */
    private _schedule(handler, interval, repeat, delay) {
        interval = interval || 0;
        repeat = isNaN(repeat) ? cc.macro.REPEAT_FOREVER : repeat;
        delay = delay || 0;
        cc.director.getScheduler().schedule(handler, this.node, interval, repeat, delay, false);
        this._timers.push(handler)
    }


    /**
     * 移除调度
     * @param handler 
     */
    private _unschedule(handler) {
        if (!handler) return;
        cc.director.getScheduler().unschedule(handler, this.node);
    }


    /**
     * 初始化timers数组
     */
    public onLoad() {
        this._timers = [];
    }


    /**
     * 组件销毁是移除所有Timer
     */
    public onDestroy() {
        for (const key in this._timers) {
            if (this._timers.hasOwnProperty(key) && this._timers[key] != null) {
                this.RemoveTimer(this._timers[key]);
            }
        }
    }

}