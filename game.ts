class GTE {
    constructor() {

    }

    static Oscillate(time, size, offset) {
        return Math.sin(time) * size + offset;
    }
}


function clamp(x, a, b) {
    return x < a ? a : x > b ? b : x;
}


class Sprite {
    constructor(index) {
        this.index = index | 0;
        this.x = 0;
        this.y = 0;
        this.offsetx = 0;
        this.offsety = 0;
        this.velocityx = 0;
        this.velocityy = 0;
        this.random = Math.random();
        this.timealive = 0.0;
        this.enabled = true;
        this.alive = 1;
        this.active = true;
    }

    reset(x, y) {
        this.x = x || this.x;
        this.y = y || this.y;
        this.offsetx = 0;
        this.offsety = 0;
        this.velocityx = 0;
        this.velocityy = 0;
    }

    update(dt) {
        this.timealive += dt;
        this.offsetx += this.velocityx * dt;
        this.offsety += this.velocityy * dt;
    }

    static Distance(sprite1, sprite2) {
        if (!sprite1 || !sprite2) return 1e6;
        let dx = (sprite1.x + sprite1.offsetx) - (sprite2.x + sprite2.offsetx);
        let dy = (sprite1.y + sprite1.offsety) - (sprite2.y + sprite2.offsety);
        return Math.sqrt(dx * dx + dy * dy);
    }

    static Collide(sprite1, sprite2, d) {
        return Sprite.Distance(sprite1, sprite2) < d ? true : false;
    }
}


class Graphics {
    constructor(canvasElement) {
        let self = this;
        this.canvasElement = canvasElement;
        this.width = canvasElement.width;
        this.height = canvasElement.height;
        this.context = this.canvasElement.getContext("2d");
        this.context.imageSmoothingEnabled = false;
        this.canvasElement.cssText = "image-rendering: pixelated;";
        this.canvasElement.focus();

        this.OAM = [];

        this.sprites = new Image();
        this.context.font = '30px BrodyCom,EssentialPragmataPro,PragmataPro, fixed';
    }

    get spritesLoaded() {
        return this._spritesLoaded;
    }

    clearScreen(color) {
        this.context.fillStyle = color || "black";
        this.context.fillRect(0, 0, this.width, this.height);
    }


    loadSprites(url) {
        let self = this;
        this._spritesLoaded = false;
        this.sprites = new Image();
        this.sprites.addEventListener("load", (e) => {
            self._spritesLoaded = true;
        });
        this.sprites.src = url;
    }

    writeText(text, x, y, color) {
        let g = this.context;
        g.textAlign = 'center';
        g.fillStyle = 'black';
        g.fillText(text, x + 3, y + 3);
        g.fillStyle = color || 'black';
        g.fillText(text, x, y);
    }

    writeTextCentered(text, color, xo, yo) {
        this.writeText(text, (xo | 0) + this.width / 2 + 3, (yo | 0) + this.height / 2 + 3, 'black');
        this.writeText(text, (xo | 0) + this.width / 2, (yo | 0) + this.height / 2, color);
    }


    drawSprite(index, x, y) {
        let g = this.context;
        let cols = this.sprites.width / 8;
        let sx = index % cols;
        let sy = index / cols | 0;
        g.drawImage(this.sprites, sx * 8, sy * 8, 8, 8, x, y, 32, 32);
    }


    drawSprites() {
        for (let sprite of this.OAM) {
            if (sprite.enabled)
                this.drawSprite(sprite.index, sprite.x + sprite.offsetx, sprite.y + sprite.offsety);
        }
    }
}

const KEY_BUTTON0 = 0;
const KEY_BUTTON1 = 1;
const KEY_BUTTON2 = 2;
const KEY_BUTTON3 = 3;
const KEY_BACK = 8;
const KEY_FORWARD = 9;
const KEY_SELECT = 8;
const KEY_START = 9;
const KEY_LEFT = 14;
const KEY_RIGHT = 15;
const KEY_UP = 12;
const KEY_DOWN = 13;

class Input {
    constructor() {
        this.buttons = 0;
        let self = this;
        window.addEventListener("keydown", (e) => {
            self.onkeychange(e, true);
        });
        window.addEventListener("keyup", (e) => {
            self.onkeychange(e, false);
        });
    }

    setkey(which, state) {
        if (which < 0 || which >= 32)
            return;
        let mask = 1 << which;
        if (state) {
            this.buttons |= mask;
        } else {
            this.buttons &= ~mask;
        }
    }

    getkey(which) {
        if (which < 0 || which >= 32)
            return false;
        let mask = 1 << which;
        if (this.buttons & mask)
            return true;
        return false;
    }

    onkeychange(e, state) {
        let oldbuttons = this.buttons;
        switch (e.key) {
            case 'ArrowLeft':
            case 'Left':
            case 'a':
            case 'A':
                this.setkey(KEY_LEFT, state);
                break;
            case 'ArrowRight':
            case 'Right':
            case 'd':
            case 'D':
                this.setkey(KEY_RIGHT, state);
                break;
            case 'ArrowUp':
            case 'Up':
            case 'w':
            case 'W':
                this.setkey(KEY_UP, state);
                break;
            case 'ArrowDown':
            case 'Down':
            case 's':
            case 'S':
                this.setkey(KEY_DOWN, state);
                break;
            case 'Enter':
            case 'Return':
                this.setkey(KEY_START, state);
                break;
            case 'Esc':
            case 'Escape':
                this.setkey(KEY_BACK, state);
                break;
        }
        if (this.buttons != oldbuttons)
            e.preventDefault();
    }
}

class Game {
    constructor(width, height) {
        width = width || 512;
        height = height || 384;
        this.divElement = document.createElement('div');
        this.divElement.id = 'game';
        this.divElement.style.textAlign = 'center';
        this.canvasElement = document.createElement('canvas');
        this.canvasElement.id = 'gamecanvas';
        this.width = width;
        this.height = height;
        this.canvasElement.width = width;
        this.canvasElement.height = height;
        document.body.appendChild(this.divElement);
        this.divElement.appendChild(this.canvasElement);
        this.Graphics = new Graphics(this.canvasElement);
        this.Input = new Input();
        this.Music = [];
        this.Music.push(document.createElement("audio"));
        this.Music.push(document.createElement("audio"));
        this.Music[0].src = "1hgj153.mp3";
        this.Music[1].src = "oceanwaves.mp3";
        this.musicPromises = [null, null];
        this.Music[0].pause();
        this.Music[1].pause();
        this.musicNum = 0;

        this.dt = 0.0;
        this.t0 = 0.0;
        this.t1 = 0.0;

        this.gameover = true;
        this.gamelevel = 1;
        this.score = 0;
        this.curWall = 0;
        this.wallTime = 0;
        this.moveTime = 0; // This is used to make sure the player can't move too quickly
        this.cacheTime = 0; // This is used to make sure the cache can't be loaded too quickly
        this.orderTime = 0;
        this.waitForSpawn = 0;
        this.gamerect = {
            x0: 0,
            x1: this.width,
            y0: 64,
            y1: this.height - 32,
            w: this.width,
            h: this.height - (32 + 64)
        };

        this.yayTime = 0.0;
        this.badTime = 0.0;

        this.memBlockPosition = 0;
        this.memBlocks = 4;
        this.mem = [];
        this.memOAM = 0;

        this.cacheBlockPosition = 0;
        this.cacheBlocks = 2;
        this.cacheOAM = 0;
        this.cache = [];

        this.incomingOrders = [];
        this.order = 0;
        this.orderOAM = 0;


        this.playfieldX = 50;
        this.playfieldY = 100;
        this.memBlockSpacing = (this.height - this.playfieldX) / 9;
        this.cacheBlockSpacing = (this.height - this.playfieldY) / 5;
        this.incomingOrdersSpacing = (this.height - this.playfieldY) / 5;
    }


    run() {
        this.load();
        this.mainloop(0);
    }


    mainloop(t) {
        let self = this;

        this.update(t);
        this.display();

        window.requestAnimationFrame((t) => {
            self.mainloop(t / 1000.0);
        });
    }


    load() {
        let g = this.Graphics;
        g.loadSprites("sprites.png?" + Date.now());
        g.OAM.push(new Sprite(26));
        g.OAM.push(new Sprite(24));
        g.OAM.push(new Sprite(3));
        g.OAM.push(new Sprite(3));
        for (let i = 4; i < 200; i++) {
            g.OAM.push(new Sprite(9));
            g.OAM[i].enabled = false;
        }
        for (let i = 102; i < 112; i++) {
            g.OAM[i].index = 11;
        }
        this.changelevel(this.gamelevel);

    }

    changelevel(which) {
        let g = this.Graphics;

        if (which == 1) {
            //this.Music[0].volume = 1.0;
            this.Music[0].currentTime = 0;
            this.musicPromises[0] = this.Music[0].play();
        }
        this.gamelevel = which;
        this.waitForSpawn = this.t1 + 2;
        this.wallTime = 0;
        this.levelTime = this.t1 + 30;
        this.orderTime = this.t1 + 3;
        this.moveTime = this.t1 - 1.0;
        this.cacheTime = this.t1 - 1.0;
        this.yayTime = 0.0;
        this.badTime = 0.0;
        this.memBlocks = 8;
        this.cacheBlocks = 4; // TODO: Set this to easy, medium, hard?

        let x1 = this.width / 4;
        let oam = 4;
        this.mem = [];
        this.memOAM = oam;
        for (let i = 0; i < this.memBlocks; i++) {
            this.mem.push(i);
            g.OAM[oam].reset();
            g.OAM[oam].index = 8 + this.mem[i];
            g.OAM[oam].enabled = true;
            g.OAM[oam].x = x1;
            g.OAM[oam].y = this.playfieldY + i * this.memBlockSpacing;
            oam++;
        }

        let y2 = (this.height - this.playfieldY) / this.cacheBlocks;
        this.cache = [];
        this.cacheOAM = oam;
        for (let i = 0; i < this.cacheBlocks; i++) {
            this.cache.push(0);
            g.OAM[oam].reset();
            g.OAM[oam].index = 4;
            g.OAM[oam].enabled = false;
            g.OAM[oam].x = this.width / 2;
            g.OAM[oam].y = (i + 1) * this.cacheBlockSpacing + this.cacheBlockSpacing;
            oam++;
        }

        this.incomingOrders = [];
        this.order = 0;
        for (let i = 0; i < 4 * this.gamelevel; i++) {
            this.incomingOrders.push((Math.random() * 8) | 0);
        }

        this.orderOAM = oam;
        for (let i = this.order; i < this.order + 4; i++) {
            g.OAM[oam].index = 8 + this.incomingOrders[i];
            g.OAM[oam].enabled = true;
            g.OAM[oam].x = this.width - x1;
            g.OAM[oam].y = this.playfieldY + (i - this.order) * 32;
            oam++;
        }

        g.OAM[0].x = 50;
        g.OAM[0].y = this.height / 2;
        g.OAM[0].enabled = true;
        g.OAM[1].enabled = false;
        g.OAM[2].enabled = false;
        g.OAM[3].enabled = false;
        // g.OAM[1].x = 1e6;
        // g.OAM[1].y = g.OAM[0].y;
        // g.OAM[1].enabled = false;
        // for (let wall = 2; wall <= 3; wall++) {
        //     g.OAM[wall].index = 3;
        //     g.OAM[wall].x = 1e6;
        //     g.OAM[wall].y = g.OAM[0].y;
        //     g.OAM[wall].enabled = true;
        // }

        // for (let i = 0; i < g.OAM.length; i++) {
        //     g.OAM[i].offsetx = 0;
        //     g.OAM[i].offsety = 0;
        // }

        // let startEnemy = 4;
        // let numEnemies = 4 + which;
        // let maxEnemies = 100;
        // for (let i = startEnemy; i < startEnemy + maxEnemies; i++) {
        //     g.OAM[i].enabled = false;
        // }
        // for (let i = startEnemy; i < startEnemy + numEnemies; i++) {
        //     g.OAM[i].enabled = true;
        //     g.OAM[i].x = -100;
        //     g.OAM[i].y = Math.random() * this.height;
        // }

        let maxKibbles = 10;
        let kibble0 = 102;

        for (var i = kibble0; i < kibble0 + maxKibbles; i++) {
            g.OAM[i].enabled = false;
        }
    }


    isended(index) {
        if (index < 0 || index >= this.Music.length)
            return false;
        return this.Music[index].ended || this.Music[index].paused;
    }


    playMusic(index) {
        if (index < 0 || index >= this.Music.length)
            return;
        this.Music[index].currentTime = 0.0;
        this.musicPromises[index] = this.Music[index].play();
    }

    stopMusic(index) {
        if (index < 0 || index >= this.Music.length)
            return;
        this.Music[index].currentTime = 0.0;
        this.Music[index].pause();
    }


    startExplosion(i) {
        let g = this.Graphics;
        for (let kibble = 102; kibble < 112; kibble++) {
            if (Math.random() < 0.5) continue;
            g.OAM[kibble].index = 25;
            g.OAM[kibble].enabled = true;
            g.OAM[kibble].reset(g.OAM[i].x, g.OAM[i].y);
            g.OAM[kibble].velocityx = (Math.random() - 0.5) * 150;
            g.OAM[kibble].velocityy = (Math.random() - 0.5) * 150;
            g.OAM[kibble].timealive = this.t1 + 1.0;
        }
        g.OAM[i].x = -100;
    }


    update(t) {
        this.dt = t - this.t1 - this.t0;
        this.t1 = t - this.t0;

        let g = this.Graphics;

        this.Music[1].volume = (1.0 - this.Music[0].volume) * 0.25 + 0.15;
        if (this.isended(0)) this.playMusic(0);
        if (this.isended(1)) this.playMusic(1);

        if (g.OAM[0].alive <= 0)
            this.gameover = true;

        if (this.gameover) {
            this.Music[0].volume = this.Music[0].volume * 0.95;
            if (this.Input.getkey(KEY_START)) {
                this.gameover = false;
                this.changelevel(1);
                g.OAM[0].alive = 5;
                this.waitForSpawn = 0;
            }
            return;
        } else {
            this.Music[0].volume += (1.0 - this.Music[0].volume) * 0.05;
        }

        if (this.t1 >= this.waitForSpawn) {
            g.OAM[0].active = true;
        }

        if (this.waitForSpawn >= this.t1) {
            return;
        }

        if (this.orderTime < this.t1 && this.order > this.incomingOrders.length) {
            this.changelevel(this.gamelevel + 1);
            this.waitForSpawn = this.t1 + 2.0;
        }


        // let startEnemy = 4;
        // let maxEnemies = 50;
        // for (let i = startEnemy; i < startEnemy + maxEnemies; i++) {
        //     if (!g.OAM[i].enabled) continue;
        //     let r = (g.OAM[i].random + 0.5);
        //     g.OAM[i].x -= this.dt * r * 100 * Math.log(this.gamelevel + this.t1);
        //     g.OAM[i].offsetx = 0;
        //     g.OAM[i].offsety = Math.sin(g.OAM[i].random + this.t1 * 18 * r) * 8;

        //     if (g.OAM[i].x < 0) {
        //         g.OAM[i].y = Math.random() * this.gamerect.h + this.gamerect.y0;
        //         g.OAM[i].x = this.width;
        //         g.OAM[i].index = Math.floor(Math.random() * 4) + 9;
        //     }

        //     for (let wall = 2; wall <= 3; wall++) {
        //         if (Sprite.Collide(g.OAM[wall], g.OAM[i], 32)) {
        //             g.OAM[i].x = g.OAM[wall].x + 16;
        //             g.OAM[wall].x -= 16 * this.dt;
        //         }
        //     }

        //     if (Sprite.Collide(g.OAM[1], g.OAM[i], 32)) {
        //         this.startExplosion(i);
        //     }

        //     if (g.OAM[0].active && Sprite.Collide(g.OAM[0], g.OAM[i], 32)) {
        //         g.OAM[0].alive--;
        //         g.OAM[0].active = false;
        //         this.startExplosion(0);
        //         this.startExplosion(i);
        //         this.waitForSpawn = this.t1 + 2.0;
        //     }
        // }

        for (let kibble = 102; kibble < 112; kibble++) {
            g.OAM[kibble].update(0);
            if (g.OAM[kibble].timealive < this.t1)
                g.OAM[kibble].enabled = false;
        }

        if (this.moveTime < this.t1) {
            let dy = 0;
            if (this.Input.getkey(KEY_UP)) {
                dy -= 1;
            }
            if (this.Input.getkey(KEY_DOWN)) {
                dy += 1;
            }
            if (dy != 0) {
                this.moveTime = this.t1 + 0.15;
            }

            this.memBlockPosition = clamp(this.memBlockPosition + dy, 0, (this.memBlocks / 2) - 1);
            g.OAM[0].y = this.playfieldY + (this.memBlockPosition) * this.memBlockSpacing * 2.0 + this.memBlockSpacing / 2;
        }

        if (this.cacheTime < this.t1) {
            let dx = 0;
            if (this.Input.getkey(KEY_RIGHT)) {
                dx += 1;
            }

            if (dx != 0) {
                this.cacheTime = this.t1 + 0.25;
                this.loadCache();
            }
        }
        g.OAM[0].offsety = GTE.Oscillate(this.t1, 4.0, 0);

        // Set up the cache sprites

        let oam = this.orderOAM;
        for (let i = this.order; i < this.order + 4; i++) {
            g.OAM[oam].index = 8 + this.incomingOrders[i];
            g.OAM[oam].enabled = true;
            if (i != this.order) {
                g.OAM[oam].x = this.width - ((i == this.order) ? 2.0 : 1.0) * this.cacheBlockSpacing;
                g.OAM[oam].y = this.playfieldY + (i - this.order) * 32;
            } else {
                g.OAM[oam].x = this.width - 2 * this.cacheBlockSpacing;
                g.OAM[oam].y = (this.height - this.playfieldY) * 0.5;
            }
            g.OAM[oam].offsety = GTE.Oscillate(this.t1, 4.0, oam);
            oam++;
        }

        oam = this.memOAM;
        for (let i = 0; i < this.mem.length; i++) {
            g.OAM[oam].offsety = GTE.Oscillate(this.t1, 5.0, oam);
            oam++;
        }

        if (this.orderTime < this.t1) {
            this.orderTime = this.t1 + 2.0 - this.gamelevel/10.0; // the 1.2 is to make the incoming orders run slower
            this.makeOrder();
        }

        // Set up the incoming order sprites

        let x1 = this.width / 4;
        oam = this.orderOAM;
        for (let i = this.order; i < this.order + 4; i++) {
            if (i >= this.incomingOrders.length) {
                g.OAM[oam].enabled = false;
            } else {
                g.OAM[oam].index = 8 + this.incomingOrders[i];
                g.OAM[oam].enabled = true;
            }
            if (i == this.order) {
                g.OAM[oam].x = this.width - 1.5 * x1;
                g.OAM[oam].y = this.playfieldY + (this.height - this.playfieldY) * 0.5;
            } else {
                g.OAM[oam].x = this.width - x1;
                g.OAM[oam].y = this.playfieldY + (i - this.order) * this.cacheBlockSpacing;
            }
            g.OAM[oam].offsety = GTE.Oscillate(this.t1, 4.0, 4.0 * oam);
            oam++;
        }

        // let speed = this.height / 2;
        // let projectileSpeed = this.height;
        // let dy = 0;
        // let dx = 0;
        // if (g.OAM[0].active) {
        //     g.OAM[0].enabled = true;
        //     if (this.Input.getkey(KEY_UP)) {
        //         dy -= speed;
        //     }
        //     if (this.Input.getkey(KEY_DOWN)) {
        //         dy += speed;
        //     }

        //     if (g.OAM[1].x < 0 || g.OAM[1].x > this.width && this.Input.getkey(KEY_RIGHT)) {
        //         g.OAM[1].index = 24;
        //         g.OAM[1].enabled = true;
        //         g.OAM[1].x = g.OAM[0].x;
        //         g.OAM[1].y = g.OAM[0].y;
        //     }

        //     if (this.wallTime < this.t1 && this.Input.getkey(KEY_LEFT)) {
        //         this.wallTime = this.t1 + 0.25;
        //         let wall = g.OAM[2].x < g.OAM[3].x ? 3 : 2;

        //         g.OAM[wall].index = 3;
        //         g.OAM[wall].enabled = true;
        //         g.OAM[wall].x = g.OAM[0].x;
        //         g.OAM[wall].y = g.OAM[0].y;
        //         this.curWall = 1 - this.curWall;
        //     }
        // } else {
        //     g.OAM[0].enabled = Math.floor(Math.sin(10.0 * this.t1) + 1.0) > 1.0;
        // }

        // g.OAM[0].x = 50;
        // g.OAM[0].y += dy * this.dt;
        // g.OAM[0].offsetx = 0;
        // g.OAM[0].offsety = GTE.Oscillate(this.t1, 4.0, 2.0);

        // g.OAM[1].x += this.dt * projectileSpeed;

        // for (let wall = 2; wall <= 3; wall++) {
        //     if (g.OAM[wall].x > this.width)
        //         continue;
        //     g.OAM[wall].x += this.dt * 0.25 * (projectileSpeed * Math.random());
        //     //g.OAM[wall].x = Math.min(g.OAM[wall].x, this.width / 2);
        //     g.OAM[wall].offsetx = 0;
        //     g.OAM[wall].offsety = GTE.Oscillate(this.t1, 2.0, 1.0);
        // }

        // for (let i = 0; i < 3; i++) {
        //     g.OAM[i].y = clamp(g.OAM[i].y, 32, this.height - 16);
        // }
    }


    loadCache() {
        let g = this.Graphics;
        this.cacheBlockPosition = 1 - this.cacheBlockPosition;
        let oam = this.cacheOAM;
        for (let i = 0; i < 2; i++) {
            let j = 2 * this.cacheBlockPosition + i;
            this.cache[j] = this.mem[this.memBlockPosition * 2 + i];
            g.OAM[oam + j].index = 8 + this.cache[j];
            g.OAM[oam + j].enabled = true;
        }
    }


    makeOrder() {
        let g = this.Graphics;
        let request = this.incomingOrders[this.order];
        let found = false;
        for (let i = 0; i < this.cacheBlocks * 2; i++) {
            if (request == this.cache[i]) {
                found = true;
                break;
            }
        }
        if (!found) {
            this.startExplosion(this.orderOAM);
            g.OAM[0].alive--;
            this.badTime = this.t1 + 1.0;
        } else {
            this.yayTime = this.t1 + 1.0;
            this.score += 100;
        }
        this.order++;
    }


    display() {
        let g = this.Graphics;
        if (!g.spritesLoaded) {
            g.clearScreen('blue');
            g.writeTextCentered('Loading', 'white');
        } else {
            g.clearScreen('lightblue');
            if (this.Input.getkey(KEY_LEFT))
                g.clearScreen('lightblue');
            else if (this.Input.getkey(KEY_RIGHT))
                g.clearScreen('yellow');

            // draw Sky
            let cols = this.width / 32;
            let rows = this.height / 32;
            for (let i = 0; i <= cols; i++) {
                for (let j = 0; j <= 3; j++) {
                    g.drawSprite(2, i * 32, j * 32);
                    g.drawSprite(2, i * 32, j * 32);
                    g.drawSprite(2, i * 32, j * 32);
                }
            }

            // draw ocean bottom
            for (let i = 0; i <= cols; i++) {
                for (let j = 3; j <= rows; j++) {
                    g.drawSprite(0, i * 32, j * 32);
                }
            }

            let oceany = 3 * 32;
            let shipy = 2 * 32 - 8;

            // draw ship
            g.drawSprite(4, Math.cos(this.t1 * 0.25) * 64 + this.width / 2, shipy + 2 * Math.sin(this.t1));
            g.drawSprite(5, 32 + Math.cos(this.t1 * 0.25) * 64 + this.width / 2, shipy + 2 * Math.sin(1 + this.t1));
            g.drawSprite(6, 64 + Math.cos(this.t1 * 0.25) * 64 + this.width / 2, shipy + 2 * Math.sin(2 + this.t1));

            // draw ocean top
            for (let i = 0; i < 60; i++) {
                g.drawSprite(1, i * 16, oceany - 16 + 4 * Math.sin(i * 16 + 5 * this.t1));
            }

            g.drawSprites();

            if (this.gameover) {
                g.writeTextCentered(title, 'white', 0, -this.height / 5);
                g.writeTextCentered('Press START!', 'red');
            } else {
                g.context.fillStyle = 'red';
                //g.context.fillRect(0, 0, this.width * ((this.gamelevel + 10.0) - this.t1) / (10.0 + this.gamelevel), 32);

                let timeLeft = this.orderTime - this.t1;
                if (timeLeft < 0) timeLeft = 3;
                let x1 = this.width / 2;
                g.context.fillRect(x1 - 32, this.height - 32, 64 * timeLeft, 32);
                if (this.t1 < 2.0) {

                    g.writeTextCentered('Level ' + this.gamelevel, 'lightblue');
                }
                g.writeText('LIVES ' + g.OAM[0].alive, this.width - 100, 32, 'red');
                g.writeText('SCORE ' + this.score, this.width / 2, 32, 'red');

                // draw the HUD
                if (this.moveTime < this.t1) {
                    g.drawSprite(24, 0, 0);
                }
                if (this.cacheTime < this.t1) {
                    g.drawSprite(7, 32, 0);
                }

                if (this.waitForSpawn > this.t1 - 1) {
                    g.writeTextCentered('Ready?', 'red', 0, 32);
                }
                else if (this.waitForSpawn > this.t1) {
                    g.writeText('Set', 'yellow', 0, 48);
                }
                else if (this.waitForSpawn > this.t1 - 3) {
                    g.writeTextCentered('Go!', 'green', 0, 64);
                }

                let dt = this.yayTime - this.t1;
                if (this.yayTime > this.t1) {
                    g.writeTextCentered('Yes!', 'white', -32, -32);
                }
                if (this.badTime > this.t1) {
                    g.writeTextCentered('No!', 'red', -32, -32);
                }
            }
        }

    }
}


let game = new Game(640, 480);
game.run();
