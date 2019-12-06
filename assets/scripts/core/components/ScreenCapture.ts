
const { ccclass, property, executeInEditMode, menu } = cc._decorator;

@ccclass
@menu("扩展组件/ScreenCapture")
export default class ScreenCapture extends cc.Component {

    @property(cc.Camera)
    camera: any = null;

    private renderTexture: cc.RenderTexture = null;
    private fullPath: string = null;


    start() {
        this.renderTexture = new cc.RenderTexture();
        // gfx.RB_FMT_D24S8
        // gfx.RB_FMT_S8
        // gfx.RB_FMT_D16
        this.renderTexture.initWithSize(cc.winSize.width, cc.winSize.height, (<any>cc).gfx.RB_FMT_S8);
        this.renderTexture.setPremultiplyAlpha(true);
        
    }


    /**
     * 同步截屏
     */
    async captureScreenAndSaveData(): Promise<string> {
        return await new Promise<string>(
            (resolve, reject) => {
                if (this.fullPath) {
                    resolve(this.fullPath);
                    return;
                }
                const fileName = "pic_share_invite.png";
                this.camera.targetTexture = this.renderTexture;
                this.camera["render"]();
                // this.renderTexture.setFlipY(false);
                let data = this.renderTexture.readPixels();
                let width = this.renderTexture.width;
                let height = this.renderTexture.height;
                let picData = this.filpYImage(data, width, height);
                if (CC_JSB) {
                    let fullPath = jsb.fileUtils.getWritablePath() + fileName;
                    if (jsb.fileUtils.isFileExist(fullPath)) {
                        jsb.fileUtils.removeFile(fullPath);
                    }
                    let success = jsb.saveImageData(picData, width, height, fullPath);
                    if (success) {
                        resolve(fullPath);
                        this.fullPath = fullPath;
                        cc.log("save image data success, file: " + fileName);
                    }
                    else {
                        reject("save image data failed!");
                        cc.error("save image data failed!");
                    }
                    return;
                }
                reject("save image data failed!");
            }
        );
    }


    /**
     * 反转图像数据
     */
    filpYImage(data, width, height) {
        let picData = new Uint8Array(width * height * 4);
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let start = srow * width * 4;
            let reStart = row * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                picData[reStart + i] = data[start + i];
            }
        }
        return picData;
    }

}
