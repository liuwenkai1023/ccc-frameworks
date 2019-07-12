import { ShaderLib } from "./ShaderLib";
import { SpriteHook } from "./SpriteHook";
import { ShaderCustomMaterial } from "./CustomMaterial";

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
    WaveShader
}

// export enum ShaderTypeMap {
//     正常,
//     发散,
//     模糊,
//     溶解,
//     扫光,
//     流光,
//     冻结,
//     高斯模糊,
//     发光,
//     置灰,
//     冰,
//     隐藏,
//     反相,
//     马赛克,
//     轮廓,
//     叠加,
//     抑制,
//     径向模糊,
//     雷雨天,
//     石化,
//     淡化,
//     水波,
//     波浪
// }

export class ShaderManager {
    // private static _instance: ShaderManager;
    constructor() {
        SpriteHook.init();
    }

    // public static getInstance() {
    //     if (!this._instance) {
    //         this._instance = new ShaderManager();
    //     }
    //     return this._instance;
    // }

    public setShader(_sprite: cc.Sprite, _shader: ShaderType, _handler?: { (mat: ShaderCustomMaterial) } | void) {
        // console.log(`【${_sprite.node.name}】->[setShader]->${ShaderType[_shader]}`);
        if (!_sprite) return;
        if (_shader == ShaderType.Default) {
            _sprite.setState(0);
            return;
        }

        let shaderName = ShaderType[_shader];
        let shader = App.SingletonFactory.getInstance(ShaderLib).getShader(shaderName);
        let sprite: any = <any>_sprite;
        let mat: ShaderCustomMaterial = sprite.getCustomMaterial(shaderName);

        if (!mat) {
            mat = new ShaderCustomMaterial(shader.name, shader.params, shader.defines);
            sprite.setCustomMaterial(shaderName, mat);
            mat.texture = _sprite.spriteFrame.getTexture();
        }

        sprite.activateCustomMaterial(shaderName);
        mat.texture.update();
        mat.setParamValue("resolution", new cc.Vec3(sprite.node.width, sprite.node.height, 0));
        mat.setParamValue("texSize", new cc.Vec2(sprite.node.width, sprite.node.height));
        if (_handler) { _handler(mat); }
        return mat;
    }

}