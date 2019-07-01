import { Shader } from "../Shader";

// Shader= Dissolve

export class Dissolve extends Shader {

    public name = "Dissolve";
    
    public defines = [];

    public params = [];

    public frag = `
    uniform sampler2D texture;
    uniform vec4 color;
    uniform float time;
    varying vec2 uv0;

    void main()
    {
        vec4 c = color * texture2D(texture,uv0);
        float height = c.r;
        if(height < time)
        {
            discard;
        }
        if(height < time+0.04)
        {
            // 溶解颜色，可以自定义
            c = vec4(.9,.6,0.3,c.a);
        }
        gl_FragColor = c;
    }
    `;
}