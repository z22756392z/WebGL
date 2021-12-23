class Font{
    constructor(image){
        //vertex array object , vertex buffer, index buffer setup
        this.fontVAO = gl.createVertexArray();
        this.fontVBO = gl.createBuffer();
        this.fontIBO = gl.createBuffer();

        gl.bindVertexArray(this.fontVAO);
        gl.bindBuffer(gl.ARRAY_BUFFER,this.fontVBO);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.fontIBO);
        // enable vertex array attribute
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0,2,gl.FLOAT,gl.FALSE,8 * Float32Array.BYTES_PER_ELEMENT,0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1,4,gl.FLOAT,gl.FALSE,8 * Float32Array.BYTES_PER_ELEMENT,2 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2,2,gl.FLOAT,gl.FALSE,8 * Float32Array.BYTES_PER_ELEMENT,6 * Float32Array.BYTES_PER_ELEMENT);
        
        gl.bindVertexArray(null);
        //texture
        this.fontTexture = new Texture(gl,image);
        gl.activeTexture(gl.TEXTURE0);


        //shader
        this.texShader = new Shader(gl,TexvertexShaderSource,TexfragmentShaderSource);

        //init mvp matrix and time
        this.projMatrix = new Float32Array(16);
        
        //blend mode
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
        //new MVP
        glMatrix.mat4.identity(this.projMatrix);
        this.projMatrix = glMatrix.mat4.orthoNO(this.projMatrix,0,1665,969,0,-1,1);
        
        this.fontBufferData = [];
        this.fontIndexData = [];
        this.fontIndex = 0;
        //tex Shader
        this.texShader.Bind(gl);
        this.texShader.SetUniformMatrix4fv(gl,"u_MVP",this.projMatrix);
        this.texShader.SetUniform1i(gl,"sampler",0);
        this.texShader.UnBind(gl);

        this.needUpdate = false;
    }

    OnRender(){
        if(this.needUpdate){
            this.tempIndexLength = this.fontIndexData.length;
            //bind vertex array
            gl.bindVertexArray(this.fontVAO);
            //bind buffer
            gl.bindBuffer(gl.ARRAY_BUFFER,this.fontVBO);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.fontIBO);
            //sub data
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.fontBufferData),gl.STATIC_DRAW);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.fontIndexData),gl.STATIC_DRAW);
            //unbind buffer
            gl.bindBuffer(gl.ARRAY_BUFFER,null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
            gl.bindVertexArray(null); 
        }

        this.texShader.Bind(gl);
        this.fontTexture.Bind(gl);
        gl.bindVertexArray(this.fontVAO);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.fontIBO);
        gl.drawElements(gl.TRIANGLES, this.tempIndexLength,gl.UNSIGNED_SHORT,null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
        gl.bindVertexArray(null);
        this.fontTexture.Unbind(gl);
        this.texShader.UnBind(gl);
        
        if(this.needUpdate){
            this.fontBufferData = [];
            this.fontIndexData = [];
            this.fontIndex = 0;
            this.needUpdate = false;
        }
    }

    Text(text,size,pos,color) {
        this.needUpdate = true;
        let fontData = [];
        let bitmapWidth = Jokerman_Font.font.info._width;
        let bitmapHeight = Jokerman_Font.font.info._height;
        let ratio = size / Jokerman_Font.font.info._size;
        let currentXPos = pos.x;
        for(let i = 0 ; i < text.length ; i++){
            fontData = Jokerman_Font.font.chars.char[text.charCodeAt(i) - 32];
            let width = ratio * fontData._width;
            let height = ratio * fontData._height;
            let x = currentXPos + fontData._xoffset * ratio ;
            let y = pos.y  + fontData._yoffset * ratio ;
            let uvX = fontData._x/bitmapWidth;
            let uvY = fontData._y/bitmapHeight;
            let uvWidth = fontData._width / bitmapWidth;
            let uvHeight = fontData._height / bitmapHeight;
    
            this.fontBufferData.push(
                x        , y         ,   color[0],color[1],color[2],color[3], uvX          , uvY,
                x + width, y         ,   color[0],color[1],color[2],color[3], uvX + uvWidth, uvY,
                x        , y + height,   color[0],color[1],color[2],color[3], uvX          , uvY + uvHeight,
                x + width, y + height,   color[0],color[1],color[2],color[3], uvX + uvWidth, uvY + uvHeight,
            );
            this.fontIndexData.push(
                this.fontIndex , this.fontIndex + 1, this.fontIndex + 2,
                this.fontIndex + 1, this.fontIndex + 2 , this.fontIndex + 3
            )
            this.fontIndex += 4;
    
            currentXPos += fontData._xadvance * ratio ;
        }
    }
}
