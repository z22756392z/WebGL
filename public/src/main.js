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
    socket.send("new client");
  }

  socket.onerror = function (event) {
    console.log('socket:onerror()...')
  }
  
  socket.onclose = function (event) {
    console.log('socket:onclose()...')
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
   
    app.receiveMessage(data);
  }

  canvas = document.getElementById('App');
  gl = canvas.getContext("webgl2");
  var app = new App();

  app.Start();
})();
