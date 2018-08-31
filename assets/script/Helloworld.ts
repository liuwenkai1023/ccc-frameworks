import BroadcastManager from "./base/BroadcastManager";
import AudioManager from "./base/AudioMananger";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld2 extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    t = 0;

    private _broadcastManager: BroadcastManager;
    private _audioManager: AudioManager;

    onLoad() {
        this._broadcastManager = this.node.getComponent(BroadcastManager);
        this._audioManager = AudioManager.getInstance()
        this.initReceiver();
    }

    start() {
        // init logic

        this._audioManager.playMusic("music_logo.mp3");

        this.node.on("test", function () {
            this.label.string = this.t++;
        }.bind(this))

        this.node.runAction(cc.repeatForever(cc.sequence([cc.delayTime(0.02), cc.callFunc(function () {
            this._broadcastManager.sendBroadcast("SAY_HELLO_1", "Hello " + this.t++);
            // this.node.emit("test")
        }.bind(this))])))
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
    }

    SAY_HELLO_2(data) {
        this.label.string = data;
    }
}
