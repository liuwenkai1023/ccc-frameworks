import { Shader } from "../Shader";

// Shader= 纹理与颜色叠加

export class OverlayShader extends Shader {

    public name = "OverlayShader";
    
    public defines = [];

    public params = [];

    public frag = `
    uniform sampler2D texture;
    varying vec2 uv0;
    uniform vec4 color;
    void main() 
    { 
        vec4 texColor = texture2D(texture, uv0);  
        if (texColor.r <= 0.5)
        gl_FragColor.r = 2.0 * texColor.r * color.r;
        else
        gl_FragColor.r = 1.0 - 2.0 * (1.0 - texColor.r) * (1.0 - color.r);
        if (texColor.g <= 0.5)
        gl_FragColor.g = 2.0 * texColor.g * color.g;
        else
        gl_FragColor.g = 1.0 - 2.0 * (1.0 - texColor.g) * (1.0 - color.g);
        if (texColor.b <= 0.5)
        gl_FragColor.b = 2.0 * texColor.b * color.b;
        else
        gl_FragColor.b = 1.0 - 2.0 * (1.0 - texColor.b) * (1.0 - color.b);
        gl_FragColor.a = texColor.a * color.a;
    }`;
}