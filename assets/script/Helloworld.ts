import Base from "./base/Base";
import BroadcastComponent from "./base/component/BroadcastComponent";
import { HttpResponse } from "./base/network/HttpManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld2 extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    t = 0;

    private _broadcastManager: BroadcastComponent;

    onLoad() {
        this._broadcastManager = this.node.getComponent(BroadcastComponent);
        this.initReceiver();
        Base.Audio.playMusic("ding.wav");
        Base.SocketManager.open();
    }


    start() {
        this.node.runAction(cc.repeatForever(cc.sequence([cc.delayTime(0.01), cc.callFunc(function () {
            Base.BroadcastManager.sendBroadcast("SAY_HELLO_1", this.t++)
            Base.SocketManager.send("" + this.t++);
        }.bind(this))])))

        Base.Http.HTTP_GET("", null, function (response: HttpResponse) {
            this.label.string = response.event;
        }.bind(this));

        Base.Http.HTTP_POST("", null, null);

        let encode = Base.Base64.encode("测试Base64▲▼●◆■āáǎà");
        let decode = Base.Base64.decode(encode);
        console.log(encode, decode)
    }


    initReceiver() {
        let receiverDatas = [
            ["SAY_HELLO_1", this.SAY_HELLO_1.bind(this)],
            ["SAY_HELLO_2", this.SAY_HELLO_2.bind(this)],
        ]
        for (const receiverData of receiverDatas) {
            this._broadcastManager.newAndRegisterReceiver(receiverData[0], receiverData[1]);
        }
    }


    SAY_HELLO_1(data) {
        this.label.string = data;
        Base.SocketManager.send(data);
    }


    SAY_HELLO_2(data) {
        this.label.string = data;
    }
}
