import BaseComponent from "../../../base/BaseComponent";
import BASE from "../../../base/BASE";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HelloWorld extends BaseComponent {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    __receiversConfig = [
        ["HELLO"],
    ];


    protected onLoad() {
        super.onLoad();
    }


    protected start() {
        let i = 0;
        BASE.TimerManager.runLoopTimer(function () {
            BASE.BroadcastManager.sendBroadcast("HELLO", i++);
        }, 0.1);
    }


    public HELLO(data) {
        // console.log("BROADCAST_HELLO", data);
    }

}