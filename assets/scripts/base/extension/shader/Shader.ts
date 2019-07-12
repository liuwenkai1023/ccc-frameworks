export interface Define { name: string, value?: boolean | void };
export interface Param { name: string, type?: number | void };
const renderer = cc.renderer.renderEngine.renderer;
const MVP = `
uniform mat4 viewProj;
attribute vec3 a_position;
attribute mediump vec2 a_uv0;
varying mediump vec2 uv0;
#ifndef useColor
attribute lowp vec4 a_color;
varying lowp vec4 v_fragmentColor;
#endif
void main () {
  vec4 pos = viewProj * vec4(a_position, 1);
  gl_Position = pos;
  uv0 = a_uv0;
 #ifndef useColor
  v_fragmentColor = a_color;
 #endif
}`;

export class Shader {
    public renderer = renderer;
    public name: string;
    public defines: Array<Define>;
    public params: Array<Param>;
    public vert: string = MVP;
    public frag: string;
}