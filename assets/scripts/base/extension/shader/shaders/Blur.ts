import { Shader } from "../Shader";

// Shader= Blur

export class Blur extends Shader {

    public name = "Blur";

    public defines = [];

    public params = [ { name: 'bluramount', type: this.renderer.PARAM_FLOAT },];

    public frag = `
    uniform sampler2D texture;
    uniform vec4 color;
    uniform float bluramount;
    varying vec2 uv0;
    void main () {
        vec4 sum = vec4(0.0);
        vec2 size = vec2(bluramount, bluramount);
        sum += texture2D(texture, uv0 - 0.4 * size) * 0.05;
    	sum += texture2D(texture, uv0 - 0.3 * size) * 0.09;
    	sum += texture2D(texture, uv0 - 0.2 * size) * 0.12;
    	sum += texture2D(texture, uv0 - 0.1 * size) * 0.15;
    	sum += texture2D(texture, uv0             ) * 0.16;
    	sum += texture2D(texture, uv0 + 0.1 * size) * 0.15;
    	sum += texture2D(texture, uv0 + 0.2 * size) * 0.12;
    	sum += texture2D(texture, uv0 + 0.3 * size) * 0.09;
        sum += texture2D(texture, uv0 + 0.4 * size) * 0.05;

        vec4 vectemp = vec4(0,0,0,0);
        vec4 substract = vec4(0,0,0,0);
        vectemp = (sum - substract) * color;

        float alpha = texture2D(texture, uv0).a;
        if(alpha < 0.05) { gl_FragColor = vec4(0 , 0 , 0 , 0); }
    	else { gl_FragColor = vectemp; }
    }
    `;
}