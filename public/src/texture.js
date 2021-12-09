class Texture{
    constructor(gl,img){
        this.m_tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D,this.m_tex);

        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        
        
        gl.texImage2D(gl.TEXTURE_2D,0,
            gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,
            img);
        gl.bindTexture(gl.TEXTURE_2D,null);
        }
    Bind(gl){
        gl.bindTexture(gl.TEXTURE_2D,this.m_tex);
    }
    Unbind(gl){
        gl.bindTexture(gl.TEXTURE_2D,null);
    }
}