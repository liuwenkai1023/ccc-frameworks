import Base from "./base/Base";
import { HttpResponse } from "./base/network/HttpManager";
import BroadcastComponent from "./base/components/BroadcastComponent";
import GaussBlurs from "./base/shader/shaders/GaussBlurs";
import OverlayShader from "./base/shader/shaders/OverlayShader";
import RainShader from "./base/shader/shaders/RainShader";
import WaveShader from "./base/shader/shaders/WaveShader";
import FileUtils from "./base/storage/FileUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    t = 0;
    time = 0;
    // set test(v, f) {
    //     this.t = v;
    //     console.log(v, f);
    // }
    private _broadcastManager: BroadcastComponent;
    // startTime: number;

    onLoad() {
        this._broadcastManager = this.node.getComponent(BroadcastComponent);
        this.initReceiver();
        Base.Audio.playMusic("ding.wav");
        Base.SocketManager.open();
        this.time = new Date().getTime();
        // FileUtils.instance().getDataFromFile(FileUtils.writeablePath + 'resources/json/data.json').then(data => {
        //     console.log("data =" + data);
        // }).catch(err => {
        //     console.error(err);
        // });
        // FileUtils.instance().saveFile("122222222222222222222222222222222222222", FileUtils.writeablePath + 'resources/json/data')
        // FileUtils.instance().renameFile(FileUtils.writeablePath + 'resources/json/data.json', FileUtils.writeablePath + 'resources/json/data')
        // console.error("创建" + FileUtils.instance().removeDirectory(FileUtils.writeablePath + 'resources/12313/123123122/', true))
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
        // console.log(data, new Date().getTime() - this.time);
        this.time = new Date().getTime();
    }


    SAY_HELLO_2(data) {
        this.label.string = data;
        // console.log(data, new Date().getTime() - this.time);
        this.time = new Date().getTime();
    }

}
