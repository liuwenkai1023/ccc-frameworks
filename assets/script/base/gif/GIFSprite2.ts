import GIF2 from "./GIF2";
import Base from "../Base";
import TimerComponent from "../components/TimerComponent";

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property, requireComponent, disallowMultiple, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
@disallowMultiple
@requireComponent(cc.Sprite)
export default class GIFSprite extends cc.Component {

    @property({ visible: false })
    private _path: cc.RawAsset = null;

    @property({ type: cc.RawAsset })
    get path() { return this._path; }
    set path(path) {
        this._path = path;
        this.clear();
        this.applayChange();
    }

    public sprite: cc.Sprite = null;

    public _inited: boolean;

    private _defaultSpriteFrame: cc.SpriteFrame;
    private _gif: GIF2;
    private _action: cc.ActionInterval;
    private _delays: Array<number>;
    private _index: number = 0;
    private _spriteFrames: Array<cc.SpriteFrame>;



    protected onLoad() {
        // this.addComponent(TimerComponent);
        this.sprite = this.node.getComponent(cc.Sprite);
        this._defaultSpriteFrame = this.sprite.spriteFrame;
        // this._timer = this.getComponent(TimerComponent);
        this.applayChange();
    }

    protected start() {
    }

    protected onDestroy() {
        this.sprite.spriteFrame = this._defaultSpriteFrame;
    }

    protected update(dt) {
        if (this._inited && CC_EDITOR) {
            let index = this._index++ % this._spriteFrames.length;
            let spriteFrame = this._spriteFrames[index];
            this.sprite.spriteFrame = spriteFrame, true;
            console.log(this.sprite.spriteFrame, spriteFrame, this.sprite.spriteFrame == spriteFrame);
        }
        if (this._inited == null || this._inited) return;
        if (this._gif && !this._spriteFrames) {
            this._gif.getSpriteFrame(this._index++);
        } else {
            this.inited();
        }
    }

    public setDefaultSpriteFrame(spriteFrame) {
        console.log("setDefaultSpriteFrame", spriteFrame);
        this.sprite.spriteFrame = spriteFrame, true;
    }

    private inited() {
        console.log("this.inited")
        this._gif = null;
        this._index = 0;
        this._inited = true;
        this._action = cc.repeatForever(
            cc.sequence(
                [
                    cc.delayTime(this._delays[this._index % this._spriteFrames.length] * 10 / 1000 > 0.02 ? this._delays[this._index % this._spriteFrames.length] * 10 / 1000 : 0.02), cc.callFunc(
                        function () {
                            this.sprite.spriteFrame = this._spriteFrames[this._index++ % this._spriteFrames.length], true;
                        }.bind(this)
                    )
                ]
            )
        );
        this.node.runAction(this._action.clone());
    }

    private applayChange() {
        console.log("applayChange");
        if (!this.path || this.path.toString().length == 0) {
            this._path = null;
            return;
        }
        cc.loader.load(this.path.toString(), function (err, result) {
            this._gif = new GIF2(
                this,
                result.buffer,
                function (delays, spriteFrames) {
                    this._delays = delays;
                    this._spriteFrames = spriteFrames;
                    console.log(this._delays, this._spriteFrames);
                }.bind(this)
            );
        }.bind(this));
    }

    private clear() {
        this.node.stopAllActions();
        this._gif = null;
        this._index = 0;
        this._inited = null;
        this._delays = null;
        this._spriteFrames = null;
    }

}
