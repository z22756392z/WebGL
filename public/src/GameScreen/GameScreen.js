var menu;
class GameScreen{
    constructor(){
        // initialize the timer and start the animation
        this.timer = {
            frameCount  : 0,
            fps         : 0,
            fpsInterval : 0,
            startTime   : 0,
            now         : 0,
            then        : 0,
            elapsed     : 0,
        }

        //request Animation Frame
        this.reqAnim = undefined;
        this.needResize = false;
        
        //init variable for screens
        this.color = [Math.random(),Math.random(),Math.random(),1];
        this.deadCellColor = [0,0,0,1];
        this.cursorInverseRatioSize = 70;
        //input handler
        this.inputHandler = new InputHandler(this);
        //init screen menu
        this.screenMenuXLength = 2;
        this.screenMenu = new ScreenMenu(this.inputHandler,this.screenMenuXLength);
        menu = this.screenMenu;
        //menu = new TestMenu("3D Texture",Test3dTexture);
        //this.menu = new TestMenu("Clear Color",TestCell,gl);
    }

    Start(resource){
        this.RegisterScreen(resource);
        this.inputHandler.onResize();
        // the animation loop calculates time elapsed since the last loop
        // and only draws if your specified fps interval is achieved
        let loop = () =>{
            
            this.reqAnim = undefined;
            // request another frame
            this.ReqAnimStart(loop);

            // calc elapsed time since last loop
            this.timer.now = performance.now();
            this.timer.elapsed = this.timer.now - this.timer.then;

            if(this.needResize){
                this.screenMenu.Resize();
                this.needResize = false;
            }
            
            // if enough time has elapsed, draw the next frame
            if (this.timer.elapsed > this.timer.fpsInterval) {
               
                this.timer.then = this.timer.now - (this.timer.elapsed % this.timer.fpsInterval);
                

                this.inputHandler.OnUpdate();
                //this.menu.currentTest.OnUpdate(this.inputHandler);
                //this.menu.currentTest.OnRender();
            
                this.screenMenu.OnUpdate();
                this.screenMenu.OnRender();
            }
            
        };
        this.StartAnimating(10,loop);
    }

    RegisterScreen(resource){
        this.resource = resource;
        
        this.screenMenu.RegisterScreen("Game of life",GameOfLife,[30,this.color,this.deadCellColor,this.resource.cursorImage,this.cursorInverseRatioSize]);
        this.screenMenu.RegisterScreen("Create cell",CellCreate,[9,this.color,this.deadCellColor]);
        this.screenMenu.RegisterScreen("Analysis",Analysis,[resource.fontImage,this.screenMenu.FindScreen("Game of life")]);
        this.screenMenu.RegisterScreen("Manual",Manual,[resource.fontImage]);
        
    }

    StartAnimating(fps,loop) {
        this.timer.fps = fps;
        this.timer.fpsInterval = 1000 / this.timer.fps;
        this.timer.then = performance.now();
        this.timer.startTime = this.timer.then;
        this.ReqAnimStart(loop);
    }

    //requestAnimationFrame start
    ReqAnimStart(loop) {
        if (!this.reqAnim) {
            this.reqAnim = window.requestAnimationFrame(loop);
        }
    }
    //requestAnimationFrame stop
    ReqAnimStop() {
        if (this.reqAnim) {
            window.cancelAnimationFrame(reqAnim);
            this.reqAnim = undefined;
        }
    }

    Resize(){
        this.needResize = true;
    }
}