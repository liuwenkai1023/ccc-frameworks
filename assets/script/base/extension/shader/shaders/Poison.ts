import { Shader } from "../Shader";

// Shader= Poison

export class Poison extends Shader {

    public name = "Poison";

    public defines = [];

    public params = [];

    public frag = `
    uniform sampler2D texture;
    uniform vec4 color;
    varying vec2 uv0;
    void main () {
        vec4 c = color * texture2D(texture, uv0);
        c.r *= 0.8;
    	c.r += 0.08 * c.a;
    	c.g *= 0.8;
        c.g += 0.2 * c.a;
    	c.b *= 0.8;
        gl_FragColor = c;
    }
    `;
}