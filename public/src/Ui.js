class UI{
    
    constructor(gl){
        this.mUIElements = [];

    }

    Button(name,xPos,yPos){
        this.mUIElements.push(new Button(name,xPos,yPos));
    }

    Button(name,xPos,yPos,width,height){
        this.mUIElements.push(new Button(name,xPos,yPos,width,height));
    }

    OnUIUpdate(){
        this.mUIElements.forEach(element => {
            element.OnUpdate();
        });
    }

    OnUIRender(){
        this.mUIElements.forEach(element => {
            element.OnRender();
        });
    }

}
class UIElement{
    constructor(gl){
        this.gl = gl;
    };
    OnInit() {
        
    }
    OnUpdate(){

    }
    OnRender(){

    }
}
class Window extends UIElement{
    constructor(gl){
        super(gl);
    };
    OnInit() {
        
    }
    OnUpdate(){

    }
    OnRender(){

    }
}

class Button extends UIElement{
    constructor(gl,name,xPos,yPos){
        super(gl);
        this.name = name;
        this.pos = {x: xPos, y: yPos};
        this.width = 50;
        this.height = 100;
        this.isClick = false;
        this.isMouseHover = false;
        this.TestInit();
    }
    constructor(name,xPos,yPos,width,height) {
        super();
        this.name = name;
        this.pos = {x: xPos, y: yPos};
        this.width = width;
        this.height = height;
        this.isClick = false;
        this.isMouseHover = false;
        this.TestInit();
    }

    TestInit(){
        this.test = new Test(this.name);
    }

    OnUpdate(){
        this.test.OnUpdate();
    }
    OnRender(){
        this.test.OnRender();
    }
}

class Text extends UIElement{
    constructor(gl,name){
        super(gl);
        this.name = name;
    };
    OnInit() {
        
    }
    OnUpdate(){

    }
    OnRender(){

    }
}
