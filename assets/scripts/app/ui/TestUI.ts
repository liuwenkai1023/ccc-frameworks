import { ViewBase } from "../../base/mvc/ViewBase";
import HttpUtil from "../../base/utils/HttpUtil";
import { user } from "../data/person";

export class TestUI extends ViewBase {

    static UIName = "TestUI";
    static ResourcePath = "prefab/TestUI";

    private label: cc.Label;

    onLoad() {
        this.bindView("label", "testLabel", cc.Label);
        this.bindEvent("HELLO", this.sayHello.bind(this));
    }

    start() {

        /**
         * Event Test
         */
        this.scheduleOnce(() => { this.Event.emit("HELLO", "Hello, this is a event message."); }, 1);

        /**
         * HttpUtil Test
         */
        // HttpUtil.HttpPost("http://localhost:7456/", null, (res) => { }, true);
        // HttpUtil.HttpGet("http://localhost:7456/", null, (res) => { }, true);
        // HttpUtil.HttpDownload("http://localhost:7456", "test.html", (err, path) => { });

        /**
         * Protobuf Test
         */
        let userInfo = new user.UserInfo();
        userInfo.name = "ProtoMe";
        userInfo.age = 23;
        userInfo.sex = user.Sex.male;
        userInfo.game = [new user.LoveGame()]
        let arrbuf = user.UserInfo.encode(userInfo).finish();
        let decode = user.UserInfo.decode(arrbuf);
        console.log("userInfo", userInfo);
        console.log("arraybuffer", arrbuf);
        console.log("decode", decode);

        /**
         * Expression Evaluator Test
         */
        let result = exprEval.Parser.evaluate('6 * x', { x: 7 });// 42
        // 同 let result = ee.Parser.evaluate('6 * x', { x: 7 }); 
        console.log("result = ", result);
    }

    sayHello(data) {
        this.label.string = data.data;
    }

}