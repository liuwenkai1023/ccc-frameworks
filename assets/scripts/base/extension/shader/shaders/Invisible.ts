import { Shader } from "../Shader";

// Shader= Invisible

export class Invisible extends Shader {

    public name = "Invisible";
    
    public defines = [];

    public params = [];

    public frag = `
    void main () {
        gl_FragColor = vec4(0,0,0,0);
    }
    `;
}