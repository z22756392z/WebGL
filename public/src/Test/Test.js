class Test {
    constructor(TestMenu){
        this.testMenu = TestMenu;
    };
    OnInit() {
        
    }
    OnUpdate(inputManger){

    }
    OnRender(){

    }
}

class TestMenu{
    constructor(name,T,gl,resource){
        this.resource = resource;
        this.m_Tests = [];//Test
        this.m_Tests.push({name: name,test: T});
        this.gl = gl;
        this.currentTest = new T(this);
    }
    

    RegisterTest(name,T){
        this.m_Tests.push({name: name,test:T});
    }

    OnUiRender(){

    }

    SwitchTest(name){
        for(let i = 0 ; i < this.m_Tests.length ; i ++){
            if(name == this.m_Tests[i].name) this.currentTest = new this.m_Tests[i].test(this);
        }
    }
}