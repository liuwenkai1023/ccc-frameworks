import { Shader } from "../Shader";

// Shader= Fluxay

export class Fluxay extends Shader {

    public name = "Fluxay";
    
    public defines = [];

    public params = [];

    public frag = `
    uniform sampler2D texture;
    uniform vec4 color;
    uniform float time;
    varying vec2 uv0;

    void main()
    {
        vec4 src_color = color * texture2D(texture, uv0).rgba;

        float width = 0.08;       //流光的宽度范围 (调整该值改变流光的宽度)
        float start = tan(time/1.414);  //流光的起始x坐标
        float strength = 0.008;   //流光增亮强度   (调整该值改变流光的增亮强度)
        float offset = 0.5;      //偏移值         (调整该值改变流光的倾斜程度)
        if(uv0.x < (start - offset * uv0.y) &&  uv0.x > (start - offset * uv0.y - width))
        {
            vec3 improve = strength * vec3(255, 255, 255);
            vec3 result = improve * vec3( src_color.r, src_color.g, src_color.b);
            gl_FragColor = vec4(result, src_color.a);

        }else{
            gl_FragColor = src_color;
        }
    }
    `;
}