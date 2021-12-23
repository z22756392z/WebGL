
## 網頁說明

[Game of Life](https://zh.wikipedia.org/wiki/康威生命游戏)的網頁版

### 特色

畫面分成四個區塊 分別是 **Game of life**, **細胞創造**,**現在數據** 和 **使用說明**

[!image](./image/example.png)

##### Game of life

* 以websocket 讓客戶和客戶之間傳輸數據 在此區塊滑鼠點擊的位置 傳輸與在 **細胞創造**上一樣形狀的細胞 到各個連線的客戶
* 在此區塊滑鼠移動時 同樣以websocket傳輸資料 讓各個客戶看得到彼此的滑鼠

##### 細胞創造

* 點擊區塊內的方格 自訂要創造的細胞

## 技術手段

* 使用工具:[oak@v10.1.0 | Deno](https://deno.land/x/oak@v10.1.0) 和 [websocket@v0.1.3 | Deno](https://deno.land/x/websocket@v0.1.3) , [glMatrix](https://glmatrix.net/)

* 用canvas 內容中的webgl2 呈現畫面 

* 用glviewport把四個畫面逐一投影在不同位置和大小 

  ```javascript
  OnRender(){
  
  ​    gl.clearColor(0.2,0.2,0.2,1.0);
  
  ​    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
  
  
  
  ​    for(let i = 0 ; i < this.m_Screens.length ; i++){
  	   //call each screen onRender function
  ​      this.m_Screens[i].screen.OnRender();
  
  ​    }
  
    }
  ```

  ```javascript
  // each screen
  OnRender(){
      	//each screen is render on different pos
          gl.viewport(this.xPos,this.yPos,this.width,this.height);
      }
  ```

  

## 參考資料

[fps]([javascript - Controlling fps with requestAnimationFrame? - Stack Overflow](https://stackoverflow.com/questions/19764018/controlling-fps-with-requestanimationframe))
