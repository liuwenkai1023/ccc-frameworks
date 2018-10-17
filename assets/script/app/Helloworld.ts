import BaseComponent from "../base/BaseComponent";
import Base from "../base/Base";
import { HttpResponse } from "../base/network/HttpManager";


const { ccclass, property } = cc._decorator;

@ccclass
export default class HelloWorld extends BaseComponent {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Sprite)
    sprite: cc.Sprite = null;
    time: number;


    onLoaded() {
        this.initReceiver();
        this.time = new Date().getTime();
        Base.AudioManager.playMusic("ding.wav");
        Base.SocketManager.open();
    }


    start() {
        this.node.runAction(cc.repeatForever(cc.sequence([cc.delayTime(0.01), cc.callFunc(function () {
            this.broadcastManager.sendBroadcast("SAY_HELLO_1", this.t++)
            console.log(this.broadcastManager)
            Base.SocketManager.send("" + this.t++);
        }.bind(this))])))

        Base.HttpManager.HTTP_GET("", null, function (response: HttpResponse) {
            this.label.string = response.event;
        }.bind(this));

        let encode = Base.Base64.encode("测试Base64▲▼●◆■āáǎà");
        let decode = Base.Base64.decode(encode);
        
        console.log(encode, decode);
    }


    initReceiver() {
        let receiverDatas = [
            ["SAY_HELLO_1", this.SAY_HELLO_1.bind(this)],
            ["SAY_HELLO_2", this.SAY_HELLO_2.bind(this)],
        ]
        for (const receiverData of receiverDatas) {
            this.broadcastManager.newAndRegisterReceiver(receiverData[0], receiverData[1]);
        }
    }


    SAY_HELLO_1(data) {
        this.label.string = data;
        Base.SocketManager.send(data);
        this.time = new Date().getTime();
    }


    SAY_HELLO_2(data) {
        this.label.string = data;
        this.time = new Date().getTime();
    }

}
