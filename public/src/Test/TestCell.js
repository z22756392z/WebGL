class TestCell extends Test{
    constructor(TestMenu){
        super(TestMenu);
        this.m_Color = [1,1,0,1];
        this.vertex = [
                    0.0,0.0,0.0,0.0,1.0,1.0,
                    0.1,0.0,0.0,0.0,1.0,1.0,
                    0.1,0.1,0.0,0.0,1.0,1.0,
                    0.0,0.1,0.0,0.0,1.0,1.0];
        this.lineVertex = [
                        0.0,0.0,0.0,1.0,1.0,1.0,
                        0.1,0.0,0.0,1.0,1.0,1.0,
                        0.1,0.1,0.0,1.0,1.0,1.0,
                        0.0,0.1,0.0,1.0,1.0,1.0];
        this.index = [
            0,1,2,
            0,2,3
        ]
        this.lineIndex = [
            0,1,
            1,2,
            0,3,
            3,2
        ]
        this.vao = this.testMenu.gl.createVertexArray();
        this.vbo = this.testMenu.gl.createBuffer();
        this.ibo = this.testMenu.gl.createBuffer();

        this.lineVao = this.testMenu.gl.createVertexArray();
        this.lineVbo = this.testMenu.gl.createBuffer();
        this.lineIbo = this.testMenu.gl.createBuffer();

        this.testMenu.gl.bindVertexArray(this.vao);
        //bind vertex and index buffer
        this.testMenu.gl.bindBuffer(this.testMenu.gl.ARRAY_BUFFER,this.vbo);
        this.testMenu.gl.bindBuffer(this.testMenu.gl.ELEMENT_ARRAY_BUFFER,this.ibo);
        
        //sub data
        this.testMenu.gl.bufferData(this.testMenu.gl.ARRAY_BUFFER,new Float32Array(this.vertex),this.testMenu.gl.STATIC_DRAW);
        this.testMenu.gl.bufferData(this.testMenu.gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.index),this.testMenu.gl.STATIC_DRAW);
        //enable pos and color
        this.testMenu.gl.enableVertexAttribArray(0);
        this.testMenu.gl.vertexAttribPointer(0,2,this.testMenu.gl.FLOAT,this.testMenu.gl.FALSE,6 * Float32Array.BYTES_PER_ELEMENT,0);
        this.testMenu.gl.enableVertexAttribArray(1);
        this.testMenu.gl.vertexAttribPointer(1,4,this.testMenu.gl.FLOAT,this.testMenu.gl.FALSE,6 * Float32Array.BYTES_PER_ELEMENT,2 * Float32Array.BYTES_PER_ELEMENT);
        //unbind
        this.testMenu.gl.bindBuffer(this.testMenu.gl.ARRAY_BUFFER,null);
        this.testMenu.gl.bindBuffer(this.testMenu.gl.ELEMENT_ARRAY_BUFFER,null);
        
        
        this.testMenu.gl.bindVertexArray(this.lineVao);
        this.testMenu.gl.bindBuffer(this.testMenu.gl.ARRAY_BUFFER,this.lineVbo);
        this.testMenu.gl.bindBuffer(this.testMenu.gl.ELEMENT_ARRAY_BUFFER,this.lineIbo);

        this.testMenu.gl.bufferData(this.testMenu.gl.ARRAY_BUFFER,new Float32Array(this.lineVertex),this.testMenu.gl.STATIC_DRAW);
        this.testMenu.gl.bufferData(this.testMenu.gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.lineIndex),this.testMenu.gl.STATIC_DRAW);

        //enable pos and color
        this.testMenu.gl.enableVertexAttribArray(0);
        this.testMenu.gl.vertexAttribPointer(0,2,this.testMenu.gl.FLOAT,this.testMenu.gl.FALSE,6 * Float32Array.BYTES_PER_ELEMENT,0);
        this.testMenu.gl.enableVertexAttribArray(1);
        this.testMenu.gl.vertexAttribPointer(1,4,this.testMenu.gl.FLOAT,this.testMenu.gl.FALSE,6 * Float32Array.BYTES_PER_ELEMENT,2 * Float32Array.BYTES_PER_ELEMENT);

        this.testMenu.gl.bindBuffer(this.testMenu.gl.ARRAY_BUFFER,null);
        this.testMenu.gl.bindBuffer(this.testMenu.gl.ELEMENT_ARRAY_BUFFER,null);
        this.testMenu.gl.bindVertexArray(null);

        this.testMenu.gl.lineWidth(10.0);

        this.testMenu.gl.shader = new Shader(this.testMenu.gl,vertexShaderSource,fragmentShaderSource);
        this.testMenu.gl.shader.Bind(this.testMenu.gl);
    }

    OnInit(){

    }

    OnUpdate(){
       
        
    }

    OnRender(){
        this.testMenu.gl.clearColor(this.m_Color[0],this.m_Color[1],this.m_Color[2],this.m_Color[3]);
        this.testMenu.gl.clear( this.testMenu.gl.COLOR_BUFFER_BIT| this.testMenu.gl.DEPTH_BUFFER_BIT);
        
        this.testMenu.gl.bindVertexArray(this.vao);
        this.testMenu.gl.bindBuffer(this.testMenu.gl.ELEMENT_ARRAY_BUFFER,this.ibo);
        this.testMenu.gl.drawElements(this.testMenu.gl.TRIANGLES,this.index.length,this.testMenu.gl.UNSIGNED_SHORT,null);
    
        this.testMenu.gl.bindVertexArray(this.lineVao);
        this.testMenu.gl.bindBuffer(this.testMenu.gl.ELEMENT_ARRAY_BUFFER,this.lineIbo);
        this.testMenu.gl.drawElements(this.testMenu.gl.LINES,this.lineIndex.length,this.testMenu.gl.UNSIGNED_SHORT,null);
    }
}