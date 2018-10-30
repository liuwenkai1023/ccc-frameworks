
import HotUpdatePanelComponent from "./HotUpdatePanelComponent";
import BaseComponent from "../BaseComponent";
const { ccclass, property, disallowMultiple } = cc._decorator;

@ccclass
@disallowMultiple
export default class HotUpdateCompont extends BaseComponent {

    @property({ type: cc.Asset, displayName: "热更新清单文件", tooltip: "manifestUrl:cc.Node" })
    manifestUrl: cc.Asset = null;

    @property({ type: HotUpdatePanelComponent, displayName: "热更新Panel组件", tooltip: "HotUpdatePanelComponent" })
    panel: HotUpdatePanelComponent = null;

    @property({ type: cc.Node, displayName: "热更新UI节点", tooltip: "cc.Node" })
    updateUI: cc.Node = null;

    private _updating: boolean = false;
    private _canRetry: boolean = false;
    private _storagePath: string = '';
    private _assetManager: any = null;
    private _failCount: number = null;
    private _checkListener: any = null;
    private _updateListener: any = null;


    // 用于初始化
    protected onLoad() {
        super.onLoad();
        //只能在Native中使用热更新
        if (!cc.sys.isNative) {
            return;
        }
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'remote-assets');
        console.log('Storage path for remote asset : ' + this._storagePath);

        this._assetManager = new jsb.AssetsManager(this.manifestUrl, this._storagePath, this.versionCompareHandle);
        var panel = this.panel;

        //设置验证回调，但我们还没有md5检查函数，所以只打印一些消息
        //如果验证通过，返回true，否则返回false
        this._assetManager.setVerifyCallback(function (path, asset) {
            //当asset被压缩时，我们不需要检查它的md5，因为zip文件已经被删除了
            var compressed = asset.compressed;
            // 检索正确的md5值。
            var expectedMD5 = asset.md5;
            // asset路径是相对路径，路径是绝对路径.
            var relativePath = asset.path;
            // asset文件的大小，但该值可能不存在。
            var size = asset.size;
            if (compressed) {
                panel.info.string = "Verification passed : " + relativePath;
                return true;
            }
            else {
                panel.info.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
                return true;
            }
        });

        this.panel.info.string = 'Hot update is ready, please check or directly update.';

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            //当并发任务太多时，一些Android设备可能会减慢下载进程。
            //数值可能不准确，请多做测试，找出最适合你的游戏。
            this._assetManager.setMaxConcurrentTask(2);
            this.panel.info.string = "Max concurrent tasks count have been limited to 2";
        }

        this.panel.fileProgress.progress = 0;
        this.panel.byteProgress.progress = 0;
    }


    /**
     * 设置你自己的版本比较处理器，版本和B是字符串版本
     * 如果返回值大于0,versionA大于B，
     * 如果返回值为0,versionA = B，
     * 如果返回值小于0，则versionA小于B。
     * @param versionA 
     * @param versionB 
     */
    private versionCompareHandle(versionA, versionB) {
        cc.log("JS Custom Version Compare: version A is " + versionA + ', version B is ' + versionB);
        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        else {
            return 0;
        }
    };


    /**
     * 检查版本事件回调处理
     * @param event 
     */
    public checkCb(event) {
        cc.log('Code: ' + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.panel.info.string = "No local manifest file found, hot update skipped.";
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.panel.info.string = "Fail to download manifest file, hot update skipped.";
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.panel.info.string = "Already up to date with the latest remote version.";
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.panel.info.string = 'New version found, please try to update.';
                this.panel.checkBtn.active = false;
                this.panel.fileProgress.progress = 0;
                this.panel.byteProgress.progress = 0;
                break;
            default:
                return;
        }

        this._assetManager.setEventCallback(null);
        this._checkListener = null;
        this._updating = false;
    }


    /**
     * 热更事件回调处理
     * @param event 
     */
    public updateCb(event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.panel.info.string = 'No local manifest file found, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.panel.byteProgress.progress = event.getPercent();
                this.panel.fileProgress.progress = event.getPercentByFile();

                this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                this.panel.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();

                var msg = event.getMessage();
                if (msg) {
                    this.panel.info.string = 'Updated file: ' + msg;
                    cc.log(event.getPercent() / 100 + '% : ' + msg);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.panel.info.string = 'Fail to download manifest file, hot update skipped.';
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.panel.info.string = 'Already up to date with the latest remote version.';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                this.panel.info.string = 'Update finished. ' + event.getMessage();
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                this.panel.info.string = 'Update failed. ' + event.getMessage();
                this.panel.retryBtn.active = true;
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                this.panel.info.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.panel.info.string = event.getMessage();
                break;
            default:
                break;
        }

        if (failed) {
            this._assetManager.setEventCallback(null);
            this._updateListener = null;
            this._updating = false;
        }

        if (needRestart) {
            this._assetManager.setEventCallback(null);
            this._updateListener = null;
            //预先设置清单的搜索路径
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._assetManager.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            //此值将在游戏启动时被检索并附加到默认搜索路径，
            //请参考samples/js-tests/main.js。用于详细使用。
            // ! ! !重新添加主搜索路径。js是非常重要的，否则新的脚本不会生效。
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    }



    /**
     * 重试
     */
    public retry() {
        if (!this._updating && this._canRetry) {
            this.panel.retryBtn.active = false;
            this.panel.info.string = 'Retry failed Assets...';
            this._canRetry = false;
            this._assetManager.downloadFailedAssets();
        }
    }



    /**
     * 检查更新
     */
    public checkUpdate() {
        if (this._updating) {
            this.panel.info.string = 'Checking or updating ...';
            return;
        }
        if (this._assetManager.getState() === jsb.AssetsManager.State.UNINITED) {
            // Resolve md5 url
            var url = this.manifestUrl.nativeUrl;
            if (cc.loader.md5Pipe) {
                url = cc.loader.md5Pipe.transformURL(url);
            }
            this._assetManager.loadLocalManifest(url);
        }
        if (!this._assetManager.getLocalManifest() || !this._assetManager.getLocalManifest().isLoaded()) {
            this.panel.info.string = 'Failed to load local manifest ...';
            return;
        }
        this._assetManager.setEventCallback(this.checkCb.bind(this));

        this._assetManager.checkUpdate();
        this._updating = true;
    }


    /**
     * 开始进行热更
     */
    public hotUpdate() {
        if (this._assetManager && !this._updating) {
            this._assetManager.setEventCallback(this.updateCb.bind(this));

            if (this._assetManager.getState() === jsb.AssetsManager.State.UNINITED) {
                // Resolve md5 url
                var url = this.manifestUrl.nativeUrl;
                if (cc.loader.md5Pipe) {
                    url = cc.loader.md5Pipe.transformURL(url);
                }
                this._assetManager.loadLocalManifest(url);
            }

            this._failCount = 0;
            this._assetManager.update();
            this.panel.updateBtn.active = false;
            this._updating = true;
        }
    }


    /**
     * 展示热更新界面的UI
     */
    public show() {
        if (this.updateUI.active === false) {
            this.updateUI.active = true;
        }
    }


    protected onDestroy() {
        if (this._updateListener) {
            this._assetManager.setEventCallback(null);
            this._updateListener = null;
        }
    }

}
