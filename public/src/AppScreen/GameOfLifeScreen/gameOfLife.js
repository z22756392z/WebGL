class GameOfLife extends Screen{
    constructor(screenCoord ,inputHandler,option){
        super(screenCoord,inputHandler);

        this.grid = new GameOfLifeGrid(option[0],option[1],option[2]);
        this.cursor = new GameOfLifeCursor(option[3],option[4]);
       
        this.InitGL();
        this.OnSpawn();
    }

    InitGL(){
        //blend mode
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
        this.grid.InitGL();
        this.cursor.InitGL();
    }

    OnSpawn(){
        this.grid.OnSpawn();
        this.cursor.OnSpawn();
        //other stuff
        this.isPause = false;
    }
   
    OnUpdate(){
        //input process
        if(this.inputHandler.isKeyPress('p')){
            this.isPause = !this.isPause;
        }    
        //Pause
        if(this.isPause) return;
        
        this.grid.OnUpdate();
        this.cursor.OnUpdate();
    }

    OnRender(){
        super.OnRender();
        this.grid.OnRender();
        this.cursor.OnRender();
    }

    Resize(screenCoord){
        super.Resize(screenCoord);
        this.OnSpawn();
    }

    BornCell(pos,grid){
        this.grid.BornCell(pos,grid);
    }

    DrawCursor(pos,color){
        this.cursor.DrawCursor(pos,color);
    }
}