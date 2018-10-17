import Base from "./Base";
import BroadcastComponent from "./components/BroadcastComponent";
import TimerComponent from "./components/TimerComponent";
import AudioManager from "./audio/AudioMananger";
import HttpManager from "./network/HttpManager";
import SocketManager from "./network/SocketManager";

/**
 * BaseComponent组件
 * 用户新建的组件脚本建立继承本组件
 * 当前组件里添加
 */
export default class BaseComponent extends cc.Component {
    
    // protected __httpManager: HttpManager;
    // protected __audioManager: AudioManager;
    // protected __socketManager: SocketManager;
    protected __timerManager: TimerComponent;
    protected __broadcastManager: BroadcastComponent;

    // get httpManager() {
    //     if (!this.__httpManager)
    //         this.__httpManager = Base.Http;
    //     return this.__httpManager;
    // }

    // get audioManager() {
    //     if (!this.__audioManager)
    //         this.__audioManager = Base.Audio;
    //     return this.__audioManager;
    // }

    // get socketManager() {
    //     if (!this.__socketManager)
    //         this.__socketManager = Base.SocketManager;
    //     return this.__socketManager;
    // }

    get timerManager() {
        if (!this.__timerManager)
            this.__timerManager = Base.registerTimerComponent(this.node);
        return this.__timerManager;
    }

    get broadcastManager() {
        if (!this.__broadcastManager)
            this.__broadcastManager = Base.BroadcastManager.registerBrocastComponent(this.node);
        return this.__broadcastManager;
    }


}