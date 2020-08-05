import { ViewBase } from "../../base/core/mvc/ViewBase";
import { HttpUtil } from "../../base/utils/HttpUtil";
import { user } from "../data/proto/person";
import { DataManager } from "../../base/core/data/DataManager";
import { AudioManager } from "../../base/core/audio/AudioMananger";
import { LocalStorageManager } from "../../base/core/storage/StorageManager";
import { TimerManager } from "../../base/core/timer/TimerManager";
import { Base64 } from "../../base/utils/Base64";
import { FGUIUtil } from "../../base/extensions/fgui/FGUIUtil";
import { TestFGUI } from "./TestFGUI";


export class TestUI extends ViewBase {

    static UIName = "TestUI";
    static ResourcePath = "prefabs/TestUI";

    private label: cc.Label;

    onLoad() {
        this.bindView("label", "testLabel", cc.Label);
        this.bindEvent("HELLO", this.sayHello.bind(this));
    }

    start() {
        console.log("TestUI:测试代码");
        this.Test();
        this.initFGUI();
        FGUIUtil.getUI(TestFGUI).show();
    }

    initFGUI() {
        fgui.addLoadHandler();
        fgui.UIConfig.modalLayerColor = new cc.Color(0, 0, 0, 180);
        fgui.GRoot.create();
        fgui.GRoot.inst.node.zIndex = 99;
    }

    Test() {
        // /**
        //  * Event Test
        //  */
        // this.scheduleOnce(() => { this.Event.emit("HELLO", "Hello, this is a event message."); }, 1);

        // /**
        //  * HttpUtil Test
        //  */
        // HttpUtil.HttpPost("http://localhost:7456/", null, (res) => { });
        // HttpUtil.HttpGet("http://localhost:7456/", null, (res) => { });
        // HttpUtil.HttpDownload("http://localhost:7456", "test.html", (err, path) => { });

        // /**
        //  * Protobuf Test
        //  */
        // let userInfo = new user.UserInfo();
        // userInfo.name = "ProtoMe";
        // userInfo.age = 23;
        // userInfo.sex = user.Sex.male;
        // userInfo.game = [new user.LoveGame()]
        // let arrbuf = user.UserInfo.encode(userInfo).finish();
        // let decode = user.UserInfo.decode(arrbuf);
        // console.log("userInfo", userInfo);
        // console.log("arraybuffer", arrbuf);
        // console.log("decode", decode);

        // /**
        //  * Expression Evaluator Test
        //  */
        // let result = exprEval.Parser.evaluate('6 * x', { x: 7 });
        // console.log("result = ", result);

        // /**
        //  * Data Manager Test
        //  */
        // let dataMamager = App.SingletonFactory.getInstance(DataManager);
        // dataMamager.loadJsonData("config/Sounds", "Sounds", true, (config) => {
        //     console.log(config);

        //     /**
        //      * AudioManager Test
        //      */
        //     let bgm = dataMamager.getDataByNameAndId("Sounds", "MUSIC_BGM");
        //     App.SingletonFactory.getInstance(AudioManager).playMusic(bgm[`Name`]);
        // });

        // /**
        //  * Storage Test
        //  */
        // let localStorageManager = App.SingletonFactory.getInstance(LocalStorageManager);
        // localStorageManager.setObject("StorageTest", { x: 100, y: 100, name: "Storage Test" });
        // console.log(localStorageManager.getObject("StorageTest"));

        // /**
        //  * Timer Test
        //  */
        // let s = 0;
        // let handler = App.SingletonFactory.getInstance(TimerManager).runLoopTimer((dt: number) => {
        //     console.log("Timer:", ++s, " dt =", dt);
        //     s == 10 && App.SingletonFactory.getInstance(TimerManager).removeTimer(handler);
        // }, 1);

        // /**
        //  * Gzip Test
        //  */
        // let encode = pako.gzip(
        //     `
        //     去ABCDEFGHIJKLMNOPQRSTUVWXYZ！
        //     我ABCDEFGHIJKLMNOPQRSTUVWXYZ@
        //     恶ABCDEFGHIJKLMNOPQRSTUVWXYZ#
        //     人ABCDEFGHIJKLMNOPQRSTUVWXYZ￥
        //     他ABCDEFGHIJKLMNOPQRSTUVWXYZ%
        //     有ABCDEFGHIJKLMNOPQRSTUVWXYZ……
        //     uABCDEFGHIJKLMNOPQRSTUVWXYZ&
        //     iABCDEFGHIJKLMNOPQRSTUVWXYZ*
        //     哦ABCDEFGHIJKLMNOPQRSTUVWXYZ（`
        // );
        // let decode2 = pako.ungzip(encode, { to: 'string' });
        // let decode3 = pako.ungzip(encode);
        // console.log(decode2);
        // console.log("压缩前大小:", decode3.length);
        // console.log("压缩后大小:", encode.length);

        // /**
        //  * Base64 Test
        //  */
        // let encodeB = Base64.encode("去微软推哦怕");
        // let decodeB2 = Base64.decode(encodeB);
        // console.log(encodeB, '=>', decodeB2);

    }

    sayHello(data) {
        this.label.string = data;
    }

}