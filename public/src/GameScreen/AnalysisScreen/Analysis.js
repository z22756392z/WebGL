class Analysis extends Screen{
    constructor(screenCoord,inputHandler,option){
        super(screenCoord,inputHandler);

        this.font = new Font(option[0]);
        this.dynamciFont = new Font(option[0]);
        this.gameOfLife = option[1];
        
        this.InitText();
    }

    InitText(){
       
        this.fontColor = [0.8,0.3,0.5,1];
        this.font.Text("Game of  life rule",64,{x: 100 , y: 50},this.fontColor);
        this.font.Text("Any live cell with two or three live neighbours survives",40,{x: 200 , y: 200},this.fontColor);
        this.font.Text("Any dead cell with three live neighbours becomes a live cell",40,{x: 200 , y: 300},this.fontColor);
        this.font.Text("All other live cells die in the next generation",40,{x: 200 , y: 400},this.fontColor);
        this.font.Text("Game of  life info",64,{x: 100 , y: 550},this.fontColor);
    }

    OnUpdate(){
        this.dynamciFont.Text("Current grid  col: "+this.gameOfLife.grid.col+"  row: "+this.gameOfLife.grid.row
                    ,40,{x: 200 , y: 700},this.fontColor);
        this.dynamciFont.Text("Current Screen: "+this.screen,40,{x: 200 , y: 800},this.fontColor);
    }

    OnRender(){
        super.OnRender();

        this.font.OnRender();
        this.dynamciFont.OnRender();
    }

    Resize(screenCoord){
        super.Resize(screenCoord);
    }

    mouseInfo(screen){
        this.screen = screen;
    }
}