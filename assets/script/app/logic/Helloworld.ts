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
        // set ENCRYPT_SIGN=SUhgr94BG
        // set ENCRYPT_KEY=Kj4V74X89
        console.log(Base.Base64.decode("SUhgr94BG")) 
        console.log(Base.Base64.decode(Base.Base64.decode("SUhgr94BG")))
    }


    protected start() {
        // console.log("asdadasdad" + this.sprite["tag"])
        let i = 0;
        Base.TimerManager.runLoopTimer(function () {
            Base.BroadcastManager.sendBroadcast("HELLO", i++);
        }, 0.02);
    }


    public HELLO(data) {
        // console.log("HELLOHELLOHELLOHELLO", data)
    }

}