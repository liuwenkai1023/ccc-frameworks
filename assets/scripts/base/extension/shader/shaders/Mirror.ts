import { Shader } from "../Shader";

// Shader= Mirror

export class Mirror extends Shader {

    public name = "Mirror";

    public defines = [];

    public params = [];

    public frag = `
    uniform sampler2D texture;
    uniform vec4 color;
    varying vec2 uv0;
    void main () {
        vec4 c = color * texture2D(texture, uv0);
        c.r *= 0.5;
        c.g *= 0.8;
        c.b += c.a * 0.2;
        gl_FragColor = c;
    }
    `;
}