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
        this.scheduleOnce(() => {
            this.Event.emit("HELLO", "Hello, this is a event message.");
        }, 1);

        // HttpUtil.HttpPost("http://localhost:7456/", null, (res) => {
        // }, true);

        // HttpUtil.HttpGet("http://localhost:7456/", null, (res) => {
        // }, true);

        // HttpUtil.HttpDownload("http://localhost:7456", "test.html", (err, path) => { 
        // });
        
        let message = new user.UserInfo();
        message.name = "ProtoMe";
        message.age = 23;
        message.sex = user.Sex.male;
        message.game = [new user.LoveGame()]
        let encode = user.UserInfo.encode(message);
        let decode = user.UserInfo.decode(encode.finish());
        console.log(message);
        console.log(encode);
        console.log(decode);
        console.log(exprEval.Parser.evaluate('6 * x', { x: 7 })) // 42); // 7
    }

    sayHello(data) {
        this.label.string = data.data;
    }

}