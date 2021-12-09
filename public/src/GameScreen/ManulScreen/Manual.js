class Manual extends Screen{
    constructor(screenCoord,inputHandler,option){
        super(screenCoord,inputHandler);

        this.font = new Font(option[0]);
        this.gameOfLife = option[1];
        
        this.InitText();
    }

    InitText(){
        this.fontColor = [0.8,0.3,0.5,1];
        
        this.font.Text("Manual",64,{x: 0 , y: 50},this.fontColor);
        this.font.Text("Use ctrl + mouse wheel to resize grid",40,{x: 100 , y: 200},this.fontColor);
        this.font.Text("Mouse Click on top left screen would spawn cell",40,{x: 100 , y: 300},this.fontColor);
        this.font.Text("Use top right screen to create the shape of cell",40,{x: 100 , y: 400},this.fontColor);
        this.font.Text("The cells you spawn are sended to connected clients with same pos and color",40,{x: 100 , y: 500},this.fontColor);
    }

    OnRender(){
        super.OnRender();

        this.font.OnRender();
    }

    Resize(screenCoord){
        super.Resize(screenCoord);
    }
}