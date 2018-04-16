"use strict";
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
        if (!sprite1 || !sprite2)
            return 1e6;
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
        }
        else {
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
            if (Math.random() < 0.5)
                continue;
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
        if (this.isended(0))
            this.playMusic(0);
        if (this.isended(1))
            this.playMusic(1);
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
        }
        else {
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
            }
            else {
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
            this.orderTime = this.t1 + 2.0 - this.gamelevel / 10.0; // the 1.2 is to make the incoming orders run slower
            this.makeOrder();
        }
        // Set up the incoming order sprites
        let x1 = this.width / 4;
        oam = this.orderOAM;
        for (let i = this.order; i < this.order + 4; i++) {
            if (i >= this.incomingOrders.length) {
                g.OAM[oam].enabled = false;
            }
            else {
                g.OAM[oam].index = 8 + this.incomingOrders[i];
                g.OAM[oam].enabled = true;
            }
            if (i == this.order) {
                g.OAM[oam].x = this.width - 1.5 * x1;
                g.OAM[oam].y = this.playfieldY + (this.height - this.playfieldY) * 0.5;
            }
            else {
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
        }
        else {
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
        }
        else {
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
            }
            else {
                g.context.fillStyle = 'red';
                //g.context.fillRect(0, 0, this.width * ((this.gamelevel + 10.0) - this.t1) / (10.0 + this.gamelevel), 32);
                let timeLeft = this.orderTime - this.t1;
                if (timeLeft < 0)
                    timeLeft = 3;
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
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="./GTE.ts" />
class Vector2 {
    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
    reset(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    sub(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    mul(multiplicand) {
        return new Vector2(this.x * multiplicand, this.y * multiplicand);
    }
    // returns 0 if denominator is 0
    div(divisor) {
        if (divisor == 0.0)
            return new Vector2();
        return new Vector2(this.x / divisor, this.y / divisor);
    }
    neg() {
        return new Vector2(-this.x, -this.y);
    }
    toFloat32Array() {
        return new Float32Array([this.x, this.y]);
    }
    toVector2() {
        return new Vector2(this.x, this.y);
    }
    toVector3() {
        return new Vector3(this.x, this.y, 0.0);
    }
    toVector4() {
        return new Vector4(this.x, this.y, 0.0, 0.0);
    }
    project() {
        return this.x / this.y;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y;
    }
    norm() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector2();
        else
            len = Math.sqrt(len);
        return new Vector2(this.x / len, this.y / len);
    }
    static make(x, y) {
        return new Vector2(x, y);
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }
    static cross(a, b) {
        return a.x * b.y - a.y * b.x;
    }
    static normalize(v) {
        let len = v.length();
        if (len == 0.0) {
            v.reset(0.0, 0.0);
        }
        else {
            v.x /= len;
            v.y /= len;
        }
        return v;
    }
}
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="./GTE.ts" />
class Vector3 {
    constructor(x = 0.0, y = 0.0, z = 0.0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }
    clone() {
        return new Vector3(this.x, this.y, this.z);
    }
    reset(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }
    static makeFromSpherical(theta, phi) {
        return new Vector3(Math.cos(phi) * Math.cos(theta), Math.sin(phi), -Math.cos(phi) * Math.sin(theta));
    }
    // Converts (rho, theta, phi) so that rho is distance from origin,
    // theta is inclination away from positive y-axis, and phi is azimuth
    // from positive z-axis towards the positive x-axis.
    static makeFromSphericalISO(rho, thetaInRadians, phiInRadians) {
        return new Vector3(rho * Math.sin(thetaInRadians) * Math.cos(phiInRadians), rho * Math.cos(thetaInRadians), rho * Math.sin(thetaInRadians) * Math.sin(phiInRadians));
    }
    // Converts (rho, theta, phi) so that rho is distance from origin,
    // phi is inclination away from positive y-axis, and theta is azimuth
    // from positive z-axis towards the positive x-axis.
    static makeFromSphericalMath(rho, thetaInRadians, phiInRadians) {
        return new Vector3(rho * Math.sin(phiInRadians) * Math.sin(thetaInRadians), rho * Math.cos(phiInRadians), rho * Math.sin(phiInRadians) * Math.cos(thetaInRadians));
    }
    // theta represents angle from +x axis on xz plane going counterclockwise
    // phi represents angle from xz plane going towards +y axis
    setFromSpherical(theta, phi) {
        this.x = Math.cos(theta) * Math.cos(phi);
        this.y = Math.sin(phi);
        this.z = -Math.sin(theta) * Math.cos(phi);
        return this;
    }
    get theta() {
        return Math.atan2(this.x, -this.z) + ((this.z <= 0.0) ? 0.0 : 2.0 * Math.PI);
    }
    get phi() {
        return Math.asin(this.y);
    }
    static make(x, y, z) {
        return new Vector3(x, y, z);
    }
    static makeUnit(x, y, z) {
        return (new Vector3(x, y, z)).norm();
    }
    add(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    sub(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    mul(multiplicand) {
        return new Vector3(this.x * multiplicand, this.y * multiplicand, this.z * multiplicand);
    }
    // returns 0 if denominator is 0
    div(divisor) {
        if (divisor == 0.0)
            return new Vector3();
        return new Vector3(this.x / divisor, this.y / divisor, this.z / divisor);
    }
    neg() {
        return new Vector3(-this.x, -this.y, -this.z);
    }
    // multiplicative inverse (1/x)
    reciprocal() {
        return new Vector3(1.0 / this.x, 1.0 / this.y, 1.0 / this.z);
    }
    pow(power) {
        return new Vector3(Math.pow(this.x, power), Math.pow(this.y, power), Math.pow(this.z, power));
    }
    compdiv(divisor) {
        return new Vector3(this.x / divisor.x, this.y / divisor.y, this.z / divisor.z);
    }
    compmul(multiplicand) {
        return new Vector3(this.x * multiplicand.x, this.y * multiplicand.y, this.z * multiplicand.z);
    }
    toArray() {
        return [this.x, this.y, this.z];
    }
    toFloat32Array() {
        return new Float32Array([this.x, this.y, this.z]);
    }
    toVector2() {
        return new Vector2(this.x, this.y);
    }
    toVector4(w) {
        return new Vector4(this.x, this.y, this.z, w);
    }
    project() {
        return new Vector2(this.x / this.z, this.y / this.z);
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    norm() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector3();
        else
            len = Math.sqrt(len);
        return new Vector3(this.x / len, this.y / len, this.z / len);
    }
    normalize() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector3();
        else
            len = Math.sqrt(len);
        this.x /= len;
        this.y /= len;
        this.z /= len;
        return this;
    }
    get(index) {
        switch (index) {
            case 0: return this.x;
            case 1: return this.y;
            case 2: return this.z;
        }
        return 0.0;
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
    }
    static cross(a, b) {
        return new Vector3(a.y * b.z - b.y * a.z, a.z * b.x - b.z * a.x, a.x * b.y - b.x * a.y);
    }
    static add(a, b) {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }
    static sub(a, b) {
        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    }
    static mul(a, b) {
        return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);
    }
    static div(a, b) {
        return new Vector3(a.x / b.x, a.y / b.y, a.z / b.z);
    }
}
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="./GTE.ts" />
class Vector4 {
    constructor(x = 0.0, y = 0.0, z = 0.0, w = 1.0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w;
        return this;
    }
    clone() {
        return new Vector4(this.x, this.y, this.z, this.w);
    }
    reset(x = 0.0, y = 0.0, z = 0.0, w = 1.0) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    }
    add(v) {
        return new Vector4(this.x + v.x, this.y + v.y, this.z + v.z, this.w + v.w);
    }
    sub(v) {
        return new Vector4(this.x - v.x, this.y - v.y, this.z - v.z, this.w - v.w);
    }
    mul(multiplicand) {
        return new Vector4(this.x * multiplicand, this.y * multiplicand, this.z * multiplicand, this.w * multiplicand);
    }
    // returns 0 if denominator is 0
    div(divisor) {
        if (divisor == 0.0)
            return new Vector4();
        return new Vector4(this.x / divisor, this.y / divisor, this.z / divisor, this.w / divisor);
    }
    neg() {
        return new Vector4(-this.x, -this.y, -this.z, -this.w);
    }
    toFloat32Array() {
        return new Float32Array([this.x, this.y, this.z, this.w]);
    }
    toArray() {
        return [this.x, this.y, this.z, this.w];
    }
    toVector2() {
        return new Vector2(this.x, this.y);
    }
    toVector3() {
        return new Vector3(this.x, this.y, this.z);
    }
    project() {
        return new Vector3(this.x / this.w, this.y / this.w, this.z / this.w);
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    norm() {
        let len = this.lengthSquared();
        if (len == 0.0)
            return new Vector4();
        else
            len = Math.sqrt(len);
        return new Vector4(this.x / len, this.y / len, this.z / len, this.w / len);
    }
    static dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w;
    }
    static normalize(v) {
        let len = v.length();
        if (len == 0.0) {
            v.reset(0.0, 0.0, 0.0, 0.0);
        }
        else {
            v.x /= len;
            v.y /= len;
            v.z /= len;
            v.w /= len;
        }
        return v;
    }
    static make(x, y, z, w) {
        return new Vector4(x, y, z, w);
    }
    static makeUnit(x, y, z, w) {
        return (new Vector4(x, y, z, w)).norm();
    }
}
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="./GTE.ts" />
class Matrix2 {
    constructor(m11, m21, m12, m22) {
        this.m11 = m11;
        this.m21 = m21;
        this.m12 = m12;
        this.m22 = m22;
    }
    static makeIdentity() {
        return new Matrix2(1, 0, 0, 1);
    }
    static makeZero() {
        return new Matrix2(0, 0, 0, 0);
    }
    static makeColMajor(m11, m21, m12, m22) {
        return new Matrix2(m11, m21, m12, m22);
    }
    static makeRowMajor(m11, m12, m21, m22) {
        return new Matrix2(m11, m21, m12, m22);
    }
    static fromRowMajorArray(v) {
        if (v.length >= 4)
            return new Matrix2(v[0], v[2], v[1], v[3]);
        return new Matrix2(0, 0, 0, 0);
    }
    static fromColMajorArray(v) {
        if (v.length >= 4)
            return new Matrix2(v[0], v[1], v[2], v[3]);
        return new Matrix2(0, 0, 0, 0);
    }
    static makeScale(x, y) {
        return Matrix2.makeRowMajor(x, 0, 0, y);
    }
    static makeRotation(angleInDegrees, x, y, z) {
        var c = Math.cos(angleInDegrees * Math.PI / 180.0);
        var s = Math.sin(angleInDegrees * Math.PI / 180.0);
        return Matrix2.makeRowMajor(c, -s, s, c);
    }
    asColMajorArray() {
        return [
            this.m11, this.m21,
            this.m12, this.m22
        ];
    }
    asRowMajorArray() {
        return [
            this.m11, this.m12,
            this.m21, this.m22
        ];
    }
    static multiply(m1, m2) {
        return new Matrix2(m1.m11 * m2.m11 + m1.m21 * m2.m12, m1.m11 * m2.m21 + m1.m21 * m2.m22, m1.m12 * m2.m11 + m1.m22 * m2.m12, m1.m12 * m2.m21 + m1.m22 * m2.m22);
    }
    copy(m) {
        this.m11 = m.m11;
        this.m21 = m.m21;
        this.m12 = m.m12;
        this.m22 = m.m22;
        return this;
    }
    concat(m) {
        this.copy(Matrix2.multiply(this, m));
        return this;
    }
    transform(v) {
        return new Vector2(this.m11 * v.x + this.m12 * v.y, this.m21 * v.x + this.m22 * v.y);
    }
    asInverse() {
        var tmpD = 1.0 / (this.m11 * this.m22 - this.m12 * this.m21);
        return Matrix2.makeRowMajor(this.m22 * tmpD, -this.m12 * tmpD, -this.m21 * tmpD, this.m11 * tmpD);
    }
    asTranspose() {
        return Matrix2.makeRowMajor(this.m11, this.m21, this.m12, this.m22);
    }
} // class Matrix2
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="./GTE.ts"/>
class Matrix3 {
    constructor(m11, m21, m31, m12, m22, m32, m13, m23, m33) {
        this.m11 = m11;
        this.m21 = m21;
        this.m31 = m31;
        this.m12 = m12;
        this.m22 = m22;
        this.m32 = m32;
        this.m13 = m13;
        this.m23 = m23;
        this.m33 = m33;
    }
    static makeIdentity() {
        return new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
    }
    static makeZero() {
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeColMajor(m11, m21, m31, m12, m22, m32, m13, m23, m33) {
        return new Matrix3(m11, m21, m31, m12, m22, m32, m13, m23, m33);
    }
    static makeRowMajor(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        return new Matrix3(m11, m21, m31, m12, m22, m32, m13, m23, m33);
    }
    static fromRowMajorArray(v) {
        if (v.length >= 9)
            return new Matrix3(v[0], v[3], v[6], v[1], v[4], v[7], v[2], v[5], v[8]);
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static fromColMajorArray(v) {
        if (v.length >= 9)
            return new Matrix3(v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[8]);
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeScale(x, y, z) {
        return Matrix3.makeRowMajor(x, 0, 0, 0, y, 0, 0, 0, z);
    }
    static makeRotation(angleInDegrees, x, y, z) {
        var c = Math.cos(angleInDegrees * Math.PI / 180.0);
        var s = Math.sin(angleInDegrees * Math.PI / 180.0);
        var invLength = 1.0 / Math.sqrt(x * x + y * y + z * z);
        x *= invLength;
        y *= invLength;
        z *= invLength;
        return Matrix3.makeRowMajor(x * x * (1 - c) + c, x * y * (1 - c) - z * s, x * z * (1 - c) + y * s, y * x * (1 - c) + z * s, y * y * (1 - c) + c, y * z * (1 - c) - x * s, x * z * (1 - c) - y * s, y * z * (1 - c) + x * s, z * z * (1 - c) + c);
    }
    static makeCubeFaceMatrix(face) {
        // +X
        if (face == 0)
            return Matrix3.makeRotation(90.0, 0.0, 1.0, 0.0);
        // -X
        if (face == 1)
            return Matrix3.makeRotation(270.0, 0.0, 1.0, 0.0);
        // +Y
        if (face == 2)
            return Matrix3.makeRotation(90.0, 1.0, 0.0, 0.0);
        // -Y
        if (face == 3)
            return Matrix3.makeRotation(270.0, 1.0, 0.0, 0.0);
        // +Z
        if (face == 4)
            return Matrix3.makeIdentity();
        // -Z
        if (face == 5)
            return Matrix3.makeRotation(180.0, 0.0, 1.0, 0.0);
        return new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    asColMajorArray() {
        return [
            this.m11, this.m21, this.m31,
            this.m12, this.m22, this.m32,
            this.m13, this.m23, this.m33
        ];
    }
    asRowMajorArray() {
        return [
            this.m11, this.m12, this.m13,
            this.m21, this.m22, this.m23,
            this.m31, this.m32, this.m33
        ];
    }
    static multiply(m1, m2) {
        return new Matrix3(m1.m11 * m2.m11 + m1.m21 * m2.m12 + m1.m31 * m2.m13, m1.m11 * m2.m21 + m1.m21 * m2.m22 + m1.m31 * m2.m23, m1.m11 * m2.m31 + m1.m21 * m2.m32 + m1.m31 * m2.m33, m1.m12 * m2.m11 + m1.m22 * m2.m12 + m1.m32 * m2.m13, m1.m12 * m2.m21 + m1.m22 * m2.m22 + m1.m32 * m2.m23, m1.m12 * m2.m31 + m1.m22 * m2.m32 + m1.m32 * m2.m33, m1.m13 * m2.m11 + m1.m23 * m2.m12 + m1.m33 * m2.m13, m1.m13 * m2.m21 + m1.m23 * m2.m22 + m1.m33 * m2.m23, m1.m13 * m2.m31 + m1.m23 * m2.m32 + m1.m33 * m2.m33);
    }
    LoadIdentity() {
        return this.copy(Matrix3.makeIdentity());
    }
    MultMatrix(m) {
        return this.copy(Matrix3.multiply(this, m));
    }
    LoadColMajor(m11, m21, m31, m12, m22, m32, m13, m23, m33) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        return this;
    }
    LoadRowMajor(m11, m12, m13, m21, m22, m23, m31, m32, m33) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        return this;
    }
    toMatrix4() {
        return Matrix4.makeRowMajor(this.m11, this.m12, this.m13, 0.0, this.m21, this.m22, this.m23, 0.0, this.m31, this.m32, this.m33, 0.0, 0.0, 0.0, 0.0, 1.0);
    }
    copy(m) {
        this.m11 = m.m11;
        this.m21 = m.m21;
        this.m31 = m.m31;
        this.m12 = m.m12;
        this.m22 = m.m22;
        this.m32 = m.m32;
        this.m13 = m.m13;
        this.m23 = m.m23;
        this.m33 = m.m33;
        return this;
    }
    clone() {
        return Matrix3.makeRowMajor(this.m11, this.m12, this.m13, this.m21, this.m22, this.m23, this.m31, this.m32, this.m33);
    }
    concat(m) {
        this.copy(Matrix3.multiply(this, m));
        return this;
    }
    transform(v) {
        return new Vector3(this.m11 * v.x + this.m12 * v.y + this.m13 * v.z, this.m21 * v.x + this.m22 * v.y + this.m23 * v.z, this.m31 * v.x + this.m32 * v.y + this.m33 * v.z);
    }
    asInverse() {
        var tmpA = this.m22 * this.m33 - this.m23 * this.m32;
        var tmpB = this.m21 * this.m32 - this.m22 * this.m31;
        var tmpC = this.m23 * this.m31 - this.m21 * this.m33;
        var tmpD = 1.0 / (this.m11 * tmpA + this.m12 * tmpC + this.m13 * tmpB);
        return new Matrix3(tmpA * tmpD, (this.m13 * this.m32 - this.m12 * this.m33) * tmpD, (this.m12 * this.m23 - this.m13 * this.m22) * tmpD, tmpC * tmpD, (this.m11 * this.m33 - this.m13 * this.m31) * tmpD, (this.m13 * this.m21 - this.m11 * this.m23) * tmpD, tmpB * tmpD, (this.m12 * this.m31 - this.m11 * this.m32) * tmpD, (this.m11 * this.m22 - this.m12 * this.m21) * tmpD);
    }
    asTranspose() {
        return new Matrix3(this.m11, this.m12, this.m13, this.m21, this.m22, this.m23, this.m31, this.m32, this.m33);
    }
} // class Matrix3
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
///<reference path="./GTE.ts"/>
class Matrix4 {
    constructor(m11 = 1, m21 = 0, m31 = 0, m41 = 0, m12 = 0, m22 = 1, m32 = 0, m42 = 0, m13 = 0, m23 = 0, m33 = 0, m43 = 0, m14 = 0, m24 = 0, m34 = 1, m44 = 1) {
        this.m11 = m11;
        this.m21 = m21;
        this.m31 = m31;
        this.m41 = m41;
        this.m12 = m12;
        this.m22 = m22;
        this.m32 = m32;
        this.m42 = m42;
        this.m13 = m13;
        this.m23 = m23;
        this.m33 = m33;
        this.m43 = m43;
        this.m14 = m14;
        this.m24 = m24;
        this.m34 = m34;
        this.m44 = m44;
    }
    copy(m) {
        return this.LoadMatrix(m);
    }
    clone() {
        return new Matrix4(this.m11, this.m21, this.m31, this.m41, this.m12, this.m22, this.m32, this.m42, this.m13, this.m23, this.m33, this.m43, this.m14, this.m24, this.m34, this.m44);
    }
    row(i) {
        switch (i) {
            case 0: return new Vector4(this.m11, this.m12, this.m13, this.m14);
            case 1: return new Vector4(this.m21, this.m22, this.m23, this.m24);
            case 2: return new Vector4(this.m31, this.m32, this.m33, this.m34);
            case 3: return new Vector4(this.m41, this.m42, this.m43, this.m44);
        }
        return new Vector4(0, 0, 0, 0);
    }
    col(i) {
        switch (i) {
            case 0: return new Vector4(this.m11, this.m21, this.m31, this.m41);
            case 1: return new Vector4(this.m12, this.m22, this.m32, this.m42);
            case 2: return new Vector4(this.m13, this.m23, this.m33, this.m43);
            case 3: return new Vector4(this.m14, this.m24, this.m34, this.m44);
        }
        return new Vector4(0, 0, 0, 0);
    }
    row3(i) {
        switch (i) {
            case 0: return new Vector3(this.m11, this.m12, this.m13);
            case 1: return new Vector3(this.m21, this.m22, this.m23);
            case 2: return new Vector3(this.m31, this.m32, this.m33);
            case 3: return new Vector3(this.m41, this.m42, this.m43);
        }
        return new Vector3(0, 0, 0);
    }
    col3(i) {
        switch (i) {
            case 0: return new Vector3(this.m11, this.m21, this.m31);
            case 1: return new Vector3(this.m12, this.m22, this.m32);
            case 2: return new Vector3(this.m13, this.m23, this.m33);
            case 3: return new Vector3(this.m14, this.m24, this.m34);
        }
        return new Vector3(0, 0, 0);
    }
    diag3() {
        return new Vector3(this.m11, this.m22, this.m33);
    }
    LoadRowMajor(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m14 = m14;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m24 = m24;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        this.m34 = m34;
        this.m41 = m41;
        this.m42 = m42;
        this.m43 = m43;
        this.m44 = m44;
        return this;
    }
    LoadColMajor(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44) {
        this.m11 = m11;
        this.m12 = m12;
        this.m13 = m13;
        this.m14 = m14;
        this.m21 = m21;
        this.m22 = m22;
        this.m23 = m23;
        this.m24 = m24;
        this.m31 = m31;
        this.m32 = m32;
        this.m33 = m33;
        this.m34 = m34;
        this.m41 = m41;
        this.m42 = m42;
        this.m43 = m43;
        this.m44 = m44;
        return this;
    }
    LoadIdentity() {
        return this.LoadMatrix(Matrix4.makeIdentity());
    }
    Translate(x, y, z) {
        return this.MultMatrix(Matrix4.makeTranslation(x, y, z));
    }
    Rotate(angleInDegrees, x, y, z) {
        return this.MultMatrix(Matrix4.makeRotation(angleInDegrees, x, y, z));
    }
    Scale(sx, sy, sz) {
        return this.MultMatrix(Matrix4.makeScale(sx, sy, sz));
    }
    LookAt(eye, center, up) {
        return this.MultMatrix(Matrix4.makeLookAt2(eye, center, up));
    }
    Frustum(left, right, bottom, top, near, far) {
        return this.MultMatrix(Matrix4.makeFrustum(left, right, bottom, top, near, far));
    }
    Ortho(left, right, bottom, top, near, far) {
        return this.MultMatrix(Matrix4.makeOrtho(left, right, bottom, top, near, far));
    }
    Ortho2D(left, right, bottom, top) {
        return this.MultMatrix(Matrix4.makeOrtho2D(left, right, bottom, top));
    }
    PerspectiveX(fovx, aspect, near, far) {
        return this.MultMatrix(Matrix4.makePerspectiveX(fovx, aspect, near, far));
    }
    PerspectiveY(fovy, aspect, near, far) {
        return this.MultMatrix(Matrix4.makePerspectiveY(fovy, aspect, near, far));
    }
    ShadowBias() {
        return this.MultMatrix(Matrix4.makeShadowBias());
    }
    CubeFaceMatrix(face) {
        return this.MultMatrix(Matrix4.makeCubeFaceMatrix(face));
    }
    static makeIdentity() {
        return new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    }
    static makeZero() {
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeColMajor(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44) {
        return new Matrix4(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44);
    }
    static makeRowMajor(m11, m12, m13, m14, m21, m22, m23, m24, m31, m32, m33, m34, m41, m42, m43, m44) {
        return new Matrix4(m11, m21, m31, m41, m12, m22, m32, m42, m13, m23, m33, m43, m14, m24, m34, m44);
    }
    static fromRowMajorArray(v) {
        if (v.length >= 16)
            return new Matrix4(v[0], v[4], v[8], v[12], v[1], v[5], v[9], v[13], v[2], v[6], v[10], v[14], v[3], v[7], v[11], v[15]);
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static fromColMajorArray(v) {
        if (v.length >= 16)
            return new Matrix4(v[0], v[1], v[2], v[3], v[4], v[5], v[6], v[7], v[8], v[9], v[10], v[11], v[12], v[13], v[14], v[15]);
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    static makeTranslation(x, y, z) {
        return Matrix4.makeRowMajor(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
    }
    static makeScale(x, y, z) {
        return Matrix4.makeRowMajor(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
    }
    static makeRotation(angleInDegrees, x, y, z) {
        var c = Math.cos(angleInDegrees * Math.PI / 180.0);
        var s = Math.sin(angleInDegrees * Math.PI / 180.0);
        var invLength = 1.0 / Math.sqrt(x * x + y * y + z * z);
        x *= invLength;
        y *= invLength;
        z *= invLength;
        return Matrix4.makeRowMajor(x * x * (1 - c) + c, x * y * (1 - c) - z * s, x * z * (1 - c) + y * s, 0.0, y * x * (1 - c) + z * s, y * y * (1 - c) + c, y * z * (1 - c) - x * s, 0.0, x * z * (1 - c) - y * s, y * z * (1 - c) + x * s, z * z * (1 - c) + c, 0.0, 0.0, 0.0, 0.0, 1.0);
    }
    static makeOrtho(left, right, bottom, top, near, far) {
        var tx = -(right + left) / (right - left);
        var ty = -(top + bottom) / (top - bottom);
        var tz = -(far + near) / (far - near);
        return Matrix4.makeRowMajor(2 / (right - left), 0, 0, tx, 0, 2 / (top - bottom), 0, ty, 0, 0, -2 / (far - near), tz, 0, 0, 0, 1);
    }
    static makeOrtho2D(left, right, bottom, top) {
        return Matrix4.makeOrtho(left, right, bottom, top, -1, 1);
    }
    static makeFrustum(left, right, bottom, top, near, far) {
        var A = (right + left) / (right - left);
        var B = (top + bottom) / (top - bottom);
        var C = -(far + near) / (far - near);
        var D = -2 * far * near / (far - near);
        return Matrix4.makeRowMajor(2 * near / (right - left), 0, A, 0, 0, 2 * near / (top - bottom), B, 0, 0, 0, C, D, 0, 0, -1, 0);
    }
    static makePerspectiveY(fovy, aspect, near, far) {
        let f = 1.0 / Math.tan(Math.PI * fovy / 360.0);
        return Matrix4.makeRowMajor(f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), 2 * far * near / (near - far), 0, 0, -1, 0);
    }
    static makePerspectiveX(fovx, aspect, near, far) {
        var f = 1.0 / Math.tan(Math.PI * fovx / 360.0);
        return Matrix4.makeRowMajor(f, 0, 0, 0, 0, f * aspect, 0, 0, 0, 0, (far + near) / (near - far), 2 * far * near / (near - far), 0, 0, -1, 0);
    }
    static makeLookAt(eye, center, up) {
        let F = Vector3.sub(center, eye).norm();
        let UP = up.norm();
        let S = (Vector3.cross(F, UP)).norm();
        let U = (Vector3.cross(S, F)).norm();
        return Matrix4.multiply(Matrix4.makeRowMajor(S.x, S.y, S.z, 0, U.x, U.y, U.z, 0, -F.x, -F.y, -F.z, 0, 0, 0, 0, 1), Matrix4.makeTranslation(-eye.x, -eye.y, -eye.z));
    }
    static makeLookAt2(eye, center, up) {
        let F = Vector3.sub(center, eye).norm();
        let UP = up.norm();
        let S = (Vector3.cross(F, UP)).norm();
        let U = (Vector3.cross(S, F)).norm();
        return Matrix4.multiply(Matrix4.makeTranslation(-eye.x, -eye.y, -eye.z), Matrix4.makeRowMajor(S.x, S.y, S.z, 0, U.x, U.y, U.z, 0, -F.x, -F.y, -F.z, 0, 0, 0, 0, 1));
    }
    static makeShadowBias() {
        return Matrix4.makeRowMajor(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
    }
    static makeCubeFaceMatrix(face) {
        // +X
        if (face == 0)
            return Matrix4.makeRotation(90.0, 0.0, 1.0, 0.0);
        // -X
        if (face == 1)
            return Matrix4.makeRotation(270.0, 0.0, 1.0, 0.0);
        // +Y
        if (face == 2)
            return Matrix4.makeRotation(90.0, 1.0, 0.0, 0.0);
        // -Y
        if (face == 3)
            return Matrix4.makeRotation(270.0, 1.0, 0.0, 0.0);
        // +Z
        if (face == 4)
            return Matrix4.makeIdentity();
        // -Z
        if (face == 5)
            return Matrix4.makeRotation(180.0, 0.0, 1.0, 0.0);
        return new Matrix4(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
    toColMajorArray() {
        return [
            this.m11, this.m21, this.m31, this.m41,
            this.m12, this.m22, this.m32, this.m42,
            this.m13, this.m23, this.m33, this.m43,
            this.m14, this.m24, this.m34, this.m44
        ];
    }
    toRowMajorArray() {
        return [
            this.m11, this.m12, this.m13, this.m14,
            this.m21, this.m22, this.m23, this.m24,
            this.m31, this.m32, this.m33, this.m34,
            this.m41, this.m42, this.m43, this.m44
        ];
    }
    static multiply3(a, b, c) {
        return Matrix4.multiply(a, Matrix4.multiply(b, c));
    }
    static multiply(m1, m2) {
        return new Matrix4(m1.m11 * m2.m11 + m1.m21 * m2.m12 + m1.m31 * m2.m13 + m1.m41 * m2.m14, m1.m11 * m2.m21 + m1.m21 * m2.m22 + m1.m31 * m2.m23 + m1.m41 * m2.m24, m1.m11 * m2.m31 + m1.m21 * m2.m32 + m1.m31 * m2.m33 + m1.m41 * m2.m34, m1.m11 * m2.m41 + m1.m21 * m2.m42 + m1.m31 * m2.m43 + m1.m41 * m2.m44, m1.m12 * m2.m11 + m1.m22 * m2.m12 + m1.m32 * m2.m13 + m1.m42 * m2.m14, m1.m12 * m2.m21 + m1.m22 * m2.m22 + m1.m32 * m2.m23 + m1.m42 * m2.m24, m1.m12 * m2.m31 + m1.m22 * m2.m32 + m1.m32 * m2.m33 + m1.m42 * m2.m34, m1.m12 * m2.m41 + m1.m22 * m2.m42 + m1.m32 * m2.m43 + m1.m42 * m2.m44, m1.m13 * m2.m11 + m1.m23 * m2.m12 + m1.m33 * m2.m13 + m1.m43 * m2.m14, m1.m13 * m2.m21 + m1.m23 * m2.m22 + m1.m33 * m2.m23 + m1.m43 * m2.m24, m1.m13 * m2.m31 + m1.m23 * m2.m32 + m1.m33 * m2.m33 + m1.m43 * m2.m34, m1.m13 * m2.m41 + m1.m23 * m2.m42 + m1.m33 * m2.m43 + m1.m43 * m2.m44, m1.m14 * m2.m11 + m1.m24 * m2.m12 + m1.m34 * m2.m13 + m1.m44 * m2.m14, m1.m14 * m2.m21 + m1.m24 * m2.m22 + m1.m34 * m2.m23 + m1.m44 * m2.m24, m1.m14 * m2.m31 + m1.m24 * m2.m32 + m1.m34 * m2.m33 + m1.m44 * m2.m34, m1.m14 * m2.m41 + m1.m24 * m2.m42 + m1.m34 * m2.m43 + m1.m44 * m2.m44);
    }
    LoadMatrix(m) {
        this.m11 = m.m11;
        this.m21 = m.m21;
        this.m31 = m.m31;
        this.m41 = m.m41;
        this.m12 = m.m12;
        this.m22 = m.m22;
        this.m32 = m.m32;
        this.m42 = m.m42;
        this.m13 = m.m13;
        this.m23 = m.m23;
        this.m33 = m.m33;
        this.m43 = m.m43;
        this.m14 = m.m14;
        this.m24 = m.m24;
        this.m34 = m.m34;
        this.m44 = m.m44;
        return this;
    }
    MultMatrix(m) {
        this.LoadMatrix(Matrix4.multiply(this, m));
        return this;
    }
    transform(v) {
        return new Vector4(this.m11 * v.x + this.m12 * v.y + this.m13 * v.z + this.m14 * v.w, this.m21 * v.x + this.m22 * v.y + this.m23 * v.z + this.m24 * v.w, this.m31 * v.x + this.m32 * v.y + this.m33 * v.z + this.m34 * v.w, this.m41 * v.x + this.m42 * v.y + this.m43 * v.z + this.m44 * v.w);
    }
    asInverse() {
        var tmp1 = this.m32 * this.m43 - this.m33 * this.m42;
        var tmp2 = this.m32 * this.m44 - this.m34 * this.m42;
        var tmp3 = this.m33 * this.m44 - this.m34 * this.m43;
        var tmp4 = this.m22 * tmp3 - this.m23 * tmp2 + this.m24 * tmp1;
        var tmp5 = this.m31 * this.m42 - this.m32 * this.m41;
        var tmp6 = this.m31 * this.m43 - this.m33 * this.m41;
        var tmp7 = -this.m21 * tmp1 + this.m22 * tmp6 - this.m23 * tmp5;
        var tmp8 = this.m31 * this.m44 - this.m34 * this.m41;
        var tmp9 = this.m21 * tmp2 - this.m22 * tmp8 + this.m24 * tmp5;
        var tmp10 = -this.m21 * tmp3 + this.m23 * tmp8 - this.m24 * tmp6;
        var tmp11 = 1 / (this.m11 * tmp4 + this.m12 * tmp10 + this.m13 * tmp9 + this.m14 * tmp7);
        var tmp12 = this.m22 * this.m43 - this.m23 * this.m42;
        var tmp13 = this.m22 * this.m44 - this.m24 * this.m42;
        var tmp14 = this.m23 * this.m44 - this.m24 * this.m43;
        var tmp15 = this.m22 * this.m33 - this.m23 * this.m32;
        var tmp16 = this.m22 * this.m34 - this.m24 * this.m32;
        var tmp17 = this.m23 * this.m34 - this.m24 * this.m33;
        var tmp18 = this.m21 * this.m43 - this.m23 * this.m41;
        var tmp19 = this.m21 * this.m44 - this.m24 * this.m41;
        var tmp20 = this.m21 * this.m33 - this.m23 * this.m31;
        var tmp21 = this.m21 * this.m34 - this.m24 * this.m31;
        var tmp22 = this.m21 * this.m42 - this.m22 * this.m41;
        var tmp23 = this.m21 * this.m32 - this.m22 * this.m31;
        return new Matrix4(tmp4 * tmp11, (-this.m12 * tmp3 + this.m13 * tmp2 - this.m14 * tmp1) * tmp11, (this.m12 * tmp14 - this.m13 * tmp13 + this.m14 * tmp12) * tmp11, (-this.m12 * tmp17 + this.m13 * tmp16 - this.m14 * tmp15) * tmp11, tmp10 * tmp11, (this.m11 * tmp3 - this.m13 * tmp8 + this.m14 * tmp6) * tmp11, (-this.m11 * tmp14 + this.m13 * tmp19 - this.m14 * tmp18) * tmp11, (this.m11 * tmp17 - this.m13 * tmp21 + this.m14 * tmp20) * tmp11, tmp9 * tmp11, (-this.m11 * tmp2 + this.m12 * tmp8 - this.m14 * tmp5) * tmp11, (this.m11 * tmp13 - this.m12 * tmp19 + this.m14 * tmp22) * tmp11, (-this.m11 * tmp16 + this.m12 * tmp21 - this.m14 * tmp23) * tmp11, tmp7 * tmp11, (this.m11 * tmp1 - this.m12 * tmp6 + this.m13 * tmp5) * tmp11, (-this.m11 * tmp12 + this.m12 * tmp18 - this.m13 * tmp22) * tmp11, (this.m11 * tmp15 - this.m12 * tmp20 + this.m13 * tmp23) * tmp11);
    }
    asTranspose() {
        return new Matrix4(this.m11, this.m12, this.m13, this.m14, this.m21, this.m22, this.m23, this.m24, this.m31, this.m32, this.m33, this.m34, this.m41, this.m42, this.m43, this.m44);
    }
} // class Matrix4
// Fluxions WebGL Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
/// <reference path="./Vector2.ts" />
/// <reference path="./Vector3.ts" />
/// <reference path="./Vector4.ts" />
/// <reference path="./Matrix2.ts" />
/// <reference path="./Matrix3.ts" />
/// <reference path="./Matrix4.ts" />
var GTE;
(function (GTE) {
    function clamp(x, a, b) {
        return x < a ? a : x > b ? b : x;
    }
    GTE.clamp = clamp;
    // 0 <= mix <= 1
    function lerp(a, b, mix) {
        return mix * a + (1 - mix) * b;
    }
    GTE.lerp = lerp;
    function distancePointLine2(point, linePoint1, linePoint2) {
        let v = linePoint2.sub(linePoint1);
        let d = v.length();
        let n = Math.abs(v.y * point.x - v.x * point.y + linePoint2.x * linePoint1.y - linePoint2.y * linePoint1.x);
        if (d != 0.0)
            return n / d;
        return 1e30;
    }
    GTE.distancePointLine2 = distancePointLine2;
    function gaussian(x, center, sigma) {
        let t = (x - center) / sigma;
        return 1 / (sigma * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * t * t);
        //return 1 / (Math.sqrt(2.0 * sigma * sigma * Math.PI)) * Math.exp(-Math.pow(x - center, 2) / (2 * sigma * sigma));
    }
    GTE.gaussian = gaussian;
    function min3(a, b, c) {
        return Math.min(Math.min(a, b), c);
    }
    GTE.min3 = min3;
    function max3(a, b, c) {
        return Math.max(Math.max(a, b), c);
    }
    GTE.max3 = max3;
})(GTE || (GTE = {}));
//# sourceMappingURL=library.js.map