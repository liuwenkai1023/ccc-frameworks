import CustomMaterial from "./CustomMaterial";
import SpriteHook from "./SpriteHook";
import ShaderLib from "./ShaderLib";

// export enum ShaderType {
//     Default = "Default",
//     Banish = "Banish",
//     Blur = "Blur",
//     Dissolve = "Dissolve",
//     Fluxay = "Fluxay",
//     FluxaySuper = "FluxaySuper",
//     Frozen = "Frozen",
//     GaussBlurs = "GaussBlurs",
//     Glowing = "Glowing",
//     Ice = "Ice",
//     Invisible = "Invisible",
//     Mirror = "Mirror",
//     Mosaic = "Mosaic",
//     Outline = "Outline",
//     OverlayShader = "OverlayShader",
//     Poison = "Poison",
//     RadialBlur = "RadialBlur",
//     RainShader = "RainShader",
//     Stone = "Stone",
//     Vanish = "Vanish",
//     Water = "Water",
//     WaveShader = "WaveShader"
// }
export enum ShaderType {
    Default,
    Banish,
    Blur,
    Dissolve,
    Fluxay,
    FluxaySuper,
    Frozen,
    GaussBlurs,
    Glowing,
    Gray,
    Ice,
    Invisible,
    Mirror,
    Mosaic,
    Outline,
    Overlay,
    Poison,
    RadialBlur,
    RainShader,
    Stone,
    Vanish,
    Water,
    WaveShader,
}

export default class ShaderManager {
    private static instance: ShaderManager;

    private constructor() {
        SpriteHook.init();
    }

    public static getInstance(target?: any | void) {
        if (!this.instance) {
            this.instance = new ShaderManager();
        }
        return this.instance;
    }

    public setShader(_sprite: cc.Sprite, _shader: ShaderType, _handler?: { (mat: CustomMaterial) } | void) {

        console.log("setShader")

        if (_shader == ShaderType.Default) {
            _sprite.setState(0);
            return;
        }

        let shaderName = ShaderType[_shader];
        let shader = ShaderLib.getInstance().getShader(shaderName);
        
        let sprite: any = <any>_sprite;

        let mat: CustomMaterial = sprite.getMaterial(shaderName);
        if (!mat) {
            mat = new CustomMaterial(shader.name, shader.params, shader.defines);
            sprite.setMaterial(shaderName, mat);
            mat.texture = _sprite.spriteFrame.getTexture();
        }
        
        sprite.activateMaterial(shaderName);
        mat.texture.update();

        mat.setParamValue("iResolution", new cc.Vec3(sprite.node.width, sprite.node.height, 0));
        mat.setParamValue("texSize", new cc.Vec2(sprite.node.width, sprite.node.height));
        if (_handler) { _handler(mat); }
        return mat;
    }

}