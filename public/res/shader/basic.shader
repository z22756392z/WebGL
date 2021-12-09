// 遇到兩個問題  我想要用 basic.shader 這樣的檔案 在前端的資料夾中 讓javascript 讀取成string
// 其一 沒有找到適合讀取檔案的函式 網路上大部分使用 
// 不同的XML file 在需要的時候 使用XMLHttpRequest 讀取 但是 XMLHttpRequest 沒辦法讀取當地檔案 ex :.c file 
// 和 直接在html檔 使用 <script id="shader-fs" type="x-shader/x-fragment">

#version 300 es

out vec2 fragTexCoord;
in vec3 vertexPosition;
in vec2 texCoord;
uniform mat4 mWorld;
uniform mat4 mView;
uniform mat4 mProj;
void main() {
	gl_Position = mProj * mView * mWorld * vec4(vertexPosition,1.0);
    fragTexCoord = texCoord; 
}

#version 300 es

precision mediump float;
out vec4 color;
in vec2 fragTexCoord;
uniform sampler2D sampler;
    

void main() {
	vec4 texColor = texture(sampler,fragTexCoord);
    color = texColor;
}

