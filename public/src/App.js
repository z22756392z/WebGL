class App{
    constructor(){

        if(!gl) {
            alert("Your brower doesn't support webgl!");
            return;
        }
        console.log("webgl2 is working!");
        
        //init app screen
        this.appScreen = new AppScreen();
    }

    async Start(){
    //load res
        let cursorImage = await this.loadImage('./res/asset/cursor.png');
        let fontImage = await this.loadImage('./res/asset/Jokeman_Bitmap_0.png');
        this.appScreen.Start({cursorImage: cursorImage, fontImage: fontImage});
    }

    Exit(){

    }

    loadImage(fileName){
        return new Promise( (resolve) =>{
            var image = new Image();
            image.onload = () =>{
                console.log(fileName + "is loaded");
                resolve(image);
            }
            image.src = fileName;
        })
    }

    receiveMessage(data){
        let screen = this.appScreen.screenMenu.InWhichScreen(data.option.pos);
        if(screen == "Game of life"){
            if(data.type == "Click"){
                console.log('onmessage: '+ data.type + " at: " + data.option.pos.x + " " +data.option.pos.y);
                this.appScreen.screenMenu.FindScreen("Game of life").BornCell(this.appScreen.screenMenu.ParseMouseCoords(data.option.pos),data.option.grid);
        }
        else if(data.type == "Cursor move"){
            this.appScreen.screenMenu.FindScreen("Game of life").DrawCursor(this.appScreen.screenMenu.ParseMouseCoords(data.option.pos),data.option.color);
        }
    }

    }

}