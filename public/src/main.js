'use strict';//不能使用未被定義的變數
//global
var canvas;
var gl;
var onSendMessage;

//invoke right away
(function() {
  var socket = new WebSocket("ws://"+window.location.hostname+":8080");
  
  socket.onopen = function (event) {
    console.log('socket:onopen()...')
    onSendMessage("speak","a new client!");
  }

  socket.onerror = function (event) {
    console.log('socket:onerror()...')
  }
  
  socket.onclose = function (event) {
    console.log('socket:onclose()...')
    onSendMessage("speak","a client leave");
  }

  onSendMessage = function(t,option) {
    socket.send(JSON.stringify({
      type:t,
      option: option
    }))
  }

  socket.onmessage = function(event){
    var data = JSON.parse(event.data);

    if(data.type == "speak"){
      console.log(data.option);
      return;
    } 
   
    let screen = app.gameScreen.screenMenu.InWhichScreen(data.option.pos);
    if(screen == "Game of life"){
      if(data.type == "Click"){
        console.log('onmessage: '+ data.type + " at: " + data.option.pos.x + " " +data.option.pos.y);
        app.gameScreen.screenMenu.FindScreen("Game of life").BornCell(app.gameScreen.screenMenu.ParseMouseCoords(data.option.pos),data.option.grid);
      }
      else if(data.type == "Cursor move"){
        app.gameScreen.screenMenu.FindScreen("Game of life").DrawCursor(app.gameScreen.screenMenu.ParseMouseCoords(data.option.pos),data.option.color);
      }
    }
  }
  
  canvas = document.getElementById('App');
  gl = canvas.getContext("webgl2");
  var app = new App();

  app.Start();
})();
