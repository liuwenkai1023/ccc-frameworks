import { ShaderManager, ShaderType, ShaderTypeMap } from "../extension/shader/ShaderManager";

const { ccclass, property, disallowMultiple, requireComponent, executeInEditMode, menu } = cc._decorator;

const NeedUpdate = [ShaderType.Fluxay, ShaderType.WaveShader, ShaderType.Water, ShaderType.RainShader, ShaderType.FluxaySuper];

@ccclass
@disallowMultiple
@executeInEditMode
@requireComponent(cc.Sprite)
@menu("扩展组件/ShaderSprite")
export default class BaseShaderSprite extends cc.Component {

    @property({ visible: false })
    private _shader: ShaderType = ShaderType.Default;

    @property({ visible: false })
    private _mosaicSize: number = 10;

    @property({ visible: false })
    private _bluramount: number = 0.05;

    @property({ displayName: "着色器", type: cc.Enum(ShaderTypeMap) })
    get shader() { return this._shader; }
    set shader(type) {
        this._shader = type;
        this.applyShaderSettings();
    }

    @property({ displayName: "马赛克大小", step: 1, min: 1, visible: function () { return this._shader == ShaderType.Mosaic; } })
    set mosaicSize(mosaicSize) {
        mosaicSize = Math.floor(mosaicSize);
        if (this._mosaicSize != mosaicSize) {
            this._mosaicSize = mosaicSize;
            this.applyShaderSettings();
        }
    }
    get mosaicSize() {
        return this._mosaicSize;
    }

    @property({ displayName: "模糊系参数", step: 0.001, min: 0.001, max: 1, visible: function () { return this._shader == ShaderType.Blur || this._shader == ShaderType.GaussBlurs; } })
    set bluramount(bluramount) {
        bluramount = Math.floor(bluramount * 1000) / 1000;
        if (this._bluramount != bluramount) {
            this._bluramount = bluramount;
            this.applyShaderSettings();
        }
    }
    get bluramount() {
        return this._bluramount;
    }


    private sprite: cc.Sprite;

    private startTime = 0;


    protected start() {
        this.sprite = this.node.getComponent(cc.Sprite);
        this.applyShaderSettings();
    }


    protected update(dt) {
        let mat = (<any>this.sprite).getCurrMaterial();
        if (!mat) return;
        if (NeedUpdate.indexOf(this._shader) >= 0) {
            let deltaTime = new Date().getTime() - this.startTime;
            mat.setParamValue('time', deltaTime / 1000);
        }
    }


    private applyShaderSettings() {
        // console.log("shaderType:" + ShaderType[this._shader]);
        let mat = App.SingletonFactory.getInstance(ShaderManager).setShader(this.sprite, this._shader);
        if (!mat) return;
        switch (this._shader) {
            case ShaderType.Blur:
            case ShaderType.GaussBlurs:
                mat.setParamValue('bluramount', this.bluramount);
                break;
            case ShaderType.WaveShader:
                mat.setParamValue('iOffset', new cc.Vec2(0, 0.1));
                break;
            case ShaderType.Mosaic:
                mat.setParamValue('mosaicSize', this.mosaicSize);
                break;
            default:
                break;
        }
        this.startTime = new Date().getTime();
    }

    protected onDestroy() {
        CC_EDITOR && this.sprite && this.sprite.setState(0);
    }

}
