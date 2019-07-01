import { Shader } from "../Shader";

// Shader= Vanish

export class Vanish extends Shader {

    public name = "Vanish";
    
    public defines = [];

    public params = [];

    public frag = `
    uniform sampler2D texture;
    uniform vec4 color;
    varying vec2 uv0;
    void main () {
        vec4 c = color * texture2D(texture, uv0);
        float gray = (c.r + c.g + c.b) * (1. / 3.);
        float rgb = gray * 0.8;
        gl_FragColor = vec4(rgb, rgb, rgb, c.a * (gray + 0.1));
    }
    `;
}