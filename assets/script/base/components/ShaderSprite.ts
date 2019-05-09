import { ShaderManager, ShaderType } from "../../base/extension/shader/ShaderManager";

const { ccclass, property, disallowMultiple, requireComponent, executeInEditMode } = cc._decorator;

const NeedUpdate = [ShaderType.Fluxay, ShaderType.WaveShader, ShaderType.Water, ShaderType.RainShader, ShaderType.FluxaySuper];

@ccclass
@disallowMultiple
@executeInEditMode
@requireComponent(cc.Sprite)
export default class BaseShaderSprite extends cc.Component {

    @property({ visible: false })
    private _shader: ShaderType = ShaderType.Default;

    @property({ type: cc.Enum(ShaderType) })
    get shader() { return this._shader; }
    set shader(type) {
        this._shader = type;
        this.applyShaderSettings();
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
        let mat = ShaderManager.instance().setShader(this.sprite, this._shader);
        if (!mat) return;
        switch (this._shader) {
            case ShaderType.Blur:
            case ShaderType.GaussBlurs:
                mat.setParamValue('bluramount', 0.05);
                break;
            case ShaderType.WaveShader:
                mat.setParamValue('iOffset', new cc.Vec2(0, 0.1));
                break;
            case ShaderType.Mosaic:
                mat.setParamValue('mosaicSize', 10);
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
