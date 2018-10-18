import Shader from "../Shader";

// Shader= Ice

export default class Ice extends Shader {

    public name = "Ice";
    
    public defines = [];

    public params = [];

    public frag = `
    uniform sampler2D texture;
    uniform vec4 color;
    varying vec2 uv0;
    void main () {
        vec4 clrx = color * texture2D(texture, uv0);
        float brightness = (clrx.r + clrx.g + clrx.b) * (1. / 3.);
    	float gray = (1.5)*brightness;
    	clrx = vec4(gray, gray, gray, clrx.a)*vec4(0.8,1.2,1.5,1);
        gl_FragColor =clrx;
    }
    `;
}