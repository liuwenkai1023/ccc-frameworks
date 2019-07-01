import { Shader } from "../Shader";

// Shader= Frozen

export class Frozen extends Shader {

    public name = "Frozen";

    public defines = [];

    public params = [];

    public frag = `
    uniform sampler2D texture;
    uniform vec4 color;
    varying vec2 uv0;
    void main () {
        vec4 c = color * texture2D(texture, uv0);
        c *= vec4(0.8, 1, 0.8, 1);
        c.b += c.a * 0.2;
        gl_FragColor = c;
    }
    `;
}