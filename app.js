function Init(){
    console.log("this is working!");

    let canvas = document.getElementById("CANVAS");

    let gl = canvas.getContext("webgl");
    if(!gl) alert("Your brower doesn't support webgl!");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //change webgl rendering space
    gl.viewport(0,0,window.innerWidth,window.innerHeight);
    let color = [1,0,1,1];
    gl.clearColor(color[0],color[1],color[2],color[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);
}