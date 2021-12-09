const vertexShaderSource = `#version 300 es
    precision mediump  float;
    in vec2 vertexPosition;
    in vec4 color;

    uniform mat4 u_MVP;
    uniform float u_T;

    out vec4 fragColor;
    void main() {
	    gl_Position =  u_MVP * vec4(vertexPosition,-1.0,1.0);
        fragColor = vec4(vec3(color.x,color.y* sin(u_T),color.z),1.0);
    }
`

const fragmentShaderSource = `#version 300 es
    precision mediump  float;
    out vec4 color;
    
    in vec4 fragColor;
    void main() {
        color =  fragColor;
    }
`

const TexvertexShaderSource = `#version 300 es
    precision mediump  float;
    in vec2 vertexPosition;
    in vec4 color;
    in vec2 uv;

    uniform mat4 u_MVP;

    out vec2 fragTexCoord;
    out vec4 fragColor;
    void main() {
	    gl_Position =  u_MVP * vec4(vertexPosition,-1.0,1.0);
        fragColor = color;
        fragTexCoord = uv;
    }
`

const TexfragmentShaderSource = `#version 300 es
    precision mediump  float;
    out vec4 color;
    
    uniform sampler2D sampler;
    
    in vec4 fragColor;
    in vec2 fragTexCoord;
    void main() {
        vec4 texColor = texture(sampler, fragTexCoord);
        texColor.rgb = fragColor.rbg;
        color = texColor;
    }
`

class Shader{
    constructor(gl,vss,fss){
        this.m_program = this.CreateShader(gl,vss,fss);
        this.uniformLocation = 0;
        this.m_UniformLocationCache = new Map();
    }
    

    CreateShader(gl,vss,fss){
        let program = gl.createProgram();

        let vertexShader = this.CompileShader(gl,gl.VERTEX_SHADER,vss);
        let fragmentShader = this.CompileShader(gl,gl.FRAGMENT_SHADER,fss);

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.validateProgram(program);
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            throw 'ERROR validating program!' + gl.getProgramInfoLog(program);
        }

        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);

        return program;
    }

    CompileShader(gl,type, source){
        let shader = gl.createShader(type);
        gl.shaderSource(shader,source);
        gl.compileShader(shader);
        var message = gl.getShaderInfoLog(shader);
        if (message.length > 0) {
            /* message may be an error or a warning */
            throw (type == gl.VERTEX_SHADER) ?"vs" + " shader: "+message :"fs" + " shader: "+message;
        }
        return shader;
    }

    Bind(gl){
        gl.useProgram(this.m_program);
    }

    UnBind(gl){
        gl.useProgram(null);
    }

    SetUniform1i(gl,name,v0){
        gl.uniform1i(this.GetUniformLocation(gl,name),v0);
    }

    SetUniform1f(gl,name,v0){
        gl.uniform1f(this.GetUniformLocation(gl,name),v0);
    }

    SetUniformMatrix4fv(gl,name,Matrix){
        gl.uniformMatrix4fv(this.GetUniformLocation(gl,name),gl.FALSE,Matrix);
    }

    GetUniformLocation(gl,name) {
        /*only retrieve it the first time. Cache it.*/
        if (this.m_UniformLocationCache.has(name))
            return this.m_UniformLocationCache.get(name);
            
        let location = gl.getUniformLocation(this.m_program, name);
        if (location == null)
            console.log("Warning: uniform '" , name , "' doesn't exsit" );
    
        this.m_UniformLocationCache.set(name,location);
        return location;
    }

    Destory(gl){
        gl.deleteProgram(this.m_program);
    }
}