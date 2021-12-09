class TestClearColor extends Test{
    constructor(TestMenu){
        super(TestMenu);
        this.m_Color = [1,1,0,1];
    }

    OnInit(){

    }

    OnUpdate(){
       
        
    }

    OnRender(){
        this.testMenu.gl.clearColor(this.m_Color[0],this.m_Color[1],this.m_Color[2],this.m_Color[3]);
        this.testMenu.gl.clear( this.testMenu.gl.COLOR_BUFFER_BIT| this.testMenu.gl.DEPTH_BUFFER_BIT);
    }
}