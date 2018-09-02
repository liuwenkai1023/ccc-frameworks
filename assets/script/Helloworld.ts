import AudioManager from "./base/AudioMananger";
import SocketManager from "./base/SocketManager";
import BroadcastComponent from "./base/BroadcastComponent";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld2 extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    t = 0;

    private _broadcastManager: BroadcastComponent;
    private _audioManager: AudioManager;
    _socketManager: SocketManager;


    onLoad() {
        this._broadcastManager = this.node.getComponent(BroadcastComponent);
        this._socketManager = SocketManager.getInstance(null);
        this._audioManager = AudioManager.getInstance()
        this.initReceiver();
        this._audioManager.playMusic("music_logo.mp3");
    }


    start() {
        this.node.runAction(cc.repeatForever(cc.sequence([cc.delayTime(0.01), cc.callFunc(function () {
            this._broadcastManager.sendBroadcast("SAY_HELLO_1", this.t++)
            // this._socketManager.send(this.t++);
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
        // this.label.string = data;
        this._socketManager.send(data);
    }


    SAY_HELLO_2(data) {
        this.label.string = data;
    }
}
