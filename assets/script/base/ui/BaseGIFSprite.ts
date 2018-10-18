import GIF from "./gif/GIF";

const { ccclass, property, requireComponent, disallowMultiple, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
@disallowMultiple
@requireComponent(cc.Sprite)
export default class BaseGIFSprite extends cc.Component {

    @property({ visible: false })
    private _defaultSpriteFrame: cc.SpriteFrame;

    @property({ visible: false })
    private _path: cc.RawAsset = null;
    _oldTime: number;

    @property({ type: cc.RawAsset })
    set path(path) {
        if (!path || (path && path.toString().length == 0)) {
            return;
        }
        this._path = path;
        this.clear();
        this.applayChange();
    }

    get path() { return this._path; }

    public sprite: cc.Sprite = null;
    public _inited: boolean;

    private _length: number = 0;
    private _gif: GIF;
    private _action: cc.ActionInterval;
    private _delays: Array<number>;
    private _index: number = 0;
    private _spriteFrames: Array<cc.SpriteFrame>;


    protected onLoad() {
        this.sprite = this.node.getComponent(cc.Sprite);
        this._defaultSpriteFrame = this.sprite.spriteFrame;
    }


    protected start() {
        // let sT = new Date().getTime();
        this.applayChange();
        // let eT = new Date().getTime();
        // console.log("end", eT);
    }

    protected onDestroy() {
        this.sprite.spriteFrame = this._defaultSpriteFrame;
    }

    protected update(dt) {
        // console.log("update(dt):" + (new Date().getTime() - this._oldTime) + "ms");
        // this._oldTime = new Date().getTime();
        if (this._inited && CC_EDITOR) {
            let index = this._index++ % this._spriteFrames.length;
            let spriteFrame = this._spriteFrames[index];
            this.sprite.spriteFrame = spriteFrame, true;
            console.log(this.sprite.spriteFrame, spriteFrame, this.sprite.spriteFrame == spriteFrame);
        }
        if (this._inited == null || this._inited) return;
        if (this._gif && this._spriteFrames && this._spriteFrames.length < this._length) {
            this._gif.getSpriteFrame(this._spriteFrames.length);
        }
        // else {
        //     this.inited();
        // }
    }

    public setDefaultSpriteFrame(spriteFrame) {
        // console.log("setDefaultSpriteFrame", spriteFrame);
        this.sprite.spriteFrame = spriteFrame, true;
    }


    /**
     * 初始化完成
     */
    private inited() {
        this._gif = null;
        this._action = cc.repeatForever(
            cc.sequence(
                [
                    cc.delayTime(
                        this._delays[this._index % this._length >= this._spriteFrames.length ? this._spriteFrames.length - 1 : this._index % this._length] * 10 / 1000 > 0.02 ?
                            this._delays[this._index % this._length >= this._spriteFrames.length ? this._spriteFrames.length - 1 : this._index % this._length] * 10 / 1000 : 0.02
                    ),
                    cc.callFunc(
                        function () {
                            this.sprite.spriteFrame = this._spriteFrames[this._index++ % this._spriteFrames.length], true;
                        }.bind(this)
                    )
                ]
            )
        );
        this.node.runAction(this._action.clone());
    }


    /**
     * 应用更改
     */
    private async applayChange() {
        // await new Promise((resolve) => {
        cc.loader.load(this.path.toString(), async function (err, result) {
            // 传入的Message
            let gifMessage: GIFMessage = {
                target: this,
                buffer: result.buffer,
                initOneSpriteFrameFunc: function (data) {
                    this._delays = data.delays;
                    this._spriteFrames = data.spriteFrames;
                    this._length = data.length;
                    if (data.spriteFrames.length == 1) {
                        this.setDefaultSpriteFrame(data.spriteFrames[0]);
                        this._inited = false;
                        this.inited();
                    }
                }.bind(this),
                initFinishedFunc: function (data) {
                    this._delays = data.delays;
                    this._spriteFrames = data.spriteFrames;
                    // this.inited();
                    this._inited = true;
                }.bind(this)
            }
            this._gif = new GIF(gifMessage);
        }.bind(this));
        //     resolve();
        // });
    }


    /**
     * 清空数据
     */
    private clear() {
        this.node.stopAllActions();
        this._gif = null;
        this._index = 0;
        this._inited = null;
        this._delays = null;
        this._spriteFrames = null;
    }

}


/**
 * GIFMessage消息传递接口
 */
export interface GIFMessage {
    target: BaseGIFSprite,
    buffer: ArrayBuffer,
    initOneSpriteFrameFunc: {
        (
            data: {
                delays: Array<number>,
                spriteFrames: Array<cc.SpriteFrame>,
                length: number
            }
        )
    },
    initFinishedFunc: {
        (
            data: {
                delays: Array<number>,
                spriteFrames: Array<cc.SpriteFrame>,
                length: number
            }
        )
    }

}