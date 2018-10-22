import Shader from "../Shader";

// Shader= Gray

export default class Gray extends Shader {

    public name = "Gray";

    public defines = [];

    public params = [];

    public frag = `
    uniform sampler2D texture;
    uniform vec4 color;
    varying vec2 uv0;
    void main () {
        vec4 c = color * texture2D(texture, uv0);
        //0.2126,0.7152,0.0722这三个数值是根据人眼对颜色的识别能力计算出来的，RGB颜色值相乘，即为灰
        gl_FragColor.xyz = vec3(0.2126*c.r + 0.7152*c.g + 0.0722*c.b);
        //第四个值为Alpha
        gl_FragColor.w = c.w;
    }
    `;
}