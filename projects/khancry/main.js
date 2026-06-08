let scene = 1;
const scenes = [platformer,threed];
const loop = () => {
    scenes[scene]();
    DumbShow.run();
    requestAnimationFrame(loop);
};

loop();