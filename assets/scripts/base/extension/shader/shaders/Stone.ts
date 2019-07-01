import { Shader } from "../Shader";

// Shader= Stone

export class Stone extends Shader {

    public name = "Stone";

    public defines = [];

    public params = [];

    public frag = `
    uniform sampler2D texture;
    uniform vec4 color;
    varying vec2 uv0;
    void main () {
        vec4 c = color * texture2D(texture, uv0);
        float clrbright = (c.r + c.g + c.b) * (1. / 3.);
        float gray = (0.6) * clrbright;
        gl_FragColor = vec4(gray, gray, gray, c.a);
    }
    `;
}