import ShaderManager, { ShaderType } from "./ShaderManager";

const { ccclass, property, requireComponent, executeInEditMode } = cc._decorator;

const NeedUpdate = [ShaderType.Fluxay, ShaderType.FluxaySuper];

@ccclass
@executeInEditMode
@requireComponent(cc.Sprite)
export default class ShaderComponent extends cc.Component {

    @property({ type: cc.Enum(ShaderType) })
    private _shader: ShaderType = ShaderType.FluxaySuper;

    @property({ type: cc.Enum(ShaderType) })
    get shader() { return this._shader; }
    set shader(type) {
        this._shader = type;
        this.applySettinhs();
    }

    private sprite: cc.Sprite;
    private startTime = 0;


    protected start() {
        this.sprite = this.getComponent(cc.Sprite);
        this.sprite.setState(0);
        this.applySettinhs();
    }
    

    protected update(dt) {
        let mat = (<any>this.sprite).getCurrMaterial();
        if (!mat) return;
        if (NeedUpdate.indexOf(this._shader) >= 0) {
            let deltaTime = new Date().getTime() - this.startTime;
            if (deltaTime > 65535) this.startTime = this.startTime + deltaTime;
            mat.setParamValue('time', deltaTime);
        }
    }


    private applySettinhs() {
        let shaderType = this._shader;
        let mat = ShaderManager.getInstance().setShader(this.sprite, shaderType.toString());
        switch (shaderType) {
            case ShaderType.Blur:
            case ShaderType.GaussBlurs:
                mat.matsetParamValue('bluramount', 0.1)//0-0.1
                break;
            case ShaderType.WaveShader:
                mat.setParamValue('iOffset', new cc.Vec2(0, 0.1));
                break;
            default:
                break;
        }
    }
    
}
