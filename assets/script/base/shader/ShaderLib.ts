import Overlay from "./shaders/Overlay";
import Rain from "./shaders/RainShader";
import Wave from "./shaders/WaveShader";
import GaussBlurs from "./shaders/GaussBlurs";
import Glowing from "./shaders/Glowing";
import Outline from "./shaders/Outline";
import Mosaic from "./shaders/Mosaic";
import Water from "./shaders/Water";
import Shader from "./Shader";
import Ice from "./shaders/Ice";
import Fluxay from "./shaders/Fluxay";
import FluxaySuper from "./shaders/FluxaySuper";
import Banish from "./shaders/Banish";
import Blur from "./shaders/Blur";
import Dissolve from "./shaders/Dissolve";
import Frozen from "./shaders/Frozen";
import Invisible from "./shaders/Invisible";
import Mirror from "./shaders/Mirror";
import Poison from "./shaders/Poison";
import RadialBlur from "./shaders/RadialBlur";
import Stone from "./shaders/Stone";
import Vanish from "./shaders/Vanish";
import Default from "./shaders/Default";
import Gray from "./shaders/Gray";


/**
 * Shader库
 */
export interface ShaderMap { [key: string]: Shader }

export default class ShaderLib {

    private static instance: ShaderLib;
    private _shaders: ShaderMap = {};


    private constructor() {
        this.init();
    }


    public static getInstance() {
        if (!this.instance) {
            this.instance = new ShaderLib();
        }
        return this.instance;
    }


    /**
     * 初始化一些shader实例
     */
    public init() {
        this.addShader(new Default());
        this.addShader(new Banish());
        this.addShader(new Blur());
        this.addShader(new Dissolve());
        this.addShader(new Fluxay());
        this.addShader(new FluxaySuper());
        this.addShader(new Frozen());
        this.addShader(new GaussBlurs());
        this.addShader(new Glowing());
        this.addShader(new Gray());
        this.addShader(new Ice());
        this.addShader(new Invisible());
        this.addShader(new Mirror());
        this.addShader(new Mosaic());
        this.addShader(new Outline());
        this.addShader(new Overlay());
        this.addShader(new Poison());
        this.addShader(new RadialBlur());
        this.addShader(new Rain());
        this.addShader(new Stone());
        this.addShader(new Vanish());
        this.addShader(new Water());
        this.addShader(new Wave());
    }


    /**
      * 增加一个新的Shader
      * @param shader 
      */
    public addShader(shader: Shader): boolean {
        if (this._shaders && this._shaders[shader.name]) {
            return false;
        }
        (<any>cc.renderer)._forward._programLib.define(shader.name, shader.vert, shader.frag, shader.defines);
        this._shaders[shader.name] = shader;
        return true;
    }


    /**
    * 取Shader的定义
    * @param name 
    */
    public getShader(name): Shader {
        if (this._shaders[name]) {
            return this._shaders[name]
        }
        throw "ShadlerLib中不存在Shader：" + name;
    }
}

