class InputHandler {
    constructor(appScreen) {
      this.appScreen = appScreen;
      
      this.m_keyMap = new Map();
      this.m_keyPreMap = new Map();
      this.m_MousePos = {x: undefined, y: undefined};
      //throttle variable
      this._throttle = {previousCall:performance.now()};

      document.addEventListener("keydown", (event) => {
        if(this.m_keyMap.has(event.key)){
          this.m_keyMap[event.key] = true;
        }else{
          this.m_keyMap.set(event.key,true);
        }
      });
  
      document.addEventListener("keyup", (event) => {
        if(this.m_keyMap.has(event.key)){
          this.m_keyMap[event.key] = false;
        }else{
          this.m_keyMap.set(event.key,false);
        }
      });

      canvas.addEventListener("mouseup",(event)=>{
        var pos = {x:event.clientX,y:event.clientY};
        this.onMouseUp(pos);
      });
      
      canvas.addEventListener("mousemove",(event)=>{
        var pos = {x:event.clientX,y:event.clientY};
        this.onMouseMove(pos);
      });
      
      window.addEventListener('resize', ()=>{
        this.onResize();
      }, false);
      
  }


  KeySetup(key){
    this.m_keyMap.set(key,false);
  }

  OnUpdate(){
    this.m_keyMap.forEach((value,key)=>{
      this.m_keyPreMap[key] = this.m_keyMap[key];
    })
  }
  isKeyDown(key){
      if(this.m_keyMap.has(key))
        return this.m_keyPreMap[key];
      else  return false;
  }

  wasKeyDown(key){
    if( this.m_keyPreMap.has(key)){
      return this.m_keyPreMap[key];
    }else{
      return false;
    }
  }

  isKeyPress(key){
    if (this.isKeyDown(key) == true && this.wasKeyDown(key) == false) {
      return true;
    }
    return false;
  }

  onMouseUp(pos) {
    let screen = this.appScreen.screenMenu.InWhichScreen(pos);
    if(screen == "Create cell"){
      this.appScreen.screenMenu.FindScreen(screen).OnGridClick(this.appScreen.screenMenu.ParseMouseCoords(pos),this.appScreen.color);
    }else if(screen == "Game of life"){
      onSendMessage('Click',{pos:pos,grid:this.appScreen.screenMenu.FindScreen("Create cell").grid});
    }
  }
  
  onMouseMove(pos) {
    let screen = this.appScreen.screenMenu.InWhichScreen(pos);
    this.appScreen.screenMenu.FindScreen("Analysis").mouseInfo(screen,this.appScreen.screenMenu.ParseMouseCoords(pos));
    this.throttle(onSendMessage,['Cursor move',{pos:pos,color:this.appScreen.color}],100)(this._throttle);
  }
  
  onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.appScreen.Resize();
  }
  
  // limit the number of events per second
  throttle(callback, argu,delay) {
    return function(variable) {
      let time = performance.now();
      if ((time - variable.previousCall) >= delay) {
        variable.previousCall = time;
        callback.apply(null, argu);
      }
    };
  }
}
  