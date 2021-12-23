//grid element data
class Cell{
    constructor(xPos,yPos,cellColor,state){
        this.data = [];
        this.data[0] = xPos;
        this.data[1] = yPos;
        this.OnSpawn(state,cellColor);
    }

    OnSpawn(state,cellColor){
        this.data[2] = cellColor[0];
        this.data[3] = cellColor[1];
        this.data[4] = cellColor[2];
        this.data[5] = cellColor[3];
        this.m_State = state;
    }
}

function makeGrid(col,row,resolution,deadColor){
    let  arr = new Array(col);
    for(let i = 0 ; i <col ;i ++){
        arr[i] = new Array(row);
    }
    for(let i = 0 ; i < col ; i++){
        for(let j = 0 ; j < row; j++){
            arr[i][j] = new Cell(i * resolution, j * resolution,deadColor,0);
        }
    }
    return arr;
}

function FillRand(grid,col,row,aliveColor,deadColor){
    for(let i = 0 ; i < col ; i++){
        for(let j = 0 ; j < row; j++){
            if(Math.floor(Math.random()* 2)){
                grid[i][j].OnSpawn(1, aliveColor);
                
            }else{
                grid[i][j].OnSpawn(0,deadColor);
            }
        }
    }
}
function FillBlank(grid,col,row,deadColor){
    for(let i = 0 ; i < col ; i++){
        for(let j = 0 ; j < row; j++){
            grid[i][j].OnSpawn(0,deadColor);
        }
    }
}

//if inside the grid return its x, y else null
function CheckInGrid(grid,pos,col,row,resolution){
    if(grid[0][0].data[0] > pos.x || grid[col-1][0].data[0] + resolution< pos.x)
        return null;
    if(grid[0][0].data[1] > pos.y || grid[0][row-1].data[1] + resolution< pos.y)
        return null;
    let newPos = {x:Math.floor(pos.x/resolution),y: Math.floor(pos.y/resolution)};
    return newPos;
}

function FindCenterIndex(col,row) {
    return {x: Math.floor(col / 2), y: Math.floor(row/2)}
}
