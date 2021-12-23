class GameOfLifeCursor{
    constructor(cursorImage,cursorInverseRatioSize){
        this.cursorImage = cursorImage;
        this.cursorInverseRatioSize = cursorInverseRatioSize;
        this.cursorSize = canvas.width / this.cursorInverseRatioSize;
    }

    InitGL(){
        //cursors vertex array object , vertex buffer, index buffer setup
        this.cursorVAO = gl.createVertexArray();
        this.cursorVBO = gl.createBuffer();
        this.cursorIBO = gl.createBuffer();

        gl.bindVertexArray(this.cursorVAO);
        gl.bindBuffer(gl.ARRAY_BUFFER,this.cursorVBO);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.cursorIBO);
        // enable vertex array attribute
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0,2,gl.FLOAT,gl.FALSE,8 * Float32Array.BYTES_PER_ELEMENT,0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1,4,gl.FLOAT,gl.FALSE,8 * Float32Array.BYTES_PER_ELEMENT,2 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2,2,gl.FLOAT,gl.FALSE,8 * Float32Array.BYTES_PER_ELEMENT,6 * Float32Array.BYTES_PER_ELEMENT);
        
        gl.bindVertexArray(null);
        //cursor texture
        this.cursorTexture = new Texture(gl,this.cursorImage);
        gl.activeTexture(gl.TEXTURE0);
        this.cursorTexture.Bind(gl);
        //shader
        this.texShader = new Shader(gl,TexvertexShaderSource,TexfragmentShaderSource);

        //init mvp matrix and time
        this.projMatrix = new Float32Array(16);
        this.Time = 0;
    }

    OnSpawn(){
        this.cursorSize = canvas.width / this.cursorInverseRatioSize;
        this.OnSpawnGL();
    }

    OnSpawnGL(){
        //new MVP
        glMatrix.mat4.identity(this.projMatrix);
        this.projMatrix = glMatrix.mat4.orthoNO(this.projMatrix,0,canvas.width,canvas.height,0,-1,1);
        //cursor buffer setup
        this.cursorIndex = 0;
        this.cursorBufferData = [];
        this.cursorIndexData = [];
        //cursor tex Shader
        this.texShader.Bind(gl);
        this.texShader.SetUniformMatrix4fv(gl,"u_MVP",this.projMatrix);
        this.texShader.SetUniform1i(gl,"sampler",0);
        this.texShader.UnBind(gl);
    }

    OnUpdate(){
        if(this.cursorIndexData.length != 0){
            //bind vertex array
            gl.bindVertexArray(this.cursorVAO);
            //bind buffer
            gl.bindBuffer(gl.ARRAY_BUFFER,this.cursorVBO);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.cursorIBO);
            //sub data
            gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(this.cursorBufferData),gl.DYNAMIC_DRAW);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.cursorIndexData),gl.DYNAMIC_DRAW);
            //unbind buffer
            gl.bindBuffer(gl.ARRAY_BUFFER,null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
            gl.bindVertexArray(null);
        }
    }

    OnRender(){
        if(this.cursorIndexData.length != 0){
            this.texShader.Bind(gl);
            this.cursorTexture.Bind(gl);
            gl.bindVertexArray(this.cursorVAO);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.cursorIBO);
            gl.drawElements(gl.TRIANGLES, this.cursorIndexData.length,gl.UNSIGNED_SHORT,null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
            gl.bindVertexArray(null);
            this.cursorTexture.Unbind(gl);
            this.texShader.UnBind(gl);

            this.cursorBufferData = [];
            this.cursorIndexData = [];
            this.cursorIndex = 0;
        }
    }

    DrawCursor(pos,color){
        this.cursorBufferData.push(pos.x,pos.y,color[0],color[1],color[2],color[3],0.0,0.0,
            pos.x + this.cursorSize,pos.y,color[0],color[1],color[2],color[3],1.0,0.0,
            pos.x,pos.y + this.cursorSize,color[0],color[1],color[2],color[3],0.0,1.0,
            pos.x + this.cursorSize,pos.y + this.cursorSize,color[0],color[1],color[2],color[3],1.0,1.0
        );
        this.cursorIndexData.push(this.cursorIndex,this.cursorIndex + 1,this.cursorIndex+2,
                        this.cursorIndex+1,this.cursorIndex+2,this.cursorIndex+3);
        this.cursorIndex+=4;
    }
}