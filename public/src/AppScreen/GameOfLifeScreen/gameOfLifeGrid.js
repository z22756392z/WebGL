class GameOfLifeGrid{
    constructor(resolution,color,deadCellColor){
        this.resolution = resolution;
        this.color = color;
        this.deadCellColor = deadCellColor;
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
        this.col = parseInt(canvas.width/this.resolution);
        this.row = parseInt(canvas.height/this.resolution);

        this.grid = makeGrid(this.col,this.row,this.resolution,this.deadCellColor);
        FillBlank(this.grid,this.col,this.row,this.deadCellColor);
        //FillRand(this.grid,this.col,this.row,this.color,this.resolution,this.deadCellColor);

        this.next = makeGrid(this.col,this.row,this.resolution,this.deadCellColor);
        FillBlank(this.next,this.col,this.row,this.deadCellColor);

        this.Time = 0;
        this.OnSpawnGL();
    }

    OnSpawnGL(){
        glMatrix.mat4.identity(this.projMatrix);
        this.projMatrix = glMatrix.mat4.orthoNO(this.projMatrix,0,canvas.width,canvas.height,0,-1,1);
        //create new grid buffer
        this.gridBufferData = new Float32Array(this.col * this.row * 24);
        this.gridIndexBufferData = new Uint16Array(this.col * this.row * 6);
        //grid shader
        this.shader.Bind(gl);
        this.shader.SetUniformMatrix4fv(gl,"u_MVP",this.projMatrix);
        this.shader.SetUniform1f(gl,"u_T",this.Time);
        this.shader.UnBind(gl);
    }

    OnUpdate(){
        this.gridUpdate();
        //keep track of index buffer count
        let count = 0;
        //loop through each cell to update buffer
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
                    }else if(k == 4){
                        this.gridBufferData[j* this.col * 24 +i * 24+k + 6 ] = 0.75;
                        this.gridBufferData[j* this.col * 24 +i * 24+k + 12] = 0.75;
                        this.gridBufferData[j* this.col * 24 +i * 24+k + 18] = 0.75
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
        gl.bufferData(gl.ARRAY_BUFFER,this.gridBufferData,gl.DYNAMIC_DRAW);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.gridIndexBufferData,gl.DYNAMIC_DRAW);
        //unbind buffer
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
        gl.bindVertexArray(null);

        this.Time+= 0.01;
        this.shader.Bind(gl);
        //this.shader.SetUniformMatrix4fv(gl,"u_MVP",this.projMatrix);
        this.shader.SetUniform1f(gl,"u_T",this.Time);
        this.shader.UnBind(gl);
    }

    OnRender(){
        this.shader.Bind(gl);
        gl.bindVertexArray(this.gridVAO);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.gridIBO);
        gl.drawElements(gl.TRIANGLES, this.gridIndexBufferData.length,gl.UNSIGNED_SHORT,null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
        gl.bindVertexArray(null);
        this.shader.UnBind(gl);
    }

    gridUpdate(){
        //don't want to change state base on each iteration
        FillBlank(this.next,this.col,this.row,this.deadCellColor);

        for(let i = 0 ;  i < this.col; i ++){
            for(let j = 0 ; j < this.row ; j++){
                let neighbors = this.CountNeighbors(i,j);
                //rule
                let state = this.grid[i][j].m_State;
                if(state == 1 && (neighbors < 2||neighbors > 3)){
                    this.next[i][j].OnSpawn(0,this.deadCellColor);
                }
                else if(state == 0 && neighbors == 3){
                    this.next[i][j].OnSpawn(1,this.newColor);
                }else{
                    this.next[i][j].OnSpawn(state,
                        [this.grid[i][j].data[2],this.grid[i][j].data[3],this.grid[i][j].data[4],this.grid[i][j].data[5]]);
                }
            }
        }
        //swap
        var swap = function (x){return x};
        this.grid = swap(this.next, this.next=this.grid);
    }
    CountNeighbors(i,j){
        this.newColor = [0,0,0,0];
        let aliveCount = 0;
        let col = 0;
        let row = 0;
        for(let k = -1  ; k < 2 ; k++){
            for(let z = -1  ; z < 2 ; z++){
                col = (i + k + this.col) % this.col;
                row = (j + z + this.row) % this.row;
                if(this.grid[col][row].m_State == 1){
                    aliveCount++
                    this.MergeColor(3,[this.grid[col][row].data[2],this.grid[col][row].data[3],this.grid[col][row].data[4],this.grid[col][row].data[5]]);
                };                       
            }
        }//don't count itself
        aliveCount -= this.grid[i][j].m_State;
        return aliveCount;
    }

    MergeColor(count,color){
        for(let i = 0 ; i < 4 ; i++){
            this.newColor[i] += color[i]/count;
        }
    }

    BornCell(pos,grid){
        let bornPos = CheckInGrid(this.grid,pos,this.col,this.row,this.resolution);

        if(bornPos == null){
            console.log("Out of broder!")
            return;
        } 
        console.log("Born Cell! : "+ "at: " + bornPos.x + " " + bornPos.y);

        let col = grid.length;
        let row = grid[0].length;
        let centerIndex = FindCenterIndex(col,row);
        for(let i = 0 ; i < col ; i++){
            for(let j = 0 ; j < row ; j++){
                let x = bornPos.x + i - centerIndex.x;
                let y = bornPos.y + j - centerIndex.y;
                if(x < 0 || x > this.col - 1)
                    continue;
                if(y < 0 || y > this.row - 1)
                    continue;
                if(grid[i][j].m_State == 1){
                    this.grid[x][y].OnSpawn(1,[grid[i][j].data[2],grid[i][j].data[3],grid[i][j].data[4],grid[i][j].data[5]]);
                }
            }
        }
    }
}