import { Shader } from "../Shader";

// Shader= Banish

export class Default extends Shader {

    public name = "Default";

    public defines = [];

    public params = [];

    public frag = `
    uniform sampler2D texture;
    uniform vec4 color;
    varying vec2 uv0;
    void main () {
        vec4 c = color * texture2D(texture, uv0);
        float gg = (c.r + c.g + c.b) * (1.0 / 3.0);
        c.r = gg * 0.9;
        c.g = gg * 1.2;
        c.b = gg * 0.8;
        c.a *= (gg + 0.1);
        gl_FragColor = c;
    }
    `;
}