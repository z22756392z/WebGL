//this class is mostly event driven

class CellCreate extends Screen{
    constructor(screenCoord ,inputHandler,option){
        super(screenCoord ,inputHandler);

        this.col = option[0];
        this.color = option[1];
        this.deadCellColor = option[2];
        
        this.InitGL();
        this.OnSpawn();
    }

    InitGL(){
        //grid vertex array object , vertex buffer, index buffer setup
        this.gridVAO = gl.createVertexArray();
        this.gridVBO = gl.createBuffer();
        this.gridIBO = gl.createBuffer();

        gl.bindVertexArray(this.gridVAO);
        gl.bindBuffer(gl.ARRAY_BUFFER,this.gridVBO);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.gridIBO);
        // enable vertex array attribute
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0,2,gl.FLOAT,gl.FALSE,6 * Float32Array.BYTES_PER_ELEMENT,0);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1,4,gl.FLOAT,gl.FALSE,6 * Float32Array.BYTES_PER_ELEMENT,2 * Float32Array.BYTES_PER_ELEMENT);
        
        gl.bindVertexArray(null);

        //shader
        this.shader = new Shader(gl,vertexShaderSource,fragmentShaderSource);

        //init mvp matrix
        this.projMatrix = new Float32Array(16);
    }

    OnSpawn(){
        this.resolution = parseInt(canvas.width / this.col);
        this.row = parseInt(canvas.height / this.resolution);
        this.centerIndex = FindCenterIndex(this.col,this.row);
        this.grid =  makeGrid(this.col,this.row,this.resolution,this.color,this.deadCellColor);
        FillBlank(this.grid,this.col,this.row,this.deadCellColor);
        //fill center
        this.grid[this.centerIndex.x][this.centerIndex.y].OnSpawn(1,this.color);
        
        //GL stuff
        glMatrix.mat4.identity(this.projMatrix);
        this.projMatrix = glMatrix.mat4.orthoNO(this.projMatrix,0,canvas.width,canvas.height,0,-1,1);
        //create new grid buffer
        this.gridBufferData = new Float32Array(this.col * this.row * 24);
        this.gridIndexBufferData = new Uint16Array(this.col * this.row * 6);
        
        
        //loop through each cell to init buffer
        let count = 0;
        for(let i = 0 ; i < this.col ; i++){
            for(let j = 0 ; j < this.row ; j++){
                let x = this.grid[i][j].data[0] + this.resolution;
                let y = this.grid[i][j].data[1] + this.resolution;
                for(let k = 0 ; k < 6 ; k++){
                    let now = this.grid[i][j].data[k]; 
                    this.gridBufferData[j* this.col * 24 +i * 24+ k] = now;
                    if(k == 0){
                        this.gridBufferData[j* this.col * 24 +i * 24+k + 6] =  x;
                        this.gridBufferData[j* this.col * 24 +i * 24+k + 12] = now;
                        this.gridBufferData[j* this.col * 24 +i * 24+k + 18] = x;
                    }
                    else if(k == 1){
                        this.gridBufferData[j* this.col * 24 +i * 24+k + 6] = now; 
                        this.gridBufferData[j* this.col * 24 +i * 24+k + 12] = y;
                        this.gridBufferData[j* this.col * 24 +i * 24+k + 18] = y;
                    }
                    else{
                        this.gridBufferData[j* this.col * 24 +i * 24+k + 6] = now; 
                        this.gridBufferData[j* this.col * 24 +i * 24+k + 12] = now; 
                        this.gridBufferData[j* this.col * 24 +i * 24+k + 18] = now; 
                    }
                }
                this.gridIndexBufferData[i* this.row *6 +j * 6] = count;
                this.gridIndexBufferData[i* this.row *6 +j * 6+ 1] = count + 1;
                this.gridIndexBufferData[i* this.row *6 +j * 6+ 2] = count + 2;
                this.gridIndexBufferData[i* this.row *6 +j * 6+ 3] = count + 1;
                this.gridIndexBufferData[i* this.row *6 +j * 6+ 4] = count + 2;
                this.gridIndexBufferData[i* this.row *6 +j * 6+ 5] = count + 3;
                count += 4;
            }
        }
        //bind vertex array
        gl.bindVertexArray(this.gridVAO);
        //bind buffer
        gl.bindBuffer(gl.ARRAY_BUFFER,this.gridVBO);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.gridIBO);
        //sub data
        gl.bufferData(gl.ARRAY_BUFFER,this.gridBufferData,gl.STATIC_DRAW);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.gridIndexBufferData,gl.STATIC_DRAW);
        //unbind buffer
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
        gl.bindVertexArray(null);

        //grid shader
        this.shader.Bind(gl);
        this.shader.SetUniformMatrix4fv(gl,"u_MVP",this.projMatrix);
        this.shader.SetUniform1f(gl,"u_T",this.Time);
        this.shader.UnBind(gl);
    }

    gridUpdate(pos,color){
        let newColor,bufferIndex;
        let newBuffer = new Float32Array(24);
        if(this.grid[pos.x][pos.y].m_State == 1){
            newColor = this.deadCellColor;
            this.grid[pos.x][pos.y].OnSpawn(0,newColor);
        }else{
            newColor = color;
            this.grid[pos.x][pos.y].OnSpawn(1,newColor);
        }
        
        for(let k = 0 ; k < 6 ; k++){
            if(k == 0 || k == 1){// pos unchange
                newBuffer[k] = this.gridBufferData[pos.y * this.col * 24 + pos.x * 24 + k];
                newBuffer[k + 6] = this.gridBufferData[pos.y * this.col * 24 + pos.x * 24 + k + 6];
                newBuffer[k + 12] = this.gridBufferData[pos.y * this.col * 24 + pos.x * 24 + k + 12];
                newBuffer[k + 18] = this.gridBufferData[pos.y * this.col * 24 + pos.x * 24 + k + 18];
            }
            else{//color change
                newBuffer[k] = newColor[k-2];
                newBuffer[k + 6] = newColor[k-2];
                newBuffer[k + 12] = newColor[k-2];
                newBuffer[k + 18] = newColor[k-2];
            }
        }
        bufferIndex = pos.y * this.col * 24 + pos.x * 24;
        //bind vertex array
        gl.bindVertexArray(this.gridVAO);
        //bind buffer
        gl.bindBuffer(gl.ARRAY_BUFFER,this.gridVBO);
        //sub data
        gl.bufferSubData(gl.ARRAY_BUFFER,bufferIndex * Float32Array.BYTES_PER_ELEMENT,newBuffer);
        //unbind buffer
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
        gl.bindVertexArray(null);
        
    }

    OnRender(){
        super.OnRender();
        this.shader.Bind(gl);
        gl.bindVertexArray(this.gridVAO);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.gridIBO);
        gl.drawElements(gl.TRIANGLES, this.gridIndexBufferData.length,gl.UNSIGNED_SHORT,null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
        gl.bindVertexArray(null);
        this.shader.UnBind(gl);
    }

    Resize(screenCoord){
        super.Resize(screenCoord);
        this.OnSpawn();
    }

    OnGridClick(pos,color){
        this.gridUpdate(CheckInGrid(this.grid,pos,this.col,this.row,this.resolution),color);
        this.OnUpdate();
    }
}