const clamp = (i,j,k) => i<j?j:i>k?k:i;
const smoothstep = a => a*a*(3-2*a);
const lerp = (a,b,c) => a+(b-a)*c;
const distsq = (a,b,c,d) => (a-c)**2+(b-d)**2;

const SIZE = 600;
const canvas = document.getElementById("myCanvas");
canvas.width=SIZE;
canvas.height=SIZE;
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const ctxText = (txt,x,y) => {
    var f = txt.split("\n");
    var s = ctx.font.split(" ")[0].slice(0,-2);
    for(var i = 0; i < f.length; i++){
        ctx.fillText(f[i],x,y+s*i);
    }
};

const input = (()=>{
    const keys = {};
    const mouse = {dx:0,dy:0,clicked:0,reset(){this.dx=this.dy=this.clicked=0;}};
    canvas.addEventListener("click", ()=>{
        mouse.clicked = 1;
        canvas.requestPointerLock();
    });
    document.addEventListener("keydown", (e)=>{
        keys[e.key.toString().toLowerCase()] = 1;
    });
    document.addEventListener("keyup", (e)=>{
        keys[e.key.toString().toLowerCase()] = 0;
    });
    canvas.addEventListener("mousemove", (e)=>{
        mouse.dx = e.movementX;
        mouse.dy = e.movementY;
    });
    return {keys, mouse};
})();
const {keys, mouse} = input;

//for(var i in ctx)lo.innerHTML+=i+"<br>";
const DumbShow = {
    timer:0,
    text:"",
    speak(text,timer=100){
        this.text = text;
        this.timer = timer;
    },
    run(){
        if(this.timer>0){
            this.timer--;
            ctx.fillStyle="black";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle="white";
            ctx.font="30px monospace";
            ctx.textAlign = ctx.textBaseline = "center";
            ctxText(this.text,SIZE/2,SIZE/2-ctx.font.split(" ")[0].slice(0,-2)*(this.text.split("\n").length-1)/2);
        }
    }
};

