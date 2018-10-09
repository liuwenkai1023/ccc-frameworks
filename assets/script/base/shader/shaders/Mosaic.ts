import Shader from "../Shader";

// Shader: 方形马赛克
export default class Mosaic extends Shader {
    public name = "Mosaic";

    public params = [
        { name: 'iResolution', type: this.renderer.PARAM_FLOAT3 },
        { name: 'mosaicSize', type: this.renderer.PARAM_FLOAT },
        { name: 'time', type: this.renderer.PARAM_FLOAT },
    ];

    public defines = [];

    public frag = `
    uniform sampler2D texture;
    uniform vec3 iResolution;
    uniform float mosaicSize;
    varying vec2 uv0;
     
    void main(void)
    {
        vec4 color;
        vec2 xy = vec2(uv0.x * iResolution.x, uv0.y * iResolution.y);
        vec2 xyMosaic = vec2(floor(xy.x / mosaicSize) * mosaicSize, floor(xy.y / mosaicSize) * mosaicSize);
        vec2 xyFloor = vec2(floor(mod(xy.x, mosaicSize)), floor(mod(xy.y, mosaicSize)));
        vec2 uvMosaic = vec2(xyMosaic.x / iResolution.x, xyMosaic.y / iResolution.y);
        color = texture2D( texture, uvMosaic);
        gl_FragColor = color; 
    }`;
}