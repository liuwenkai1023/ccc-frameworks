import BaseComponent from "../../../base/BaseComponent";
import BASE from "../../../base/BASE";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HelloWorld extends BaseComponent {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    __receiversData = [
        ["HELLO"],
    ];

    protected onLoad() {
        super.onLoad();
    }

    protected start() {
        let i = 0;
        BASE.TimerManager.runLoopTimer(function () {
            BASE.BroadcastManager.sendBroadcast("HELLO", i++);
        }, 0.01);
        // console.time("1")
        BASE.UIManager.showUI("TestUI");
        BASE.UIManager.showUI("TestUI");
        BASE.UIManager.showUI("TestUI");
        // console.timeEnd("1")

    }

    protected onDestroy() {
        BASE.UIManager.destoryUI("TestUI");
    }

    public HELLO(data) {

        // if (data == 20) {
        // console.log(data);
        //     console.time("2")
        //     BASE.UIManager.closeUI("TestUI");
        //     console.timeEnd("2")
        // }

        // if (data % 100 == 0) {
        // console.log(data);
        //     console.time("3")


        // }
        this.node.getChildByName("label").getComponent(cc.Label).string = data + "?"
        if (data == 100) {
            BASE.UIManager.destoryUI("TestUI");
            // BASE.UIManager.closeUI("TestUI");
        } else if (data < 100) {
            BASE.UIManager.showUI("TestUI", data + "?");
        }
        //     console.log(data);
        //     console.time("4")
        //     BASE.UIManager.closeUI("TestUI");
        //     console.timeEnd("4")
        // }

        // if (data == 100) {
        //     console.log(data);
        //     console.time("5")
        //     BASE.UIManager.showUI("TestUI");
        //     console.timeEnd("5")
        // }

        // if (data == 120) {
        //     console.log(data);
        //     console.time("6")
        //     BASE.UIManager.closeUI("TestUI");
        //     console.timeEnd("6")
        // }

        // if (data == 150) {
        //     console.log(data);
        //     console.time("7")
        //     BASE.UIManager.showUI("TestUI");
        //     console.timeEnd("7")
        // }

        // if (data == 200) {
        //     console.time("8")
        //     BASE.UIManager.destoryUI("TestUI");
        //     console.timeEnd("8")
        // }


        // console.log("BROADCAST_HELLO", 1);
    }

}