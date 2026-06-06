const log = ( elem => {
    return (a) => {
        elem.innerHTML += a + "<br>";
    };
})(document.getElementById("log"));
const lerp = (a,b,c) => a+(b-a)*c;
try{
{
    const canvas = document.getElementById("texture-atlas");
    canvas.width =canvas.height = "200";
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0,0,10,10);
    ctx.fillStyle = "black";
    ctx.save();
    ctx.translate(5,5);
    ctx.rotate(0.5);
    ctx.fillRect(-2,-2,4,4);
    ctx.restore();
    ctx.fillRect(0,0,1,10);
    ctx.fillRect(0,0,10,1);
    ctx.fillRect(9,0,1,10);
    ctx.fillRect(0,9,10,1);
    var text = [
        //"aaaaaaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaa''''''a",
        "aaaaaa''aaaaaa'''''a",
        "aaaa''''''aaaaa''''a",
        "aaa''''''''aaaa'''ca",
        "aa''''''''aaaaa'''aa",
        "aa'''caa'aaaaaaa'aaa",
        "a'''''aaaaaaa'aaaa'a",
        "a''''''aaaa''''aa''a",
        "a'''''''aa'''''''''a",
        "a''''''''''''''''''a",
        "a''''''''''''''''''a",
        "a''cccc''cc''c'''c'a",
        "a'cc''c'c''c'cc''c'a",
        "a'c'''''cccc'c'c'c'a",
        "a'cc''c'c''c'c''cc'a",
        "a''cccc'c''c'c'''c'a",
        "a''''''''''''''''''a",
        "a''''''''''''''''''a",
        "aaaaaaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaa",
        "aaaa............aaaa",
        "aaa..............aaa",
        "aa................aa",
        "a.....c.....c......a",
        "a.....cc....cc.....a",
        "a......c.....c.....a",
        "a..................a",
        "a..................a",
        "a..................a",
        "a..................a",
        "a..................a",
        "a.....cc......cc...a",
        "a......cc....cc....a",
        "a.......ccccccc....a",
        "a........ccc..c....a",
        "aa............c...aa",
        "aaa...........c..aaa",
        "aaaa.......cccccaaaa",
        "aaaaaaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaa",
        "aaaa.aaaaaaaaa.aaaaa",
        "aaaa..aaaaaaaa.aaaaa",
        "a..aaaaaaa.aaaaa..a",
        "a...aaaaa...aaa....a",
        "a...aa.aa....aaa...a",
        "a..aa..aa...aa.a...a",
        "a..a....a...c..aa..a",
        "a.aa....aaa.....aa.a",
        "a.ac...aacaa..aaaaaa",
        "a.a....a...aaaaca.aa",
        "aaa....a...aa..aa..a",
        "aa.c...aa...a..aaa.a",
        "a..a...aaa..aaaa...a",
        "aa.aa...aaa..aaa..aa",
        "aaaaa..aaaaa.aaa.aaa",
        "aaaaa.aaaaaaaaaaaaaa",
        "aaaaaaaaaaaaaaaaaaaa",
    ];
    ctx.fillStyle = "black";
    for(var i = 0; i < text.length; i++){
        for(var k = 0; k < text[i].length; k++){
            if(text[i][k]==="a"){
                ctx.fillStyle = "black";
                ctx.fillRect(k+10,text.length-i,1,1);
            }else if(text[i][k]==="c"){
                ctx.fillStyle = "red";
                ctx.fillRect(k+10,text.length-i,1,1);
            }else{
                if((k+i%2)%2){
                    ctx.fillStyle = "rgb(70,70,70)";
                    ctx.fillRect(k+10,text.length-i,1,1);
                }else{
                    ctx.fillStyle = "rgb(120,120,120)";
                    ctx.fillRect(k+10,text.length-i,1,1);
                }
            }
        }
    }
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(50,20,20,0,Math.PI*2);
    ctx.fill();
    var textureAtlasCanvas = canvas;//var escapes scope
}
const clamp = (a,b,c) => a<b?b:a>c?c:a;
const ctxCanvas = document.getElementById("play-area");
const ctx = ctxCanvas.getContext("2d");
const canvasSize = Math.min(window.innerWidth, window.innerHeight);
ctxCanvas.width = ctxCanvas.height = canvasSize;

const input = ((doc,canvas) => {
    const keys = {};
    const mouse = {
        x:0,
        y:0,
        dx:0,
        dy:0,
        clearDelta(){
            this.dx = this.dy = 0;
        }
    };
    canvas.onmousemove = (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
        mouse.dx = e.movementX;
        mouse.dy = e.movementY;
    };
    canvas.onclick = () => {
        canvas.requestPointerLock();
    };
    doc.onkeydown = (e) => {
        keys[e.key.toString().toLowerCase()] = true;
        if(e.key.toString()===" ")
            e.preventDefault();
    };
    doc.onkeyup = (e) => {
        keys[e.key.toString().toLowerCase()] = !true;
        //e.preventDefault();
    };
    return {
        keys,
        mouse
    };
})(document,ctxCanvas);
const {keys, mouse} = input;

const player = {
    x:0,
    y:0,
    z:0,
    vx:0,
    vy:0,
    vz:0,
    rad:0.3,
    r:{
        roll:0,
        pitch:0,
        yaw:0
    },
    walkRolld:0,
    boxCollData:[],
    speed:0.007,
    update(){
        this.x+=this.vx*=0.9;
        this.y+=this.vy*=0.97;
        this.z+=this.vz*=0.9;

        const deltaVel = {
            x:0,
            z:0,
        };
        if(keys.w){
            deltaVel.x-=Math.cos(this.r.yaw + Math.PI*0.5);
            deltaVel.z-=Math.sin(this.r.yaw + Math.PI*0.5);
        }
        if(keys.a){
            deltaVel.x-=Math.cos(this.r.yaw);
            deltaVel.z-=Math.sin(this.r.yaw);
        }
        if(keys.s){
            deltaVel.x+=Math.cos(this.r.yaw + Math.PI*0.5);
            deltaVel.z+=Math.sin(this.r.yaw + Math.PI*0.5);
        }
        if(keys.d){
            deltaVel.x+=Math.cos(this.r.yaw);
            deltaVel.z+=Math.sin(this.r.yaw);
        }
        var l = deltaVel.x**2+deltaVel.y**2;
        if(l){
            l=Math.sqrt(l);
            deltaVel.x/=l;
            deltaVel.y/=l;
        }
        this.vx+=deltaVel.x*this.speed;
        this.vz+=deltaVel.z*this.speed;
        if(deltaVel.x||deltaVel.y){
            this.walkRolld+=0.2;
            this.r.roll = lerp(this.r.roll,Math.sin(this.walkRolld)*0.1,0.1);
        }else{
            this.r.roll *= 0.95;
        }
        if(keys.shift){
            this.speed = 0.014;
        }else{
            this.speed = 0.007;
        }

        this.r.yaw += mouse.dx*0.005;
        this.r.yaw %= Math.PI*2;

        this.r.pitch -= mouse.dy*0.005;
        this.r.pitch = clamp(this.r.pitch,-Math.PI/2,Math.PI/2);
    },
    posToMatrix(){
        const matrix = Matrix4.identity();
        matrix.rotateZ(this.r.roll);
        matrix.rotateX(this.r.pitch);
        matrix.rotateY(this.r.yaw);
        matrix.translate(-this.x,-this.y,-this.z);
        return matrix;
    },
    collide3DBoxArray(arr){
        for(let i = 0; i < arr.length;i++){
            const temp = arr[i];
            const vx = clamp(this.x,temp[0],temp[0]+temp[3]);
            const vy = clamp(this.y,temp[1],temp[1]+temp[4]);
            const vz = clamp(this.z,temp[2],temp[2]+temp[5]);
            
            let dx = this.x-vx;
            let dy = this.y-vy;
            let dz = this.z-vz;
            let ds = dx*dx+dy*dy+dz*dz;
            if(ds<this.rad*this.rad){
                if(!ds){
                    this.y-=dy*dy;
                    this.vy = 0;
                    return;
                }
                ds = Math.sqrt(ds);
                dx/=ds;dy/=ds;dz/=ds;
                const far = this.rad-ds;
                this.x+=dx*far;
                this.y+=dy*far;
                this.z+=dz*far;
                
                const relVel = [-this.vx,-this.vy,-this.vz];
                const velAlongNormal = relVel[0]*dx+relVel[1]*dy+relVel[2]*dz;
                if(velAlongNormal<0){
                    return;
                }

                const impulseLength = -velAlongNormal * 1;
                this.vx-=dx*impulseLength;
                this.vy-=dy*impulseLength;
                this.vz-=dz*impulseLength;
            }
        }
    }
};

const canvas = new OffscreenCanvas(ctxCanvas.width,ctxCanvas.height);
const gl = canvas.getContext("webgl2",{preserveDrawingBuffer:true});
gl.viewport(0,0,canvas.width,canvas.height);

const createProgram = (vsh, fsh) => {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsh);
    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        alert(gl.getShaderInfoLog(vertexShader));
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fsh);
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS)){
        alert(gl.getShaderInfoLog(fragmentShader));
    }

    const program = gl.createProgram();
    gl.attachShader(program,vertexShader);
    gl.attachShader(program,fragmentShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        alert(gl.getProgramInfoLog(program));
    }

    return program;
};

const program = createProgram(
    document.getElementById("vertex-shader").text,
    document.getElementById("fragment-shader").text
);
gl.useProgram(program);

const vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const MeshTextureHandler = (() => {
    /**
     * The trap
     * 
     * We need to send the max, min, interpolater
    **/
    let rx = 1;
    let ry = 1;
    let subTextureStartX = 0;
    let subTextureStartY = 0;
    let subTextureEndX = 1;
    let subTextureEndY = 1;
    const [LEFT, RIGHT, FRONT, BACK, TOP, BOTTOM] = function*(){
        let i = 0;
        while(true)//like forever duh
            yield i++;
    }();//meaning side of block

    const plane = (x,y,z,w,h, side) => {
        let ex = subTextureEndX;
        let ey = subTextureEndY;
        let sx = subTextureStartX;
        let sy = subTextureStartY;
        let out = [];
        switch(side){
            case LEFT:
                out = [
                    x,y,z,    sx, sy, ex, ey,  0,  0,//0,0,
                    x,y,z+h,  sx, sy, ex, ey, rx,  0,//1,0,
                    x,y+w,z,  sx, sy, ex, ey,  0, ry,//0,1,

                    x,y+w,z+h,sx, sy, ex, ey, rx, ry,//1,1,
                    x,y+w,z,  sx, sy, ex, ey,  0, ry,//0,1,
                    x,y,z+h,  sx, sy, ex, ey, rx,  0,//1,0,
                ];
            break;
            case RIGHT:
                out = [
                    x,y,z,    sx, sy, ex, ey, rx,  0,//1,0,
                    x,y+w,z,  sx, sy, ex, ey, rx, ry,//1,1,
                    x,y,z+h,  sx, sy, ex, ey,  0,  0,//0,0,

                    x,y+w,z+h,sx, sy, ex, ey,  0, ry,//0,1,
                    x,y,z+h,  sx, sy, ex, ey,  0,  0,//0,0,
                    x,y+w,z,  sx, sy, ex, ey, rx, ry,//1,1,
                ];
            break;
            case FRONT:
                out = [
                    x,y,z,    sx, sy, ex, ey,  0,  0,//0,0,
                    x+w,y,z,  sx, sy, ex, ey, rx,  0,//1,0,
                    x,y+h,z,  sx, sy, ex, ey,  0, ry,//0,1,

                    x+w,y+h,z,sx, sy, ex, ey, rx, ry,//1,1,
                    x,y+h,z,  sx, sy, ex, ey,  0, ry,//0,1,
                    x+w,y,z,  sx, sy, ex, ey, rx,  0,//1,0,
                ];
            break;
            case BACK:
                out = [
                    x,y,z,    sx, sy, ex, ey, rx,  0,//1,0,
                    x,y+h,z,  sx, sy, ex, ey, rx, ry,//1,1,
                    x+w,y,z,  sx, sy, ex, ey,  0,  0,//0,0,

                    x+w,y+h,z,sx, sy, ex, ey,  0, ry,//0,1,
                    x+w,y,z,  sx, sy, ex, ey,  0,  0,//0,0,
                    x,y+h,z,  sx, sy, ex, ey, rx, ry,//1,1,
                ];
            break;
            case TOP:
                out = [
                    x,y,z,    sx, sy, ex, ey, rx,  0,//1,0,
                    x,y,z+h,  sx, sy, ex, ey, rx, ry,//1,1,
                    x+w,y,z,  sx, sy, ex, ey,  0,  0,//0,0,

                    x+w,y,z+h,sx, sy, ex, ey,  0, ry,//0,1,
                    x+w,y,z,  sx, sy, ex, ey,  0,  0,//0,0,
                    x,y,z+h,  sx, sy, ex, ey, rx, ry,//1,1,
                ];
            break;
            case BOTTOM:
                out = [
                    x,y,z,    sx, sy, ex, ey, rx,  0,//1,0,
                    x+w,y,z,  sx, sy, ex, ey,  0,  0,//0,0,
                    x,y,z+h,  sx, sy, ex, ey, rx, ry,//1,1,

                    x+w,y,z+h,sx, sy, ex, ey,  0, ry,//0,1,
                    x,y,z+h,  sx, sy, ex, ey, rx, ry,//1,1,
                    x+w,y,z,  sx, sy, ex, ey,  0,  0,//0,0,
                ];
            break;
            default:
                alert("bruh");
        }
        
        return out;
    };
    return {
        generatePlane:(...args) =>{
            return plane(...args);
        },
        generateCube:(x,y,z,w,h,d) => {
            return [
                ...plane(x,y,z,h,d, LEFT),
                ...plane(x+w,y,z,h,d, RIGHT),
                ...plane(x,y,z+d,w,h, FRONT),
                ...plane(x,y,z,w,h, BACK),
                //...plane(x,y+h,z,w,h, TOP),
                //...plane(x,y,z,w,h, BOTTOM),
                //add top and bottom...
            ];
        },
        setSubTexCoords:(x,y,ex,ey) => {
            subTextureStartX = x;
            subTextureStartY = y;
            subTextureEndX = ex;
            subTextureEndY = ey;
        },
        setRepeat(x,y){
            rx = x;ry = y;
        }
    };
})();
const MeshCollisionMerged = (() => {
    let internalDataArray = [];
    let internalCollArray = [];
    return {
        addCube(x,y,z,w,h,d){
            internalDataArray.push(...MeshTextureHandler.generateCube(x,y,z,w,h,d));
            internalCollArray.push([x,y,z,w,h,d]);
        },
        setVerticeDataArray(arr){
            internalDataArray = arr;
        },
        setCollisionArray(arr){
            internalCollArray = arr;
        }
    };
})();

const loadMap = ((ctx) => {
    const size = 29;
    const grid = [];
    for(let i = 0; i < size; i++){
        grid[i] = [];
        for(let k = 0; k < size; k++){
            grid[i][k] = 1;
            if(i%2==1 && k%2==1){
                grid[i][k] = 0;
            }
        }
    }
    let done = false;

    const start = [1,1];
    let currentCell = Array.from(start);
    const backTrack = [];
    let count = 0;
    function isVisited(x,y){
        count++;
        return (grid[x][y-1]!==1 || grid[x][y+1]!==1 || grid[x-1][y]!==1 || grid[x+1][y]!==1)^(count%20===0);
    }

    return function (){
        const blockSize = ctx.canvas.width/size;
        for(let i = 0; i < 10; i++){//so it's not too slow
            const options = [];
            if(currentCell[0] < size-3 && !isVisited(currentCell[0]+2,currentCell[1])){
                options.push([1,0]);
            }
            if(currentCell[1] < size-3 && !isVisited(currentCell[0],currentCell[1]+2)){
                options.push([0,1]);
            }
            if(currentCell[0] > 1 && !isVisited(currentCell[0]-2,currentCell[1])){
                options.push([-1,0]);
            }
            if(currentCell[1] > 1 && !isVisited(currentCell[0],currentCell[1]-2)){
                options.push([0,-1]);
            }
            if(options.length){
                backTrack.push(Array.from(currentCell));
                const dir = options[Math.random()*options.length|0];
                grid[currentCell[0]+dir[0]][currentCell[1]+dir[1]] = Math.random()<0.97?0:3;
                currentCell[0]+=dir[0]*2;currentCell[1]+=dir[1]*2;
            }else{
                if(backTrack.length>0){
                    currentCell = backTrack.pop();
                }else{
                    //DONE!
                    done = true;
                }
            }
            if(done){
                grid[start[0]][start[1]] = 2;
                return grid;
            }
        }
        var colors = ["#FF0000","#000000","#000000","#0000FF"];
        for(let i = 0; i < size; i++){
            for(let k = 0; k < size; k++){
                ctx.fillStyle = colors[grid[i][k]];
                ctx.fillRect(i*blockSize,k*blockSize,blockSize,blockSize);
            }
        }
        return false;
    };
})(ctx);

let numVertices = 0;
const wallBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, wallBuffer);

function uploadMap(map){
    MeshTextureHandler.setSubTexCoords(0, 0,
        10/textureAtlasCanvas.width, 
        10/textureAtlasCanvas.height);
    MeshTextureHandler.setRepeat(100/textureAtlasCanvas.width,100/textureAtlasCanvas.width);
    let boxData = [];
    MeshCollisionMerged.setVerticeDataArray(boxData);
    MeshCollisionMerged.setCollisionArray(player.boxCollData);
    for(let i = 0; i < map.length; i++){
        for(let k = 0; k < map[i].length; k++){
            switch(map[i][k]){
                case 1:
                    var d = Math.random()<0.05;
                    if(d){
                        var wichOenw = Math.random()*3|0;
                        MeshTextureHandler.setSubTexCoords(
                            10/textureAtlasCanvas.width,
                            20/textureAtlasCanvas.width*wichOenw,
                            30/textureAtlasCanvas.width,
                            20/textureAtlasCanvas.height+20/textureAtlasCanvas.width*wichOenw);
                        MeshTextureHandler.setRepeat(20/textureAtlasCanvas.width,20/textureAtlasCanvas.height);
                    }
                    MeshCollisionMerged.addCube(i*2,-1,k*2,2,2,2);
                    if(d){
                        MeshTextureHandler.setSubTexCoords(0, 0,
                           10/textureAtlasCanvas.width, 
                           10/textureAtlasCanvas.height);
                        MeshTextureHandler.setRepeat(100/textureAtlasCanvas.width,100/textureAtlasCanvas.width);
                    }
                break;
                case 2:
                    player.x = i*2+1;
                    player.z = k*2+1;
                break;
                case 3:
                    teapots.push([i*2+1,k*2+1]);
                break;
            }
        }
    }
    MeshTextureHandler.setRepeat(100/textureAtlasCanvas.width*map.length,100/textureAtlasCanvas.width*map.length);
    boxData.push(...MeshTextureHandler.generatePlane(0,-1,0,map.length*2,map.length*2,4));
    boxData.push(...MeshTextureHandler.generatePlane(0,1,0,map.length*2,map.length*2,5));//cause it was square if not we HATE
    gl.bindBuffer(gl.ARRAY_BUFFER, wallBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxData), gl.STATIC_DRAW);
    numVertices = boxData.length/8;
    loadTeapots();
}

const stepSize = 36;
const positionAttribLocation = gl.getAttribLocation(program, "a_pos");
gl.enableVertexAttribArray(positionAttribLocation);
gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, false, stepSize, 0);

const subTexCoordAttribLocation = gl.getAttribLocation(program, "a_subTexCoords");
gl.enableVertexAttribArray(subTexCoordAttribLocation);
gl.vertexAttribPointer(subTexCoordAttribLocation, 4, gl.FLOAT, false, stepSize, 12);

const texRepeatAttribLocation = gl.getAttribLocation(program, "a_texCoordRepeat");
gl.enableVertexAttribArray(texRepeatAttribLocation);
gl.vertexAttribPointer(texRepeatAttribLocation, 2, gl.FLOAT, false, stepSize, 28);

const textureAtlas = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D,textureAtlas);
gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,textureAtlasCanvas);
gl.generateMipmap(gl.TEXTURE_2D);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);


const teapotProgram = createProgram(
    document.getElementById("teapot-vertex-shader").text,
    document.getElementById("teapot-fragment-shader").text,
);
gl.useProgram(teapotProgram);

const teapotVao = gl.createVertexArray();
gl.bindVertexArray(teapotVao);

const teapotPositionAttribLocation = gl.getAttribLocation(teapotProgram, "a_pos");
const teapotMatrixAttribLocation = gl.getAttribLocation(teapotProgram, "a_posMatrix");
const teapotColorAttribLocation = gl.getAttribLocation(teapotProgram, "a_col");

const teapotPosBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,teapotPosBuffer);
gl.enableVertexAttribArray(teapotPositionAttribLocation);
gl.vertexAttribPointer(teapotPositionAttribLocation, 3, gl.FLOAT, false, 0, 0);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triPoints),gl.STATIC_DRAW);

const teapots = [
    [3,3],
];

const floatsPerMatrix = 16;
let teapotMatrixData;
let teapotMatrices = [];
const teapotMatrixBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, teapotMatrixBuffer);
for(let i = 0; i < 4; i++){//4 vectors per matrix. Feels wierd but sit down you're rocking the boat
    const loc = teapotMatrixAttribLocation+i;
    gl.enableVertexAttribArray(loc);
    const offset = i * 16;
    gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, floatsPerMatrix*4, offset);
    gl.vertexAttribDivisor(loc, 1);//AAAHHHHHH
    //Once per instance. Just wired if you ask me
}

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.enableVertexAttribArray(teapotColorAttribLocation);
gl.vertexAttribPointer(teapotColorAttribLocation, 4, gl.FLOAT, false, 0,0);
gl.vertexAttribDivisor(teapotColorAttribLocation, 1);

function loadTeapots(){
    teapotMatrixData = new Float32Array(teapots.length * 16);
    teapotMatrices = [];
    for(let i = 0; i < teapots.length; i++){
        const byteOffsetToMatrix = i * 16 * 4;
        teapotMatrices[i] = new Matrix4(teapotMatrixData.buffer,
            byteOffsetToMatrix,
            floatsPerMatrix);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotMatrixBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, teapotMatrixData.byteLength, gl.DYNAMIC_DRAW);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array((()=>{
        var arr = [];
        for(var i = 0; i < teapots.length; i++){
            arr.push(Math.random(),Math.random(),Math.random(),1);
        }
        return arr;
    })()), gl.STATIC_DRAW);
    teapotMatrices.forEach(function(mat, ind){
        mat.set(Matrix4.identity());
        mat.translate(teapots[ind][0],-0.5,teapots[ind][1]);
        mat.scale(0.2,0.2,0.2);
    });
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotMatrixBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, teapotMatrixData);
}
loadTeapots();

const uniformMatrixLocation = gl.getUniformLocation(program, "u_matrix");
const teapotUniformMatrixLocation = gl.getUniformLocation(teapotProgram, "u_viewMatrix");

gl.clearColor(0.2,0,0,1);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL);

if(window.parent.raf)
    cancelAnimationFrame(window.parent.raf);

let loadedMap = false;
let grid;
function loop(){
    try{
    window.parent.raf = requestAnimationFrame(loop);
    ctx.clearRect(0,0,ctxCanvas.width,ctxCanvas.height);
    if(!loadedMap){
        grid = loadMap();
        if(grid){
            uploadMap(grid);
            loadedMap = true;
        }
        return;
    }
    player.update();
    player.collide3DBoxArray(player.boxCollData);

    gl.useProgram(program);

    const matrix = Matrix4.perspective(Math.PI/2, canvas.width/canvas.height, 0.01, 100000);
    matrix.multiply(player.posToMatrix());
    gl.uniformMatrix4fv(uniformMatrixLocation, false, matrix);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES,0,numVertices);

    gl.useProgram(teapotProgram);

    teapotMatrices.forEach(function(mat, ind){
        mat.rotateY(0.1*Math.sin(ind+0.1));
    });
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotMatrixBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, teapotMatrixData);
    gl.uniformMatrix4fv(teapotUniformMatrixLocation, false, matrix);
    gl.bindVertexArray(teapotVao);
    gl.drawArraysInstanced(gl.TRIANGLES,0,triPoints.length/3,teapots.length);

    mouse.clearDelta();
    
    ctx.drawImage(canvas,0,0,canvas.width,canvas.height);
    /*ctx.fillStyle = "black";
    ctx.fillRect(0,0,grid.length*8, grid.length*8);
    ctx.fillStyle = "white";
    for(let i = 0; i < grid.length; i++){
        for(let k = 0; k < grid.length; k++){//REMEMBER IT HAS TO BE A SQUARE
            if(!grid[i][k])
            ctx.fillRect(i*8,k*8,8,8);
        }
    }
    ctx.fillStyle = "red";
    ctx.fillRect(((player.x*0.5)|0)*8,((player.z*0.5)|0)*8,8,8);*/
    }catch(err){
        log(err);
    }
}
loop();

log(gl.getError());

window.onresize = function(){
    const canvasSize = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = canvas.height =
    ctxCanvas.width = ctxCanvas.height = canvasSize;
    gl.viewport(0,0,canvas.width,canvas.height);
};
}catch(err){
    log(err.stack);
}
//<script>