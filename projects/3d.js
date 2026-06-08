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

//how to do textures based on cubes?
//bunch of yuck data, scratched through with gl_VertexID
//that would be 6 vec6 per instance
//36 floats, so 2 mat4 and a vec4
layout(location=1)in mat4 a_mat;
layout(location=5)in mat4 a_tex1;
layout(location=9)in mat4 a_tex2;
layout(location=13)in vec4 a_tex3;

uniform mat4 u_matrix;

out vec4 v_subTexCoords;
out vec2 v_texCoordRepeat;
out vec3 v_pixelLocation;

vec2[] anger = vec2[](
    vec2(0,0),
    vec2(1,0),
    vec2(0,1),
    vec2(1,1),
    vec2(0,1),
    vec2(1,0)
);

void main(){
    //dear future me
    //good luck with this
    //passing in data for quads
    //but you have triangles
    //have fun!
    //use 'anger', which might not be quite right
    vec2[] rage = vec2[](
        a_tex1[0].xy,a_tex1[0].zw,
        a_tex1[1].xy,a_tex1[1].zw,
        a_tex1[2].xy,a_tex1[2].zw,
        a_tex1[3].xy,a_tex1[3].zw,
        a_tex2[0].xy,a_tex2[0].zw,
        a_tex2[1].xy,a_tex2[1].zw,
        a_tex2[2].xy,a_tex2[2].zw,
        a_tex2[3].xy,a_tex2[3].zw,
        a_tex3.xy,a_tex3.zw
    );
    gl_Position = u_matrix * a_mat * a_pos;
    v_pixelLocation = gl_Position.xyz;
    v_subTexCoords.xy = rage[gl_VertexID/6*3];
    v_subTexCoords.zw = (rage[(gl_VertexID/6)*3+1]-v_subTexCoords.xy);
    v_texCoordRepeat = rage[(gl_VertexID/6)*3+2]*anger[gl_VertexID%6];
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
    0,8,2,10,
    12,4,14,6,
    3,11,1,9,
    15,7,13,5
);

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(){
    vec4 col = texture(u_texture, v_subTexCoords.xy + mod(v_texCoordRepeat,v_subTexCoords.zw));
    float foggy = clamp(length(v_pixelLocation)*0.1,0.,1.);
    o_FragColor = mix(col,vec4(0,0,0,1),foggy);
    ivec2 coord = ivec2(mod(vec2(gl_FragCoord.xy),vec2(4,4)));
    o_FragColor.r = step((bay[coord[0]][coord[1]]+1.)/17.,o_FragColor.r);
    o_FragColor.g = step((bay[(coord[0]+1)%4][coord[1]]+1.)/17.,o_FragColor.g);
    o_FragColor.b = step((bay[coord[0]][(coord[1]+1)%4]+1.)/17.,o_FragColor.b);
}`);
gl.useProgram(program);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0,0,0,1,0,0,0,1,0,1,1,0,0,1,0,1,0,1,0,0,1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,0,0,0,1,0,0,0,1,0,1,1,0,0,1,0,1,0,0,0,0,1,0,1,1,1,0,1,1,1,1,1,0,1,0,1,1,0,0,0,0,0,1,1,0,0,1,0,1,1,0,0,0,0,1,0,1,0,1,1,0,0,1,1,1,1,1,0,1,1,1,1,0]),gl.STATIC_DRAW);

const instanceBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
for(var i = 1; i <= 13; i++){
    gl.enableVertexAttribArray(i);
    gl.vertexAttribPointer(i, 4, gl.FLOAT, false, 64+64+64+16, (i-1)*16);
    gl.vertexAttribDivisor(i,1);
}

let blockData = [];
let instanceBufferData = [];
let blockTexMode = Array(36).fill(0);
let lazySetting = true;
let lazyStart = [0,0];
let lazyEnd = [1,0.5];
let lazyRatio = [5,2.5];
function setBlockTex(a){
    if(a.length == 6){
        blockTexMode = [...a,...a,...a,...a,...a,...a];
    }else if(a.length==36){
        blockTexMode = a;
    }
}
function addBlock(mat){
try{
    blockData.push([mat,mat4.invert(mat4.create(),mat)]);
    if(lazySetting){
        var x = mat4.getScaling(vec3.create(),mat);
        //set x as the repeat
        //and use lazy start and end as fits
        //start, end, repeat
        //dont forget the bleeping blocks are in xzy for some reason
        setBlockTex([...lazyStart,...lazyEnd,1,1]);//##future me, for some reason the opposite sides are not getting along. Please fix. Hopefully you didn't make the block faces in a weird order. keep xzy hahaha
        blockTexMode[4] =x[1]*lazyRatio[0];
        blockTexMode[10]=x[2]*lazyRatio[0];
        blockTexMode[5] =x[2]*lazyRatio[1];
        blockTexMode[11]=x[1]*lazyRatio[1];
        blockTexMode[16]=x[0]*lazyRatio[0];
        blockTexMode[22]=x[1]*lazyRatio[0];
        blockTexMode[17]=x[1]*lazyRatio[1];
        blockTexMode[23]=x[0]*lazyRatio[1];
        blockTexMode[28]=x[2]*lazyRatio[0];
        blockTexMode[34]=x[0]*lazyRatio[0];
        blockTexMode[29]=x[0]*lazyRatio[1];
        blockTexMode[35]=x[2]*lazyRatio[1];//whhy for loooooooopssL
    }
    instanceBufferData.push(...mat,...blockTexMode);
    }catch(err){alert(err);}
}


function unimaginative(t,r,s){
    const mat = mat4.create();
    mat4.translate(mat,mat,t);
    mat4.rotateX(mat,mat,r[0]);
    mat4.rotateY(mat,mat,r[1]);
    mat4.rotateZ(mat,mat,r[2]);
    mat4.scale(mat,mat,s);
    return mat;
}

addBlock(unimaginative([-10,-2,-10],[0,0,0],[20,1,20]));
addBlock(unimaginative([-10,8,-10],[0,0,0],[20,1,20]));
addBlock(unimaginative([-10,-1,-10],[0,0,0],[1,9,20]));
addBlock(unimaginative([9,-1,-10],[0,0,0],[1,9,20]));
addBlock(unimaginative([-10,-1,-10],[0,0,0],[20,9,1]));
addBlock(unimaginative([-10,-1,9],[0,0,0],[20,9,1]));
for(var i = 0; i < 40; i++){
    addBlock(unimaginative([Math.random()*10-5,Math.random()*5,Math.random()*10-5],
    [Math.random()*6.28,Math.random()*6.28,Math.random()*6.28],
    [1,1,1]));
}
lazyStart = [0,0.5];
lazyEnd = [1,1];
lazyRatio = [1,0.5];
addBlock(unimaginative([0,0,7],[0,0,0],[1,1,1]));

instanceBufferData = new Float32Array(instanceBufferData);
gl.bufferData(gl.ARRAY_BUFFER, instanceBufferData,gl.STATIC_DRAW);

const textureCanv = new OffscreenCanvas(400,800);
const t_ctx = textureCanv.getContext("2d");
t_ctx.lineWidth=5;
t_ctx.fillStyle="#000";
t_ctx.fillRect(0,0,400,800);
t_ctx.font = "150px monospace";
t_ctx.strokeStyle="#F00";
t_ctx.strokeText("EXIT",20,520);
var f = t_ctx.createLinearGradient(0,0,400,400);
f.addColorStop(0,"#F00");
f.addColorStop(0.5,"#020");
f.addColorStop(1,"#002");
t_ctx.fillStyle=f;
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
        var oof = vec3.create();
        var dd = vec3.create();
        for(var i = 0; i < arr.length; i++){
            const box = arr[i];
            vec3.transformMat4(oof, this.pos,box[1]);
            oof.forEach((x,i,a)=>a[i]=clamp(a[i],0,1));
            vec3.transformMat4(oof, oof, box[0]);
            var dx = this.pos[0]-oof[0],
                dy = this.pos[1]-oof[1],
                dz = this.pos[2]-oof[2],
                d=dx*dx+dy*dy+dz*dz;
            if(d < this.rad*this.rad){
                if(d){
                    d=Math.sqrt(d);
                    dx/=d;dy/=d;dz/=d;
                    var far = this.rad-d;
                    this.pos[0]+=dx*far;
                    this.pos[1]+=dy*far;
                    this.pos[2]+=dz*far;
                    var vAN = (-this.vel[0])*dx+(-this.vel[1])*dy+(-this.vel[2])*dz;
                    if(vAN<0)continue;
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

const threed = () => {
try{
    threePlayer.update();
    threePlayer.hitBoxArr(blockData);
    
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    const matrix = mat4.create();
    mat4.perspective(matrix,Math.PI/2,canvas.width/canvas.height,0.1,10000);
    mat4.multiply(matrix,matrix,threePlayer.toMatrix());
    gl.uniformMatrix4fv(uniformMatrixLocation,0,matrix);
    gl.drawArraysInstanced(gl.TRIANGLES,0,108/3,blockData.length);
    ctx.drawImage(glCanv,0,0,canvas.width,canvas.height);
    mouse.dx=0;
    mouse.dy=0;
    }catch(err){
    alert(err);}
};