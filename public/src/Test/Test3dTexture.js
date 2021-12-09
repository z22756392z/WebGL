class Test3dTexture extends Test{
    constructor(TestMenu){
        super(TestMenu);
        this.x = 5;
        this.z = 5;
        this.OnInit();
    }

    OnInit(){
        //Blend enable
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
        //gl.enable(gl.DEPTH_TEST);
        //gl.enable(gl.CULL_FACE);
        //gl.frontFace(gl.CCW);
        //gl.cullFace(gl.BACK);


        this.vao = gl.createVertexArray();
        this.vbo = gl.createBuffer();
        this.ibo = gl.createBuffer();

        gl.bindVertexArray(this.vao);
        //bind vertex and index buffer
        gl.bindBuffer(gl.ARRAY_BUFFER,this.vbo);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.ibo);
        //sub data
        gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,1,0,1,0,0,
                                                        -1,1,1,1,0,1,0,1,
                                                        1,-1,1,1,0,1,1,0,
                                                        1,1,1,1,0,1,1,1]),gl.STATIC_DRAW);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,1,2,3]),gl.STATIC_DRAW);
        // enable vertex array attribute
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0,2,gl.FLOAT,gl.FALSE,8 * Float32Array.BYTES_PER_ELEMENT,0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1,4,gl.FLOAT,gl.FALSE,8 * Float32Array.BYTES_PER_ELEMENT,2 * Float32Array.BYTES_PER_ELEMENT);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2,2,gl.FLOAT,gl.FALSE,8 * Float32Array.BYTES_PER_ELEMENT,6 * Float32Array.BYTES_PER_ELEMENT);
        //unbind buffer
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);

        //init mvp matrix
        this.worldMatrix = new Float32Array(16);
        this.viewMatrix = new Float32Array(16);
        this.projMatrix = new Float32Array(16);

        //glMatrix.mat4.identity(this.worldMatrix);
        //glMatrix.mat4.lookAt(this.viewMatrix,[this.x,5,this.z],[0,0,0],[0,1,0]);
        //glMatrix.mat4.perspective(this.projMatrix,glMatrix.glMatrix.toRadian(45),canvas.width / canvas.height,0.1,1000.0);
        //sub mvp uniform
        this.shader = new Shader(gl,TexvertexShaderSource,TexfragmentShaderSource);
        this.shader.Bind(gl);
        
        //sub texture sampler uniform
        this.shader.SetUniform1i(gl,"sampler",0);
       
        this.shader.UnBind(gl);

        //texture init
        this.texture = new Texture(gl,this.testMenu.resource);
        gl.activeTexture(gl.TEXTURE0);
        this.texture.Bind(gl);

        //init roation matrix to world matrix
        //this.angle = 0;
        //this.xRotateMatrix = new Float32Array(16);
        //this.yRotateMatrix = new Float32Array(16);
        //this.identityMatrix = new Float32Array(16);
       // glMatrix.mat4.identity(this.identityMatrix);
    }

    OnUpdate(inputManger){
        //input process
        if(inputManger.isKeyDown('w')) {
            console.log(123);
            this.SetXZ(this.x + 1, this.z);
        }
        if(inputManger.isKeyDown('a')) {
            console.log(123);
            this.SetXZ(this.x, this.z + 1);
        }
        if(inputManger.isKeyDown('s')) {
            console.log(123);
            this.SetXZ(this.x - 1, this.z);
        }
        if(inputManger.isKeyDown('d')) {
            console.log(123);
            this.SetXZ(this.x, this.z - 1);
        }
        
        //this.angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        //glMatrix.mat4.rotate(this.xRotateMatrix,this.identityMatrix,this.angle,[1,0,0]);
        //glMatrix.mat4.rotate(this.yRotateMatrix,this.identityMatrix,this.angle/3,[0,1,0]);
        //glMatrix.mat4.multiply(this.worldMatrix,this.yRotateMatrix,this.xRotateMatrix);
        //this.shader.Bind(gl);
        //this.shader.SetUniformMatrix4fv(gl,"mWorld",this.worldMatrix);
        //console.log("x: ",this.x,"z: ",this.z);
        //glMatrix.mat4.lookAt(this.viewMatrix,[this.x,5,this.z],[0,0,0],[0,1,0]);
        //this.shader.SetUniformMatrix4fv(gl,"mView",this.viewMatrix);
    }

    OnRender(){
        this.shader.Bind(gl);
        gl.clearColor(0.0,1.0,0.2,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.ibo);
        gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,null);
    }
    //setter
    SetXZ(x,z){
        this.x = x;
        this.z = z;
    }
    //getter
    GetX(){return this.x;}
    GetZ(){return this.z;}
}