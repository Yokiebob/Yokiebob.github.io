const glCanv = new OffscreenCanvas(canvas.width,canvas.height);
const gl = glCanv.getContext("webgl2");
gl.clearColor(0,0,0,1);
gl.enable(gl.DEPTH_TEST);

const createProgram = (vsh,fsh) => {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vsh);
    gl.compileShader(vertexShader);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fsh);
    gl.compileShader(fragmentShader);
    const program = gl.createProgram();
    gl.attachShader(program,vertexShader);
    gl.attachShader(program,fragmentShader);
    gl.linkProgram(program);
    //alert(gl.getShaderInfoLog(vertexShader));
    return program;
};

const program = createProgram(`#version 300 es
precision highp float;
layout(location=0)in vec4 a_pos;
layout(location=1)in vec4 a_subTexCoords;
layout(location=2)in vec2 a_texCoordRepeat;
layout(location=3)in mat4 a_mat;

uniform mat4 u_matrix;

out vec4 v_subTexCoords;
out vec2 v_texCoordRepeat;
out vec3 v_pixelLocation;

void main(){
    gl_Position = u_matrix * a_pos;
    v_subTexCoords.xy = a_subTexCoords.xy;
    v_subTexCoords.zw = a_subTexCoords.zw - a_subTexCoords.xy;
    v_pixelLocation = gl_Position.xyz;
    v_texCoordRepeat = a_texCoordRepeat;
}`,`#version 300 es
precision highp float;

#define epsilon 0.001
in vec4 v_subTexCoords;
in vec2 v_texCoordRepeat;
in vec3 v_pixelLocation;

uniform sampler2D u_texture;

out vec4 o_FragColor;

const mat4 bay = mat4(
    //13,12,10,2,6,4,9,3,16,15,11,14,7,1,5,8
    //4,14,1,10,7,8,12,2,11,6,16,13,3,9,5,15
    //4,1,10,11,2,12,6,15,9,3,13,16,5,14,7,8
    0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5
);

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(){
    vec4 col = texture(u_texture, v_subTexCoords.xy + mod(v_texCoordRepeat,v_subTexCoords.zw));
    float foggy = clamp(length(v_pixelLocation)*0.1,0.,1.);
    o_FragColor = mix(col,vec4(0,0,0,1),foggy);
    ivec2 coord = ivec2(mod(vec2(gl_FragCoord.xy),vec2(4,4)));
    //o_FragColor.r = step(rand(gl_FragCoord.xy),o_FragColor.r);
    o_FragColor.r = step((bay[coord[0]][coord[1]]+1.)/17.,o_FragColor.r);
}`);
gl.useProgram(program);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 36, 0);
gl.enableVertexAttribArray(1);
gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 36, 12);
gl.enableVertexAttribArray(2);
gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 36, 28);

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
                ...plane(x,y+h,z,w,d, TOP),
                ...plane(x,y,z,w,d, BOTTOM),
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

let blockData = [];
let vertexBufferData = [];

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

MeshCollisionMerged.setCollisionArray(blockData);
MeshCollisionMerged.setVerticeDataArray(vertexBufferData);

MeshTextureHandler.setSubTexCoords(0,0,1,0.5);
MeshTextureHandler.setRepeat(1,10);
for(var i = 0; i < 20; i++){
    for(var k = 0; k < 20; k++){
        if(Math.random()<0.5)
        MeshCollisionMerged.addCube(i*2,Math.random()*8+2,k*2,1,6,1);
    }
}
MeshTextureHandler.setRepeat(100,50);
MeshCollisionMerged.addCube(-2,-1,-2,48,1,48);
MeshCollisionMerged.addCube(-2,16,-2,48,1,48);
MeshTextureHandler.setRepeat(100,25);
MeshCollisionMerged.addCube(-2,0,-2,48,16,1);
MeshCollisionMerged.addCube(-2,0,46,48,16,1);
MeshTextureHandler.setRepeat(100,25);
MeshCollisionMerged.addCube(-2,0,-2,1,16,48);
MeshCollisionMerged.addCube(46,0,-2,1,16,48);

const endOfTexturedBlocks = vertexBufferData.length*4;

vertexBufferData = new Float32Array(vertexBufferData);
/*const byteData = new Uint8Array(vertexBufferData.buffer);
for(var i = 12; i < byteData.length; i+=24){
    byteData[i]=Math.random()*255;
    byteData[i+1]=Math.random()*255;
    byteData[i+2]=Math.random()*255;
    byteData[i+3]=0;
    if(i>endOfTexturedBlocks){
        byteData[i+3]=255;
    }
}*/
gl.bufferData(gl.ARRAY_BUFFER, vertexBufferData,gl.STATIC_DRAW);

const textureCanv = new OffscreenCanvas(400,800);
const t_ctx = textureCanv.getContext("2d");
t_ctx.fillStyle="#F00";
t_ctx.fillRect(0,0,400,400);
t_ctx.fillStyle="#500";
t_ctx.fillRect(20,20,360,360);
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D,texture);
gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    textureCanv.width,
    textureCanv.height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    textureCanv);
//alert(gl.generateMipmap);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

const uniformMatrixLocation = gl.getUniformLocation(program,"u_matrix");
//const uniformTextureLocation = gl.getUniformLocation(program,"u_texture");

const threePlayer = {
        pos:vec3.fromValues(0,0,0),
        vel:vec3.create(),
        r:{
            roll:0,
            pitch:0,
            yaw:0,
        },
        jumpTime:0,
        rad:0.2,
        flying:true,
        flyingKey:false,
        toMatrix(){
            const matrix = mat4.create();
            mat4.rotateX(matrix,matrix,this.r.pitch);
            mat4.rotateY(matrix,matrix,this.r.yaw);
            mat4.translate(matrix,matrix,this.pos.map(x=>-x));
            return matrix;
        },
        update(){
            vec3.add(this.pos,this.pos,this.vel);
            this.vel[0]*=0.95;
            if(!this.flying){
                this.vel[1]*=0.98;
                this.vel[1]-=0.005;
            }else{
                this.vel[1]*=0.95;
            }
            if(keys.m && !this.flyingKey){
                this.flying^=1;
            }
            this.flyingKey=keys.m;
            this.vel[2]*=0.95;
            const add = vec3.create();
            if(keys.w){
                add[0]+=Math.cos(this.r.yaw-0.5*Math.PI);
                add[2]+=Math.sin(this.r.yaw-0.5*Math.PI);
            }
            if(keys.s){
                add[0]-=Math.cos(this.r.yaw-0.5*Math.PI);
                add[2]-=Math.sin(this.r.yaw-0.5*Math.PI);
            }
            if(keys.d){
                add[0]+=Math.cos(this.r.yaw);
                add[2]+=Math.sin(this.r.yaw);
            }
            if(keys.a){
                add[0]-=Math.cos(this.r.yaw);
                add[2]-=Math.sin(this.r.yaw);
            }
            vec3.normalize(add,add);
            vec3.scaleAndAdd(this.vel,this.vel,add,0.005);
            if(!this.flying){
                    if(keys[" "] && this.jumpTime>0){
                    this.vel[1]=0.15;
                    this.jumpTime=0;
                }
                this.jumpTime--;
            }else{
                if(keys[" "]){
                    this.vel[1]+=0.002;
                }
                if(keys.shift){
                    this.vel[1]-=0.002;
                }
            }
            this.r.yaw+=mouse.dx*0.005;
            this.r.yaw%=Math.PI*2;
            this.r.pitch+=mouse.dy*0.005;
            this.r.pitch = clamp(this.r.pitch,-Math.PI*0.5,Math.PI*0.5);
        },
        hitBoxArr(arr){
            for(var i = 0; i < arr.length; i++){
                const box = arr[i];
                const vx = clamp(this.pos[0],box[0],box[0]+box[3]);
                const vy = clamp(this.pos[1],box[1],box[1]+box[4]);
                const vz = clamp(this.pos[2],box[2],box[2]+box[5]);
                  var dx = this.pos[0]-vx,
                      dy = this.pos[1]-vy,
                      dz = this.pos[2]-vz,
                      d=dx*dx+dy*dy+dz*dz;
                if(d < this.rad*this.rad){
                    if(d){
                    const bvx = box[13] ?? 0;
                    const bvy = box[14] ?? 0;
                    const bvz = box[15] ?? 0;
                    d=Math.sqrt(d);
                    dx/=d;dy/=d;dz/=d;
                    var far = this.rad-d;
                    this.pos[0]+=dx*far;
                    this.pos[1]+=dy*far;
                    this.pos[2]+=dz*far;
                    var vAN = (bvx-this.vel[0])*dx+(bvy-this.vel[1])*dy+(bvz-this.vel[2])*dz;
                    if(vAN<0)continue;
                    this.vel[0]+=vAN*dx;
                    this.vel[1]+=vAN*dy;
                    this.vel[2]+=vAN*dz;
                    if(dy>0.5){
                        this.jumpTime = 5;
                    }
                }else{
                    var dirs = [
                        [this.pos[0]-box[0]+this.rad,0,0],
                        [this.pos[0]-box[0]-box[3]-this.rad,0,0],
                        [0,this.pos[1]-box[1]-box[4]-this.rad,0],
                        [0,this.pos[1]-box[1]+this.rad,0],
                        [0,0,this.pos[2]-box[2]+this.rad],
                        [0,0,this.pos[2]-box[2]-box[5]-this.rad]
                    ];
                    dirs.sort(function(a,b){
                        return Math.abs(a[0]+a[1]+a[2])-Math.abs(b[0]+b[1]+b[2]);
                    });
                    this.pos[0]-=dirs[0][0];
                    this.pos[1]-=dirs[0][1];
                    this.pos[2]-=dirs[0][2];
                    var [dx,dy,dz] = dirs[0],d=Math.sqrt(dx*dx+dy*dy+dz*dz);
                    dx/=d;dy/=d;dz/=d;
                    const bvx = box[13] ?? 0;
                    const bvy = box[14] ?? 0;
                    const bvz = box[15] ?? 0;
                    var vAN = (bvx-this.vel[0])*dx+(bvy-this.vel[1])*dy+(bvz-this.vel[2])*dz;
                    this.vel[0]+=vAN*dx;
                    this.vel[1]+=vAN*dy;
                    this.vel[2]+=vAN*dz;
                    if(dy>0.5){
                        this.jumpTime = 5;
                    }
                }
            }
        }
    }
};
//alert(Array(16).fill(0).map((x,i)=>i+1).sort((a,b)=>Math.random()-0.5));
const threed = () => {
try{
    threePlayer.update();
    threePlayer.hitBoxArr(blockData);
    
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    const matrix = mat4.create();
    mat4.perspective(matrix,Math.PI/2,canvas.width/canvas.height,0.1,10000);
    mat4.multiply(matrix,matrix,threePlayer.toMatrix());
    gl.uniformMatrix4fv(uniformMatrixLocation,0,matrix);
    gl.drawArrays(gl.TRIANGLES,0,vertexBufferData.length/8);
    ctx.drawImage(glCanv,0,0,canvas.width,canvas.height);
    mouse.dx=0;
    mouse.dy=0;
    }catch(err){
    alert(err);}
};
