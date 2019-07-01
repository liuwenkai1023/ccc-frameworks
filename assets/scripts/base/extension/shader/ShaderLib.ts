import { Shader } from "./Shader";
import * as shaders from "./shaders";


/**
 * Shader库
 */
export interface ShaderMap { [key: string]: Shader }

export class ShaderLib {

    // private static _instance: ShaderLib;
    private _shaders: ShaderMap = {};


   constructor() {
        this.init();
    }


    // public static getInstance() {
    //     if (!this._instance) {
    //         this._instance = new ShaderLib();
    //     }
    //     return this._instance;
    // }


    /**
     * 初始化一些shader实例
     */
    public init() {
        this.addShader(new shaders.Default());
        this.addShader(new shaders.Banish());
        this.addShader(new shaders.Blur());
        this.addShader(new shaders.Dissolve());
        this.addShader(new shaders.Fluxay());
        this.addShader(new shaders.FluxaySuper());
        this.addShader(new shaders.Frozen());
        this.addShader(new shaders.GaussBlurs());
        this.addShader(new shaders.Glowing());
        this.addShader(new shaders.Gray());
        this.addShader(new shaders.Ice());
        this.addShader(new shaders.Invisible());
        this.addShader(new shaders.Mirror());
        this.addShader(new shaders.Mosaic());
        this.addShader(new shaders.Outline());
        this.addShader(new shaders.Overlay());
        this.addShader(new shaders.Poison());
        this.addShader(new shaders.RadialBlur());
        this.addShader(new shaders.RainShader());
        this.addShader(new shaders.Stone());
        this.addShader(new shaders.Vanish());
        this.addShader(new shaders.Water());
        this.addShader(new shaders.WaveShader());
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

