class Matrix4 extends Float32Array{
    constructor(...a){
        super(...a);
    }
    set(a){
        for(let i = 0; i < a.length; i++){
            this[i] = a[i];
        }
    }
    translate(x,y,z){
        this.multiply(Matrix4.translation(x,y,z));
    }
    scale(x,y,z){
        this.multiply(Matrix4.scalation(x,y,z));
    }
    rotateX(ang){
        this.multiply(Matrix4.rotationX(ang));
    }
    rotateY(ang){
        this.multiply(Matrix4.rotationY(ang));
    }
    rotateZ(ang){
        this.multiply(Matrix4.rotationZ(ang));
    }
    multiply(b){
        this.set(Matrix4.multiply(this,b));
    }
    iMultiply(b){
        this.set(Matrix4.multiply(b,this));
    }
    perspective(FOV, aspect, zNear, zFar){
        this.iMultiply(Matrix4.perspective(FOV, aspect, zNear, zFar));
    }
    static multiply(a,b){
        //I didn't want to
        return new Matrix4([
            b[0]*a[0]+b[1]*a[4]+b[2]*a[8]+b[3]*a[12],
            b[0]*a[1]+b[1]*a[5]+b[2]*a[9]+b[3]*a[13],
            b[0]*a[2]+b[1]*a[6]+b[2]*a[10]+b[3]*a[14],
            b[0]*a[3]+b[1]*a[7]+b[2]*a[11]+b[3]*a[15],
            
            b[4]*a[0]+b[5]*a[4]+b[6]*a[8]+b[7]*a[12],
            b[4]*a[1]+b[5]*a[5]+b[6]*a[9]+b[7]*a[13],
            b[4]*a[2]+b[5]*a[6]+b[6]*a[10]+b[7]*a[14],
            b[4]*a[3]+b[5]*a[7]+b[6]*a[11]+b[7]*a[15],
            
            b[8]*a[0]+b[9]*a[4]+b[10]*a[8]+b[11]*a[12],
            b[8]*a[1]+b[9]*a[5]+b[10]*a[9]+b[11]*a[13],
            b[8]*a[2]+b[9]*a[6]+b[10]*a[10]+b[11]*a[14],
            b[8]*a[3]+b[9]*a[7]+b[10]*a[11]+b[11]*a[15],
            
            b[12]*a[0]+b[13]*a[4]+b[14]*a[8]+b[15]*a[12],
            b[12]*a[1]+b[13]*a[5]+b[14]*a[9]+b[15]*a[13],
            b[12]*a[2]+b[13]*a[6]+b[14]*a[10]+b[15]*a[14],
            b[12]*a[3]+b[13]*a[7]+b[14]*a[11]+b[15]*a[15],
        ]);
    }
    static translation(x,y,z){
        return new Matrix4([
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            x,y,z,1
        ]);
    }
    static scalation(x,y,z){
        return new Matrix4([
            x,0,0,0,
            0,y,0,0,
            0,0,z,0,
            0,0,0,1
        ]);
    }
    static rotationZ(ang){
        const c = Math.cos(ang);
        const s = Math.sin(ang);
        return new Matrix4([
            c,-s,0,0,
            s,c,0,0,
            0,0,1,0,
            0,0,0,1
        ]);
    }
    static rotationY(ang){
        const c = Math.cos(ang);
        const s = Math.sin(ang);
        return new Matrix4([
            c,0,-s,0,
            0,1,0,0,
            s,0,c,0,
            0,0,0,1
        ]);
    }
    static rotationX(ang){
        const c = Math.cos(ang);
        const s = Math.sin(ang);
        return new Matrix4([
            1,0,0,0,
            0,c,-s,0,
            0,s,c,0,
            0,0,0,1
        ]);
    }
    static identity(){
        return new Matrix4([
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        ]);
    }
    static perspective(FOV, aspect, zNear, zFar){
        const f = Math.tan(Math.PI * 0.5 - 0.5 * FOV);
        const rangeInv = 1/(zNear-zFar);

        return new Matrix4([
            f/aspect, 0,0,0,
            0,f,0,0,
            0,0,zFar*rangeInv,-1,
            0,0,zNear*zFar*rangeInv,0,
        ]);
    }
};