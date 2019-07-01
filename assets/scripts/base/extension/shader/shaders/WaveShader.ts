/**
 * 波浪流动效果
 * */
import { Shader } from "../Shader";

// Shader= 纹理与颜色叠加
export class WaveShader extends Shader {

    public name = "WaveShader"

    public params = [
        { name: 'time', type: this.renderer.PARAM_FLOAT },
        { name: 'iOffset', type: this.renderer.PARAM_FLOAT2 },
    ]

    public defines = []

    public frag = `
    uniform sampler2D texture;
    uniform float time;
    uniform vec2 iOffset;
    varying vec2 uv0;
    
    void main() {
        vec2 coord = uv0;
        coord.x += (sin(coord.y * 30.0 + time * 3.0) / 30.0 * iOffset[0]);
        coord.y += (sin(coord.x * 30.0 + time * 3.0) / 30.0 * iOffset[1]);
        gl_FragColor = texture2D(texture, coord);
    }`;
}