class Chord {
    constructor(color) {
        this.color = color;
        this.color.setAlpha(CHORD_ALPHA);
        this.angle1 = random(0, TAU);
        this.angle2 = random(0, TAU);
        if (abs(this.angle1 - this.angle2) < MIN_ANGLE) {
            this.angle2 += Math.sign(this.angle2 - this.angle1) * MIN_ANGLE;
        }
        this.prevTime = 0;
        this.time = 0;
    }

    draw(dt) {
        let x1 = windowWidth / 2 + RADIUS * cos(this.angle1);
        let y1 = windowHeight / 2 + RADIUS * sin(this.angle1);
        let x2 = windowWidth / 2 + RADIUS * cos(this.angle2);
        let y2 = windowHeight / 2 + RADIUS * sin(this.angle2);
        let xdir = x2 - x1;
        let ydir = y2 - y1;
        this.time += dt;
        this.time = min(DURATION, this.time);
        let frac = this.time / DURATION;
        let prevFrac = this.prevTime / DURATION;
        this.prevTime = this.time;
        stroke(this.color);
        line(x1 + prevFrac * xdir, y1 + prevFrac * ydir, x1 + frac * xdir, y1 + frac * ydir);
    }
}

let drawn = 0;
let chords = [];

function setup() {
    MIN_ANGLE = 0.125 * PI;
    BACKGROUND_COLOR = '#7AB7CF';
    CHORD_COLOR = '#F56E87';
    CHORD_ALPHA = 10;
    MAX_COUNT = 1200;
    DURATION = 20;
    createCanvas(windowWidth, windowHeight);
    windowResized();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    RADIUS = min(windowWidth, windowHeight) / 2 * 0.8;
    background(BACKGROUND_COLOR);
    drawn = 0;
    chords = [];
}

function draw() {
    dt = deltaTime / 1000;
    for (chord of chords) {
        chord.draw(dt);
    }
    let currentCount = chords.length;
    chords = chords.filter(chord => chord.time < DURATION);
    drawn += currentCount - chords.length;
    while (chords.length < MAX_COUNT && drawn < 2*PI*RADIUS) {
            chords.push(new Chord(color(CHORD_COLOR)));
    }
}
