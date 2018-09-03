import BroadcastComponent from "./base/component/BroadcastComponent";
import HttpManager from "./base/network/HttpManager";
import HttpResponse from "./base/network/HttpResponse";
import Utils from "./base/Utils";

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
        Utils._audioManager.playMusic("music_logo.mp3");
    }


    start() {
        this.node.runAction(cc.repeatForever(cc.sequence([cc.delayTime(0.01), cc.callFunc(function () {
            this._broadcastManager.sendBroadcast("SAY_HELLO_1", this.t++)
            // this._socketManager.send(this.t++);
        }.bind(this))])))
        HttpManager.HTTP_GET("", null, function (response: HttpResponse) {
            this.label.string = response.event;
        }.bind(this));
        HttpManager.HTTP_POST("", null, null);
        let encode = Utils._base64.encode("测试Base64");
        let decode = Utils._base64.decode(encode);
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
        // this.label.string = data;
        Utils._socketManager.send(data);
    }


    SAY_HELLO_2(data) {
        this.label.string = data;
    }
}
