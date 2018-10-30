import BaseComponent from "../../base/BaseComponent";
import Base from "../../base/Base";

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
        Base.TimerManager.runLoopTimer(function () {
            Base.BroadcastManager.sendBroadcast("HELLO", i++);
        }, 0.1);
    }


    public HELLO(data) {
        console.log("HELLOHELLOHELLOHELLO", data)
    }

}