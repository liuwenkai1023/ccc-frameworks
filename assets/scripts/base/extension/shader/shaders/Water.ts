import { Shader } from "../Shader";

// // Shader: 水
export class Water extends Shader {

    public name = "Water";

    public params = [
        { name: 'resolution', type: this.renderer.PARAM_FLOAT3 },
        { name: 'time', type: this.renderer.PARAM_FLOAT },
    ];

    public defines = [];

    public frag = `
    uniform sampler2D texture;
    uniform vec3 resolution;
    uniform float time;
    varying vec2 uv0;

    #define F cos(x-y)*cos(y),sin(x+y)*sin(y)

    vec2 s(vec2 p)
    {
        float d=time*0.2,x=8.*(p.x+d),y=8.*(p.y+d);
        return vec2(F);
    }
    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        // 换成resolution
        vec2 rs = resolution.xy;
        // 换成纹理坐标v_texCoord.xy
        vec2 uv = fragCoord;
        vec2 q = uv+2./resolution.x*(s(uv)-s(uv+rs));
        //反转y
        //q.y=1.-q.y;
        fragColor = texture2D(texture, q);
    }
    void main()
    {
        mainImage(gl_FragColor, uv0.xy);
    }
    `;

}