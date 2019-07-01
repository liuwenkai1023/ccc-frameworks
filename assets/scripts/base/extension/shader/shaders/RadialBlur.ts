import { Shader } from "../Shader";

// Shader: 径向模糊
export class RadialBlur extends Shader {

    public name = "RadialBlur";

    public defines = [];

    public params = [
        { name: 'iCenter', type: this.renderer.PARAM_FLOAT2 },
    ];

    public frag = `
    uniform sampler2D texture;
    uniform vec2 iCenter;
    varying vec2 uv0;

    void mainImage( out vec4 fragColor, in vec2 fragCoord )
    {
        const float Strength = 0.125;    
        const int Samples = 64; //multiple of 2
        
        vec2 uv = fragCoord.xy;
        
        vec2 dir = (fragCoord.xy-iCenter.xy);
    
        vec4 color = vec4(0.0,0.0,0.0,0.0);
        
        for (int i = 0; i < Samples; i += 2) //operating at 2 samples for better performance
        {
            color += texture2D(texture,uv+float(i)/float(Samples)*dir*Strength);
            color += texture2D(texture,uv+float(i+1)/float(Samples)*dir*Strength);
        }   
        
        fragColor = color/float(Samples);
    }
     
    void main(void)
    {
        mainImage(gl_FragColor, uv0);
    }`;
}