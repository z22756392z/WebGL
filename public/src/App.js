class App{
    constructor(){

        if(!gl) {
            alert("Your brower doesn't support webgl!");
            return;
        }
        console.log("webgl2 is working!");
        
        //init game screen
        this.gameScreen = new GameScreen();
    }

    async Start(){
    //load res
        let cursorImage = await this.loadImage('./res/asset/cursor.png');
        let fontImage = await this.loadImage('./res/asset/Jokeman_Bitmap_0.png');
        this.gameScreen.Start({cursorImage: cursorImage, fontImage: fontImage});
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

}