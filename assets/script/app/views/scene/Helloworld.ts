import BaseComponent from "../../../base/BaseComponent";
import BASE from "../../../base/BASE";
import { HotUpdateEventType } from "../../../base/hotupdate/HotUpdate";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HelloWorld extends BaseComponent {

    @property(cc.Sprite)
    sprite: cc.Sprite = null;

    __receiversData = [
        [HotUpdateEventType[HotUpdateEventType.HOT_NEED]],
        [HotUpdateEventType[HotUpdateEventType.HOT_UPDATING]],
    ];

    protected onLoad() {
        super.onLoad();
    }

    protected start() {
        BASE.UIManager.showUI("TestUI");
        BASE.UIManager.showUI("TestUI");
        BASE.UIManager.showUI("TestUI");
    }

    protected onDestroy() {
        BASE.UIManager.destoryUI("TestUI");
    }

    public HOT_NEED(data) {
        this.node.getChildByName("shade").active = true;
        console.log("1秒后开始进行热更新")
        this.scheduleOnce(() => {
            this.broadcastManager.sendBroadcast(HotUpdateEventType[HotUpdateEventType.START_UPDATE], null)
        }, 1)
    }

    public async HOT_UPDATING(data) {
        await 0;
        let event = data;
        let format = '总下载进度:%s\%, 文件下载:%d/%d, 当前文件下载进度:%s\%,  已下载字节:%d/%d, %s';
        console.log(
            cc.js.formatStr(
                format,
                (event.getPercent() * 100).toFixed(2),
                event.getDownloadedFiles(),
                event.getTotalFiles(),
                (event.getPercentByFile() * 100).toFixed(2),
                event.getDownloadedBytes(),
                event.getTotalBytes(),
                event.getMessage()
            )
        );
    }

}