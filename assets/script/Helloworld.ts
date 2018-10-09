import Base from "./base/Base";
import { HttpResponse } from "./base/network/HttpManager";
import BroadcastComponent from "./base/components/BroadcastComponent";
import GaussBlurs from "./base/shader/shaders/GaussBlurs";
import OverlayShader from "./base/shader/shaders/OverlayShader";
import RainShader from "./base/shader/shaders/RainShader";
import WaveShader from "./base/shader/shaders/WaveShader";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Sprite)
    sprite: any = null;

    t = 0;

    private _broadcastManager: BroadcastComponent;
    startTime: number;

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
        console.log(encode, decode);
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

    GaussBlurs() {
        this.startTime = new Date().getTime();
        Base.ShaderManager.setShader(this.sprite, "FluxaySuper").setParamValue('bluramount', 0.1);
    }
    overlay() {
        this.startTime = new Date().getTime();
        Base.ShaderManager.setShader(this.sprite, "OverlayShader");
    }
    rainheart() {
        this.startTime = new Date().getTime();
        let mat = Base.ShaderManager.setShader(this.sprite, "RainShader");
    }
    wave() {
        this.startTime = new Date().getTime();
        Base.ShaderManager.setShader(this.sprite, "WaveShader").setParamValue('iOffset', new cc.Vec2(0, 0.1));
    }

    update(dt) {
        let mat = this.sprite.getCurrMaterial();
        if (!mat) {
            return;
        }
        if (["RainShader", "WaveShader", "FluxaySuper"].indexOf(mat.name) > -1) {
            let now = new Date().getTime();
            let time = (now - this.startTime) / 1000;
            mat.setParamValue('time', time);
        }
    }
}
