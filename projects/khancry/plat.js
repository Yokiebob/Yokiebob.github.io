const WORLD_SIZE = 30;
const BLOCK_SIZE = SIZE/WORLD_SIZE;
const level = [2,0];
function clev(m, art){
    return {m, art};
}

const plat_wada = {
    x:90,
    y:450,
    r:50,
    awake:0,
    awakened:0,
    hungryTimer:0,
    draw(t){
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
        ctx.fill();
        if(this.awake){
            const blink = clamp(Math.sin((t-this.awakened)*0.003+3*Math.PI/2)*20+20,0,1);
            ctx.fillStyle="white";
            ctx.beginPath();
            ctx.ellipse(this.x-this.r*0.35,this.y-this.r*0.25,this.r*0.1,this.r*0.1*blink,0,0,Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(this.x+this.r*0.35,this.y-this.r*0.25,this.r*0.1,this.r*0.1*blink,0,0,Math.PI*2);
            ctx.fill();
        }else{
            this.awakened = performance.now();//so the eyes open when you awaken
        }
        if(this.hungryTimer>0 && this.hungryTimer<150){
            ctx.font="50px monospace";
            DumbShow.speak("I am very\nHungry");
        }
        this.hungryTimer--;
    },
    update(){
        if(rPlayer.dealWithCircle(this)){
            if(!this.awake){
                this.hungryTimer=200;
            }
            this.awake=1;
        }
    }
};

const plat_fooder = {
    x:440,
    y:520,
    h:40,
    w:40,
    start:0,
    end:30,
    hit:false,
    t:0,
    draw(){
        ctx.fillStyle="red";
        ctx.fillRect(this.x,this.y,this.w,this.h);
        ctx.fillStyle="black";
        ctx.fillRect(this.x+this.w/4,this.y+this.h/4,this.w/2,this.h/2);
    },
    update(){
        if(rPlayer.x+rPlayer.size>this.x &&
        rPlayer.y+rPlayer.size>this.y &&
        rPlayer.x<this.x+this.w &&
        rPlayer.y<this.y+this.h){
            this.hit=true;
        }
        if(this.hit && this.start<=this.end){
            this.start++;
            if(this.start>this.end){
                this.hit=false;
            }
        }else if(this.start>0){
            this.start--;
        }
        if(this.start>0){
            canvas.style.filter=`blur(${this.start}px) contrast(${this.start+1})`;
        }else{
            canvas.style.filter="";
        }
        if(this.start==this.end){
            canvas.style.filter="";
            scene=1;
            DumbShow.speak("The Otherside");
        }
    }
};

const levels = [
    [
        clev([
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaa.........aaaaaaaaa",
            "aaaaaaaaaaaa............aaaaaa",
            "aaaaaaaaaaaa.............aaaaa",
            "aaaaaaaaaaa.........aaa...aaaa",
            "aaaaaaaaaaa....aa..aaaaa...aaa",
            "aaaaaaaaaaaa...aa...aaaaa...aa",
            "aaaaaaaaaaaa........aaaaaa..aa",
            "aaaaaaaaaaaaaa......aaaaaa...a",
            "aaaaaaaaaaaaaa......aaaaaaa..a",
            "aaaaaaaaaaa.........aaaaaaa..a",
            "aaaaaaaaa......a....aaaaaa..aa",
            "aaaaaaa........aa..aaaaaaa..aa",
            "aaaa...............aaaaa...aaa",
            "aaa...............aaaaa....aaa",
            "aa..............aaaaaa........",
            "aa...........aaaaaaaa.........",
            "a.........aaaaaaaaaaa.........",
            "a........aaaaaaaaaaaa.........",
            "a......aaaaaaaaaaaaaaa.....aaa",
            "a......aaaaaaaaaaaaaaaaaaaaaaa",
            "a....aaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        ]),
        clev([
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaa..aaaaaaaaa",
            "aaaaaaaaaaaaa.aa.aa..aa...aaaa",
            "aaaaaaaaaaaaa.aa.aa.aaa....aaa",
            "aaaaaaaa.aaaa.aa.aa.aa.....aaa",
            "aaaaaaaa.aaaa.a..a..aa.....aaa",
            "aaaaa.aa...aa.a..a..a.....aaaa",
            "aaaaa.aa...a..a.....a....aaaaa",
            "aaaaa.aa...a........a..aaaaaaa",
            "aaaa..a.................aaaaaa",
            "aaaa..a.................aaaa..",
            "aaaa..........aaaa......aaa...",
            "aaaaa..........aaa.......a....",
            "aaaaaa.........aaaa......a....",
            "aaaaaa..........aaa...........",
            "aaaa.a..........aaa...........",
            "aaaa.a..........aaaa..........",
            "aa...a..........aaaa..........",
            ".....a..........aaaaa.........",
            "................aaaaa........a",
            "...............aaaaaaa.....aaa",
            "...............aaaaaaaaaaaaaaa",
            "aa...........aaaaaaaaaaaaaaaaa",
            "aaaa.......aaaaaaaaaaaaaaaaaaa",
            "aaaaaa....aaaaaaaaaaaaaaaaaaaa",
            "aaaaa....aaaaaaaaaaaaaaaaaaaaa"
        ]),
        clev([
            "aaaaaaaaaaaaaaaaa...........aa",
            "aaaaaaaaaaaaaaaa...........aaa",
            "aaaaaaaaaaaaaaaa...........aaa",
            "aaaaaaaaaaaaaaa..........aaaaa",
            "aaaaaaaaaaaaaaa.......aaaaaaaa",
            "aaaaaaaaaaaaaa.......aaaaaaaaa",
            "aaaaaaaaaaaaa........aaaaaaaaa",
            "aaaaaaaaaaaaa.......aaaaaaaaaa",
            "aaaaaaaaaaaa.......aaaaaaaaaaa",
            "aaaaaaaaa..........aaaaaaaaaaa",
            "aaaaaaa...........aaaaaaaaaaaa",
            "aaaa.............aaaaaaaaaaaaa",
            "aa...............aaaaaaaaaaaaa",
            "a...............aaaaaaaaaaaaaa",
            ".............aaaaaaaaaaaaaaaaa",
            "...........aaaaaaaaaaaaaaaaaaa",
            ".........aaaaaaaaaaaaaaaaaaaaa",
            ".......aaaaaaaaaaaaaaaaaaaaaaa",
            "......aaaaaaaaaaaaaaaaaaaaaaaa",
            "......aaaaaaaaaaaaaaaaaaaaaaaa",
            ".....aaaaaaaaaaaaaaaaaaaaaaaaa",
            "...aaaaaaaaaaaaaaaaaaaaaaaaaaa",
            ".aaaaaaaaaaa...aaaaa.....aaaaa",
            "aaaaaaa..........aaa......aaaa",
            "aaaaaa............aa......aaaa",
            "aaaaa...........aaa........aaa",
            "aaaa......................aaaa",
            "aa.......................aaaaa",
            "aa..........aaaaaaaaaaaaaaaaaa",
            "aaaaa......aaaaaaaaaaaaaaaaaaa"
        ],[plat_fooder])
    ],
    [
        clev([
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaa.aaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaa..aaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaa...aaaaaaaaaaaaaaaaaaaa",
            "aaaaaaa......aaaaaaaaaaaaaaaaa",
            "aaaaaaaaa.......aaaaaaaaaaaaaa",
            "aaaaaaaaa..........a...aaaaaaa",
            "aaa...........................",
            "aaaa..........................",
            "aaaaaaaaaa........aaaaaaaaaaaa",
            "aaaaaaaaaaaa.....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa"
        ]),
        clev([
            "aaaaa....aaaaaaaaaaaaaaaaaaaaa",
            "aaaa.....aaaaaaaaaaaaaaaaaaaaa",
            "aaa.....aaaaaaaaaaaaaaaaaaaaaa",
            "aaa....aaaaaaaaaaaaaaaaaaaaaaa",
            "aaaa.....aaaaaaaaaaaaaaaaaaaaa",
            "aaaaa.......aaaaaaaaaaaaaaaaaa",
            "aaaaaaaa........aaaaaaaaaaaaaa",
            "aaaaaaaaaaaa......aaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaa...aaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaa..aaaaaaaaaaa",
            "aaaaaaaaaaaaaa.......aaaaaaaaa",
            "aaaaaaaaaaaa.....aa...aaaaaaaa",
            "aaaaaaaaa......aaaaa...aaaaaaa",
            "aaaaaa.......aaaaaaa...aaaaaaa",
            ".........aaaaaaaaaa...aaaaaaaa",
            "......aaaaaaaaaaaa....aaaaaaaa",
            "aaaaaaaaaaaa........aaaaaaaaaa",
            "aaaaaaaaaa........aaaaaaaaaaaa",
            "aaaaaaaaa...aaaaaaaaaaaaaaaaaa",
            "aaaaaaaa...aaaaaaaaaaaaaaaaaaa",
            "aaaaaaa....aaaaaaaaaaaaaaaaaaa",
            "aaaaaaa...aaaaaaaaaaaaaaaaaaaa",
            "aaaaaaa...aaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaa.......aaaaaaaaaaaaaaa",
            "aaaaaaaaa...........aaaaaaaaaa",
            "aaaaaaaaaaaa..................",
            "aaaaaaaaaaaaaaaaa.............",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        ]),
        clev([
            "aaaaa......aaaaaaaaaaaaaaaaaaa",
            "aaaaa......aaaaaaaaaaaaaaaaaaa",
            "aaaaa.....aaaaaaaaaaaaaaaaaaaa",
            "aaaaa...aaaaaaaaaaaaaaaaaaaaaa",
            "aaaaa...aaaaaaa.........aaaaaa",
            "aaaaa..aaaa.a............aaaaa",
            "aaaaaa..aa................aaaa",
            "aaaaaa...a.................aaa",
            "aaaaaaa....................aaa",
            "aaaaaaa............a.......aaa",
            "aaaaaaaa..........aaa.......aa",
            "aaaaaaaa..........aaaa......aa",
            "aaaaaaaa...........aaa......aa",
            "aaaaaaaaa..........aaa......aa",
            "aaaaaaaaaaaaa......aaa......aa",
            "aaaaaaaaaaaaaa.....aaa.......a",
            "aaaaaaaaaaaaaaa....aaaa.......",
            "aaaaaaaaaaaaaaa...aaaaa.......",
            "aaaaaaaaaaaaaaa...aaaaa.......",
            "aaaaaaa..aaaaa...aaaaaaa......",
            "aaaaa......aa....aaaaaaaa.....",
            "aaaaa...........aaaaaaaaaaaa..",
            "aaa............aaaaaaaaaaaaaaa",
            "aaa..........aaaaaaaaaaaaaaaaa",
            "aa.........aaaaaaaaaaaaaaaaaaa",
            ".........aaaaaaaaaaaaaaaaaaaaa",
            ".........aaaaaaaaaaaaaaaaaaaaa",
            "aaa....aaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        ])
    ],
    [
        clev([
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaa......aaaaaaaaaaaa.",
            "aaaaaaaaaaa.......aaa.aaaaaa..",
            "aaaaaaaa.aaa......aa..aaaaa...",
            "aaaaaaa...aa......aa.aaaaa....",
            "aaaaaaaa.aa......aa..aaa......",
            "aaaaa.aa.aa.........aaa.......",
            "aaaa...aaaa..................a",
            "aaaa.....aa.................aa",
            "aaa......aa.................aa",
            "aaaaaaa.aa...............aaaaa",
            "aaaaaaa.aa................aaaa",
            "aaaaaaaa...................aaa",
            "aaaa.aa...................aaaa",
            "aaaa................aaaaaaaaaa",
            "aaa................aaaaaaaaaaa",
            "aaa.......................aaaa",
            "aa....................a..aaaaa",
            "aa................aa.aaaaaaaaa",
            "aa................aaaa.aaaaaaa",
            "aa........aa.......aaaaaaaaaaa",
            "aaaa..aaaaaa........aaaaaaaaaa",
            "aaaaaaaaaaa......aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa",
            "aaaaaaaaaaaaa....aaaaaaaaaaaaa"
        ],[plat_wada]),
        clev([
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaa.................aaaaaaaaa",
            "aaa......................aaaaa",
            "a...........................aa",
            "..............................",
            "..............................",
            "..............................",
            "......aaaaaaaaaaaaaa..........",
            ".....aaaaaaaaaaaaaaaa.........",
            "..aaaaaaaaaaaaaaaaaaa..aaaa...",
            "aaaaaaaaaaaaaaaaaaaaa.aaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaa..aaaaaaaa",
            "aaaaaaaaaaaaaaaaaa...aaaaaaaaa",
            "aaaaaaaaaaaaaaaaa....aaaaaaaaa",
            "aaaaaaaaaaaaaaaa....aaaaaaaaaa",
            "aaaaaaaaaaaaaa......aaaaaaaaaa",
            "aaaaaaaaaaaa.......aaaaaaaaaaa",
            "aaaaaaaaaa........aaaaaaaaaaaa",
            "aaaaaaaaa.........aaaaaaaaaaaa",
            "aaaaaaaaa........aaaaaaaaaaaaa",
            "aaaaaaaa........aaaaaaaaaaaaaa",
            "aaaaaaa........aaaaaaaaaaaaaaa",
            "aaaaaaa.......aaaaaaaaaaaaaaaa",
            "aaaaaa.......aaaaaaaaaaaaaaaaa",
            "aaaaaa.......aaaaaaaaaaaaaaaaa",
            "aaaaaa......aaaaaaaaaaaaaaaaaa",
            "aaaaa.......aaaaaaaaaaaaaaaaaa",
            "aaaaa......aaaaaaaaaaaaaaaaaaa",
            "aaaaa......aaaaaaaaaaaaaaaaaaa",
            "aaaaa......aaaaaaaaaaaaaaaaaaa"
        ]),
        clev([
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaa...aaa...aaaaaaaaaa",
            "aaaaaaaa.......aa.....aaaaaaaa",
            "aaaaaaa........a.......aaaaaaa",
            ".....a..................aaaaaa",
            ".........................aaaaa",
            "...............aa.........aaaa",
            "............aaaaaaa.......aaaa",
            "..........aaaaaaaaaa.......aaa",
            "..........aaaaaaaaaa.......aaa",
            "a.........a....aaaaaa......aaa",
            "aa..............aaaaa......aaa",
            "aa..............aaaaa......aaa",
            "aaa.............aaaaaa.....aaa",
            "aaa.......a....aaaaaaaa....aaa",
            "aaaa......aaaaaaaaaaaaaa..aaaa",
            "aaaa......aaaaaaaaaaaaaaa.aaaa",
            "aaaa.......aaaaaaaaaaaaaaaaaaa",
            "aaaaa......aaaa....aaaaaaaaaaa",
            "aaaaa.......aaa.....aaaaaaaaaa",
            "aaaaa.......aa......aaaaaaaaaa",
            "aaaaaa......aa........aaaaaaaa",
            "aaaaaaa.....aaa.......aaaaaaaa",
            "aaaaaaa......a....a....aaaaaaa",
            "aaaaaaaa..........aa...aaaaaaa",
            "aaaaaaaaa........aaaa.aaaaaaaa",
            "aaaaaaaaaaa......aaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        ]),
        clev([]),
    ]
];
function wrapLevel(x,y){
    y = (y+levels.length)%levels.length;
    x = (x+levels[y].length)%levels[y].length;
    return [x,y];
}

const levelImg = new OffscreenCanvas(SIZE,SIZE);
const oldLevelImg = new OffscreenCanvas(SIZE,SIZE);
const levelImg_ctx = levelImg.getContext("2d");
const oldLevelImg_ctx = oldLevelImg.getContext("2d");
oldLevelImg_ctx.imageSmoothingEnabled = false;
const plat_transition = {
    on:0,
    dir:[0,0],
    t:0,
    o:0,
    tickTime:performance.now(),
    start(x,y){
        this.tickTime = performance.now();
        this.dir=[x,y];
        this.o=performance.now();
        this.on=1;
    }
};
function newLevel(x,y){
    [level[0],level[1]]=wrapLevel(level[0],level[1]);

    oldLevelImg_ctx.clearRect(0,0,SIZE,SIZE);
    oldLevelImg_ctx.drawImage(levelImg,0,0,SIZE,SIZE);
    levelImg_ctx.clearRect(0,0,SIZE,SIZE);
    const current = levels[level[1]][level[0]].m;
    for(var i = 0; i < WORLD_SIZE; i++){
        for(var k = 0; k < WORLD_SIZE; k++){
            if(current[i][k]=="a"){
                levelImg_ctx.fillStyle="black";
                levelImg_ctx.fillRect(k*BLOCK_SIZE,i*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
            }
        }
    }
    if(x||y){
        plat_transition.start(x,y);
    }else{
        oldLevelImg_ctx.drawImage(levelImg,0,0,WORLD_SIZE,WORLD_SIZE);
    }
}
newLevel();

const rPlayer = {
    x:400,
    y:500,
    baseX:300,
    baseY:300,
    deltaX:0,
    deltaY:0,
    vx:0,
    vy:0,
    size:BLOCK_SIZE,
    draw(){
        ctx.fillStyle="black";
        ctx.fillRect(this.x,this.y,this.size,this.size);
    },
    update(l){
        this.collideBlocksY(l);
        this.collideBlocksX(l);
        this.baseX = this.x;
        this.baseY = this.y;
    },
    handleLevels(){
        if(this.y>=SIZE){
            level[1]++;
            newLevel(0,-1);
            this.y=0;
            this.backupbonk(levels[level[1]][level[0]].m);
            this.y=SIZE-this.size;
        }else if(this.y<=-this.size){
            level[1]--;
            newLevel(0,1);
            this.y=SIZE-this.size;
            this.backupbonk(levels[level[1]][level[0]].m);
            this.y=-this.size;
        }
        if(this.x>=SIZE){
            level[0]++;
            newLevel(-1,0);
        }else if(this.x<=-this.size){
            level[0]--;
            newLevel(1,0);
        }
    },
    collideBlocksX(data){
        if(keys.a){
            this.vx-=0.5;
        }
        if(keys.d){
            this.vx+=0.5;
        }
        if(!keys.a && !keys.d){
            this.vx-=0.5*Math.sign(this.vx);
            if(Math.abs(this.vx)<0.5){
                this.vx = 0;
            }
        }
        this.x+=this.deltaX;
        this.deltaX = 0;
        this.x+=(this.vx=clamp(this.vx,-4,4));
        var downx = Math.floor(this.x/BLOCK_SIZE);
        var downy = Math.floor(this.y/BLOCK_SIZE);
        var upx = Math.ceil((this.x+this.size)/BLOCK_SIZE);
        var upy = Math.ceil((this.y+this.size)/BLOCK_SIZE);
        for(var i = downx; i < upx; i++){
            for(var k = downy; k < upy; k++){
                if(data[k] && data[k][i]=="a"){
                    var x = i*BLOCK_SIZE;
                    if(this.x>x){
                        this.x=x+BLOCK_SIZE;
                    }else{
                        this.x=x-this.size;
                    }
                    this.vx = 0;
                }
            }
        }
    },
    collideBlocksY(data){
        this.vy+=0.2;
        if(keys.w&& this.canJump){
            this.vy=-5.5;
        }
        if(keys.s){
            this.vy+=0.1;
        }
        this.canJump = false;
        this.y+=this.vy*=0.99;
        this.y+=this.deltaY;
        this.deltaY = 0;
        var downx = Math.floor(this.x/BLOCK_SIZE);
        var downy = Math.floor(this.y/BLOCK_SIZE);
        var upx = Math.ceil((this.x+this.size)/BLOCK_SIZE);
        var upy = Math.ceil((this.y+this.size)/BLOCK_SIZE);
        for(var i = downx; i < upx; i++){
            for(var k = downy; k < upy; k++){
                if(!!data[k]){
                    if(data[k][i]=="a"){
                        var y = k*BLOCK_SIZE;
                        if(this.y>y){
                            this.y=y+BLOCK_SIZE;
                        }else{
                            this.canJump = true;
                            if(keys.x){alert(this.y)}
                            this.y=y-this.size;
                        }
                        this.vy = 0;
                    }
                }
            }
        }
    },
    dealWithCircle(c){
        const vx = clamp(c.x,this.x,this.x+this.size);
        const vy = clamp(c.y,this.y,this.y+this.size);
        let dx = c.x-vx,
            dy = c.y-vy,
            d=dx*dx+dy*dy;
        if(d<c.r**2 && d){
            d=Math.sqrt(d);
            dx/=d;dy/=d;
            const far = c.r-d;
            this.deltaX-=dx*far;
            this.deltaY-=dy*far;
            const cV = [c.vx||0, c.vy||0];
            const relVel = [cV[0]-this.vx,cV[1]-this.vy];
            const velAlongNormal = relVel[0]*dx+relVel[1]*dy;
            if(velAlongNormal>0)return true;
            this.vx+=dx*velAlongNormal;
            this.vy+=dy*velAlongNormal;
            if(dy>0.5){
                this.canJump = true;
            }
            return true;
        }
        return false;
    },
    backupbonk(data){//I HAT YAy bro
        var downx = Math.floor(this.x/BLOCK_SIZE);
        var downy = Math.floor(this.y/BLOCK_SIZE);
        var upx = Math.ceil((this.x+this.size)/BLOCK_SIZE);
        var upy = Math.ceil((this.y+this.size)/BLOCK_SIZE);
        const closest = [[0,0],1e8];
        for(var i = downx; i < upx; i++){
            for(var k = downy; k < upy; k++){
                if(data[k] && data[k][i]=="a"){
                    var x = i*BLOCK_SIZE;
                    var y = k*BLOCK_SIZE;
                    var d = distsq(x,y,this.x,this.y);
                    if(d<closest[1]){
                        closest[1] = d;
                        closest[0] = [x,y];
                    }
                }
            }
        }
        if(closest[1]<1e8){
            const xDist = [
                this.x+this.size-closest[0][0],
                this.x-closest[0][0]-BLOCK_SIZE
            ].sort((a,b)=>Math.abs(a)-Math.abs(b))[0];
            const yDist = [
                this.y+this.size-closest[0][1],
                this.y-closest[0][1]-BLOCK_SIZE
            ].sort((a,b)=>Math.abs(a)-Math.abs(b))[0];
            if(Math.abs(xDist)<Math.abs(yDist)){
                this.x-=xDist;
                this.baseX = this.x;
            }else{
                this.y-=yDist;
                this.baseY = this.y;
            }
        }
    }
};

const platformer = () => {
    ctx.fillStyle="#700";
    ctx.fillRect(0,0,SIZE, SIZE);
    if(plat_transition.on){
        plat_transition.t = (performance.now()-plat_transition.o)/500;//half a second
        const interpolated = lerp(0,SIZE,smoothstep(plat_transition.t));

        ctx.drawImage(oldLevelImg,plat_transition.dir[0]*interpolated,plat_transition.dir[1]*interpolated,SIZE,SIZE);
        ctx.drawImage(levelImg,plat_transition.dir[0]*(interpolated-SIZE),plat_transition.dir[1]*(interpolated-SIZE),SIZE,SIZE);

        const lastLevelInd = wrapLevel(level[0]+plat_transition.dir[0],level[1]+plat_transition.dir[1]);
        const lastLevel = levels[lastLevelInd[1]][lastLevelInd[0]];
        const currentLevel = levels[level[1]][level[0]];
        ctx.save();
        ctx.translate(plat_transition.dir[0]*interpolated,plat_transition.dir[1]*interpolated);
        lastLevel?.art?.forEach(x=>x.draw(0));
        ctx.translate(-plat_transition.dir[0]*SIZE,-plat_transition.dir[1]*SIZE);
        currentLevel?.art?.forEach(x=>x.draw(0));
        ctx.restore();

        rPlayer.x = rPlayer.baseX+plat_transition.dir[0]*interpolated;
        rPlayer.y = rPlayer.baseY+plat_transition.dir[1]*interpolated;
        rPlayer.draw();
        if(plat_transition.t>=1){
            plat_transition.on = 0;
            rPlayer.x = rPlayer.baseX+plat_transition.dir[0]*SIZE;
            rPlayer.y = rPlayer.baseY+plat_transition.dir[1]*SIZE;
        }
    }else{
        const currentLevel = levels[level[1]][level[0]];
        rPlayer.update(currentLevel.m);
        currentLevel?.art?.forEach(x=>x?.update());
        ctx.drawImage(levelImg,0,0,SIZE,SIZE);
        currentLevel?.art?.forEach(x=>x.draw(performance.now()));
        rPlayer.draw();
        rPlayer.handleLevels();
    }
};