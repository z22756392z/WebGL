class Screen{
    constructor(screenCoord,inputHandler){
        this.xPos = screenCoord[0];
        this.yPos = screenCoord[1];
        this.width = screenCoord[2];
        this.height = screenCoord[3];
        this.inputHandler = inputHandler;
    }

    OnUpdate(){

    }

    OnRender(){
        gl.viewport(this.xPos,this.yPos,this.width,this.height);
    }
    //is called once the window size changed
    Resize(screenCoord){
        this.xPos = screenCoord[0];
        this.yPos = screenCoord[1];
        this.width = screenCoord[2];
        this.height = screenCoord[3];
    }
}

class ScreenMenu{
    constructor(inputHandler,xLength){
        this.inputHandler = inputHandler;

        this.m_Screens = [];//name,screen
        this.slices = 0;
        this.xLength = xLength;
        this.yLength = 1;
    }

    RegisterScreen(name,S,option/*array*/){
        this.slices++;
        this.screenCoords = this.ScreenSlice(this.slices);
        this.m_Screens.push({name: name,screen:new S(this.screenCoords[this.slices-1],this.inputHandler,option)});
        this.Resize();
    }
    //loop through all registered screen and call Resize function 
    Resize(){
        this.screenCoords = this.ScreenSlice(this.slices);
        for(let i = 0 ; i < this.m_Screens.length ; i ++){
            //parse to world coord
            let  viewport = this.screenCoords[i];
            viewport[1] = (canvas.height - viewport[3]) - viewport[1];
           this.m_Screens[i].screen.Resize(viewport);
        }
    }
    //to calculate each screen coords according to offered data
    ScreenSlice(number){
        let screenCoords = new Array(number);
        let x = 0;
        let y = 0;
        this.yLength = parseInt(number / this.xLength);
        for(let i = 0 ; i <  number ; i++){
            screenCoords[i] = new Array(4);
            screenCoords[i][2] = parseInt(canvas.width / this.xLength);//width  
            screenCoords[i][3] = parseInt(canvas.height / this.yLength);//height
            screenCoords[i][0] = screenCoords[i][2] * x;//x pos
            screenCoords[i][1] = screenCoords[i][3] * y;//y pos
            x++;
            if(x % this.xLength == 0){
                y++;
                x = 0;
            }
        }
        return screenCoords;
    }
    ScreenIndex(pos){
        let x = parseInt(pos.x / (canvas.width / this.xLength));
        let y = parseInt(pos.y / (canvas.height / this.yLength));
        if(x > this.xLength || x < 0)
            return null;
        if(y > this.yLength || y < 0)
            return null;
        return {x:x,y:y};
    }
    //find in which screen and return its name base on canvas pos
    InWhichScreen(pos){
        let index = this.ScreenIndex(pos);
        if(index == null)   return;
        return (this.m_Screens[index.y * this.xLength + index.x].name);
    }
    //parse canvas mouse pos to screen mouse pos
    ParseMouseCoords(pos){
        let index = this.ScreenIndex(pos);
        let newPos = {x:(pos.x - ((canvas.width / this.xLength) * index.x))* this.xLength, y:(pos.y - ((canvas.height / this.yLength) * index.y))* this.yLength};
        return newPos;
    }
    
    FindScreen(name){
        for(let i = 0 ; i < this.m_Screens.length ; i ++){
            if(name == this.m_Screens[i].name) {
                return this.m_Screens[i].screen;
            }
        }
        return console.log("Can't find screen: " + name);
    }
    
    OnUpdate(){
        for(let i = 0 ; i < this.m_Screens.length ; i++){
            this.m_Screens[i].screen.OnUpdate();
        }
    }

    OnRender(){
        gl.clearColor(0.2,0.2,0.2,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        for(let i = 0 ; i < this.m_Screens.length ; i++){
            this.m_Screens[i].screen.OnRender();
        }
    }
}