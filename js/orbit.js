function dt() {
    return deltaTime / 1000;
}

function distFunc(d) {
    return 0.5 + 0.5*Math.pow(d, 2)
}

const SIZE_MIN = 0.5
const SIZE_MEAN = 0.5
const SIZE_STD = 0.5
const LIFETIME_MIN = 2
const LIFETIME_MEAN = 6
const LIFETIME_STD = 2
const SPEED_MEAN = 60
const SPEED_STD = 20
const VELOCITY_ANGLE = Math.PI/2

let halfSize = new p5.Vector(0, 0);

class Point {
    constructor(mouse) {
        this.pickRandomPosition();
        this.pickRandomVelocity(mouse);
        this.lifeTimer = 0;
        this.velocityTimer = 0;
    }
  
    update(mouse) {
        this.lifeTimer += dt();
        this.velocityTimer += dt();
        let distFromCenter = Math.min(p5.Vector.sub(this.position, mouse).mag() / halfSize.y, 1.0);
        if (this.velocityTimer > distFunc(distFromCenter)) {
            this.pickRandomVelocity(mouse, distFromCenter);
            this.velocityTimer = 0;
        }
        if (this.lifeTimer > this.lifetime) {
            this.pickRandomPosition();
            this.pickRandomVelocity(mouse, distFromCenter);
            this.lifeTimer = 0;
        }
        let dpos = p5.Vector.mult(this.velocity, dt());
        this.position.add(dpos);
    }
  
    pickRandomPosition() {
        this.size = randomGaussian(SIZE_MEAN, SIZE_STD) + SIZE_MIN
        this.lifetime = randomGaussian(LIFETIME_MEAN, LIFETIME_STD) + LIFETIME_MIN;
        this.position = new p5.Vector(randomGaussian(halfSize.x, halfSize.x/2), randomGaussian(halfSize.y, halfSize.y/2));
    }
  
    pickRandomVelocity(mouse, distFromCenter) {
        let angle = Math.random() * distFunc(distFromCenter);
        if (angle < 0.33) angle = 0;
        else if (angle < 0.66) angle = Math.PI/2;
        else angle = Math.PI;
        angle -= Math.PI/4;
        angle += Math.PI/2 + p5.Vector.sub(this.position, mouse).heading();
        this.velocity = new p5.Vector.fromAngle(angle, randomGaussian(SPEED_MEAN, SPEED_STD));
        //let distFromCenter = Math.min(p5.Vector.sub(this.position, mouse).mag() / halfSize.y, 1.0);
        //let angle = Math.random() * VELOCITY_ANGLE * distFunc(distFromCenter) - VELOCITY_ANGLE/2;
        //angle += Math.PI/2 + p5.Vector.sub(this.position, mouse).heading();
        //this.velocity = new p5.Vector.fromAngle(angle, randomGaussian(SPEED_MEAN, SPEED_STD));
    }

    draw() {
        rect(this.position.x, this.position.y, this.size, this.size);
    }
}

let points = [];

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    halfSize = new p5.Vector(windowWidth / 2, windowHeight / 2);
    canvas.parent('canvas');
        //while (points.length < 500) points.push(new Point(halfSize));
    windowResized();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    halfSize = new p5.Vector(windowWidth / 2, windowHeight / 2);
}

let i = 0;
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        clear(0,0,0);
    } else {
        clear(255, 255, 255);
    }
});
function draw() {
    let mouse = new p5.Vector(mouseX, mouseY);
    if (i % 4 == 0) {
        if (points.length < 500) points.push(new Point(mouse));
        stroke(255,255,255,0);
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            fill(1,1,1,1);
            blendMode(DARKEST);
        } else {
            fill(249,249,249,1);
            blendMode(ADD);
        }
        rect(0, 0, halfSize.x * 2, halfSize.y * 2);
    }
    i++;
    blendMode(BLEND)
    fill(180,180,255,63);
    stroke(255,180,180,15);
    for (let p of points) {
        p.update(mouse);
    }
    for (let p of points) {
        p.draw();
    }
}

