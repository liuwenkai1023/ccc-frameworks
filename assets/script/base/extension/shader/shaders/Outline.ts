import { Shader } from "../Shader";

// Shader: 描边
export class Outline extends Shader {

    public name = "Outline";

    public params = [
        { name: 'resolution', type: this.renderer.PARAM_FLOAT3 },
    ];

    public defines = [];

    public frag = `
    uniform sampler2D texture;
    varying vec2 uv0;
    uniform vec3 resolution;

    void main()
    {
        vec2 onePixel = vec2(1.0 / resolution.x, 1.0 / resolution.y);

        vec4 color = texture2D(texture, uv0.xy);
        vec4 colorRight = texture2D(texture, uv0.xy + vec2(0,onePixel.t));
        vec4 colorBottom = texture2D(texture, uv0.xy + vec2(onePixel.s,0));

        color.r = 3.0* sqrt( (color.r - colorRight.r) * (color.r - colorRight.r) + (color.r - colorBottom.r) * (color.r - colorBottom.r) );
        color.g = 3.0* sqrt( (color.g - colorRight.g) * (color.g - colorRight.g) + (color.g - colorBottom.g) * (color.g - colorBottom.g) );
        color.b = 3.0* sqrt( (color.b - colorRight.b) * (color.b - colorRight.b) + (color.b - colorBottom.b) * (color.b - colorBottom.b) );

        color.r >1.0 ? 1.0 : color.r;
        color.g >1.0 ? 1.0 : color.g;
        color.b >1.0 ? 1.0 : color.b;
        gl_FragColor = vec4(color.rgb, 1);
    }`;
}