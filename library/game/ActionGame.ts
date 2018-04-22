/// <reference path="./Common.ts" />

class ActionGame {
    sprites: [number, number][];

    camels: Sprite[] = new Array(MAX_CAMELS);
    player: Sprite = new Sprite(PLAYER);
    enemies: Sprite[] = new Array(MAX_ENEMIES);
    kibbles: Sprite[] = new Array(MAX_KIBBLES);
    terrain: Sprite[] = new Array(MAX_TERRAIN);
    missiles: Sprite[] = new Array(MAX_MISSILES);

    lastKibble: Vector3 = Vector3.make(0, 0, 0);

    animframe: number = 0;
    numCamels: number = 0;
    numEnemies: number = 0;
    score: number = 0;

    camelLocation: Vector3 = Vector3.make(64, 256, 0);
    playerLocation: Vector3 = Vector3.make(64, 256, 0);
    readonly playerField: Vector2 = Vector2.make(64, 192);

    constructor(public XOR: LibXOR) {
        this.init();
    }

    init() {
        this.score = 0;
        this.numCamels = 0;
        this.numEnemies = 0;
        this.animframe = 0;
        
        this.sprites = CreateSprites();

        this.player = new Sprite(this.sprites[PLAYER][0]);
        this.player.position.reset(64 + GTE.rand1() * this.playerField.x,
            this.XOR.height / 2 + GTE.rand1() * this.playerField.y);

        for (let i = 0; i < MAX_CAMELS; i++) {
            this.camels[i] = new Sprite(0);
            this.camels[i].alive = GTE.random(1, 5) | 0;
            this.numCamels++;
            this.camels[i].position.x = this.camelLocation.x + GTE.random(-32, 32);
            this.camels[i].position.y = this.camelLocation.y + GTE.random(-128, 128);
        }

        for (let i = 0; i < MAX_ENEMIES; i++) {
            this.enemies[i] = new Sprite(0);
            this.enemies[i].type = GTE.random(ENEMY_START, ENEMY_END) | 0;
            this.enemies[i].alive = 0;
            this.enemies[i].position.x = GTE.random(this.XOR.width, 2 * this.XOR.width);
            this.enemies[i].position.y = GTE.random(0, this.XOR.height - 32);
            this.numEnemies++;
        }

        for (let i = 0; i < MAX_KIBBLES; i++) {
            this.kibbles[i] = new Sprite(31);
        }

        for (let i = 0; i < MAX_MISSILES; i++) {
            this.missiles[i] = new Sprite(20);
            this.missiles[i].alive = 0;
            this.missiles[i].velocity.reset(PLAYER_SPEED * 4, 0);
        }
    }

    get lost(): boolean {
        if (this.player.alive <= 0) return true;
        if (this.numCamels <= 0) return true;
        return false;
    }

    get won(): boolean {
        if (this.player.alive <= 0) return false;
        if (this.numCamels <= 0) return false;
        if (this.numEnemies > 0) return false;
        return true;
    }

    startKibbles(x: number, y: number) {
        this.lastKibble.x = x;
        this.lastKibble.y = y;
        for (let num = 0; num < KIBBLES_PER_EXPLOSION; num++) {
            let i = (GTE.rand01() * MAX_KIBBLES) | 0;
            this.kibbles[i].alive = 1;
            this.kibbles[i].position.reset(x, y);
            this.kibbles[i].refpoint.reset(x, y);
            this.kibbles[i].velocity.reset(GTE.random(-KIBBLE_SPEED / 2, KIBBLE_SPEED / 2), -GTE.random(KIBBLE_SPEED, KIBBLE_SPEED * 2));
            this.kibbles[i].timealive = this.XOR.t1;
        }
    }

    startMissile(x: number, y: number, dir: Vector2) {
        let alive = this.XOR.t1;
        let best = 0;
        for (let i = 0; i < this.missiles.length; i++) {
            let missile = this.missiles[i];
            if (missile.alive <= 0) {
                best = i;
                break;
            }
            if (alive > missile.timealive) {
                best = i;
                alive = missile.timealive;
            }
        }
        let missile = this.missiles[best];
        missile.position.reset(x, y);
        let v = dir.norm().mul(MISSILE_SPEED);
        missile.velocity.reset(v.x, v.y);
        missile.alive = 1;
    }

    update() {
        let t1 = this.XOR.t1 * 3.14159;
        this.animframe = Math.sin(t1) > 0.0 ? 1 : 0;
        this.updateCamels(t1);
        this.updateEnemies(t1);
        this.updatePlayer(t1);
        this.updateKibbles(t1);
        this.updateMissiles(t1);
    }

    updatePlayer(t1: number) {
        let dx = this.XOR.Input.getkey2(KEY_LEFT, KEY_RIGHT);
        let dy = this.XOR.Input.getkey2(KEY_UP, KEY_DOWN);
        let dir = Vector2.makeUnit(dx, dy);

        this.player.velocity.x = dir.x;
        this.player.velocity.y = dir.y;
        this.player.velocity = this.player.velocity.norm().mul(PLAYER_SPEED * this.XOR.dt);
        this.player.position = this.player.position.add(this.player.velocity);

        for (let i = 0; i < this.enemies.length; i++) {
            let enemy = this.enemies[i];
            if (this.player.collides(enemy, 32)) {
                this.startKibbles(this.player.x, this.player.y);
                this.player.alive--;                
                this.player.position.x = this.XOR.width / 4 + GTE.rand1() * this.playerField.x;
                this.player.position.y = this.XOR.height / 2 + GTE.rand1() * this.playerField.y;
            }
        }

        let XOR = this.XOR;
        if (XOR.Timers.ended("PLAYERSHOOT")) {
            if (XOR.Input.getkey(KEY_START) || XOR.Input.getkey(KEY_SELECT)) {
                XOR.Timers.start("PLAYERSHOOT", 0.1);
                XOR.Sounds.playSound("SNARE");
                this.startMissile(this.player.x, this.player.y, Vector2.make(1, 0));
            }
        }
    }

    updateCamels(t1: number) {
        for (let i = 0; i < MAX_CAMELS; i++) {
            let camel = this.camels[i];
            if (this.camels[i].alive > 0) {
                let type = NORMALCAMEL;
                if (this.camels[i].alive == 1) type = THINCAMEL;
                if (this.camels[i].alive == 2) type = NORMALCAMEL;
                if (this.camels[i].alive >= 3) type = FATCAMEL;
                let animframe = Math.sin(this.camels[i].random + t1) > 0 ? 1 : 0;
                this.camels[i].index = this.sprites[type][animframe];
                this.camels[i].offset.x = GTE.oscillateBetween(t1, this.camels[i].random, i, -2.0, 2.0);
                this.camels[i].offset.y = GTE.oscillateBetween(t1, 2 * this.camels[i].random, i, -2.0, 2.0);

                for (let j = 0; j < MAX_ENEMIES; j++) {
                    let enemy = this.enemies[j];
                    if (enemy.alive <= 0) continue;
                    if (enemy.collides(camel, 24)) {
                        camel.alive--;
                        if (camel.alive <= 0) {
                            this.numCamels--;
                            this.startKibbles(camel.x, camel.y);
                        }
                        enemy.alive--;
                        if (enemy.alive <= 0) {
                            this.startKibbles(enemy.x, enemy.y);
                        }
                    }
                }
            }
        }
    }

    updateEnemies(t1: number) {
        for (let i = 0; i < MAX_ENEMIES; i++) {
            let enemy = this.enemies[i];
            if (enemy.position.x < -32) {
                enemy.alive = 0;
            }
            if (enemy.alive > 0) {
                let random = enemy.random
                let type = enemy.type;
                let animframe = Math.sin(random + t1) > 0 ? 1 : 0;
                enemy.index = this.sprites[type][animframe];
                enemy.offset.x = GTE.oscillateBetween(t1, random, i, -2.0, 2.0);
                enemy.offset.y = GTE.oscillateBetween(t1, 2 * random, i, -2.0, 2.0);
                enemy.position = enemy.position.add(enemy.velocity.mul(this.XOR.dt));
            } else {
                enemy.alive = 1;
                enemy.position.x = GTE.random(this.XOR.width, 2 * this.XOR.width);
                enemy.position.y = GTE.random(0, this.XOR.height - 32);
                let randomEnemySpeed = GTE.random(ENEMY_SPEED, 2 * ENEMY_SPEED);
                enemy.velocity.x = -randomEnemySpeed;
                enemy.velocity.y = GTE.random(-2, 2);
                if (GTE.rand01() < 0.5) {
                    let randomCamelIndex = GTE.random(0, this.camels.length) | 0;
                    let camel = this.camels[randomCamelIndex];
                    enemy.velocity = enemy.dirto(camel).norm().mul(ENEMY_SPEED);
                }
            }

            for (let j = i + 1; j < MAX_ENEMIES; j++) {
                if (i == j) continue;
                let dirto = enemy.dirto(this.enemies[j]);
                if (dirto.length() < 32) {
                    let ndirto = dirto.norm().mul(16.5);
                    let middle = enemy.position.add(this.enemies[j].position).mul(0.5);
                    enemy.position = middle.add(ndirto);
                    this.enemies[j].position = middle.sub(ndirto);
                }
            }
        }
    }

    updateKibbles(t1: number) {
        for (let i = 0; i < MAX_KIBBLES; i++) {
            let k = this.kibbles[i];
            if (k.position.y > k.refpoint.y + 4) {
                k.alive = 0;
            }
            if (k.alive) {
                k.velocity.y += KIBBLE_GRAVITY * 9.8 * this.XOR.dt;
                k.position.x += k.velocity.x * this.XOR.dt;
                k.position.y += k.velocity.y * this.XOR.dt;
            }
        }
    }

    updateMissiles(t1: number) {
        for (let i = 0; i < this.missiles.length; i++) {
            let missile = this.missiles[i];
            if (missile.x > this.XOR.width * 1.5) {
                missile.alive = 0;
            }
            if (missile.alive > 0) {
                missile.move(this.XOR.dt);
                missile.offset.y = GTE.oscillate(missile.random + t1, 1, 0, 3, 0);
                for (let j = 0; j < this.enemies.length; j++) {
                    let enemy = this.enemies[j];
                    if (enemy.alive && enemy.collides(missile, 16)) {
                        this.numEnemies--;
                        missile.alive = 0;
                        enemy.alive = 0;
                        this.score += 100;
                        this.startKibbles(enemy.x, enemy.y);
                    }
                }
            }
        }
    }

    draw(g: GraphicsComponent) {
        for (let i = 0; i < MAX_CAMELS; i++) {
            if (this.camels[i].alive > 0) {
                g.drawSprite(this.camels[i].index,
                    this.camels[i].position.x + this.camels[i].offset.x,
                    this.camels[i].position.y + this.camels[i].offset.y);
            }
        }

        for (let i = 0; i < MAX_ENEMIES; i++) {
            if (this.enemies[i].alive) {
                g.drawSprite(this.enemies[i].index,
                    this.enemies[i].position.x + this.enemies[i].offset.x,
                    this.enemies[i].position.y + this.enemies[i].offset.y);
            }
        }

        g.drawSprite(this.player.index,
            this.player.position.x + this.player.offset.x,
            this.player.position.y + this.player.offset.y);

        for (let i = 0; i < MAX_MISSILES; i++) {
            let missile = this.missiles[i];
            if (missile.alive) {
                g.drawSprite(missile.index, missile.x, missile.y);
            }
        }


        for (let i = 0; i < MAX_KIBBLES; i++) {
            let k = this.kibbles[i];
            if (k.alive) {
                //g.drawSprite(this.kibbles[i].index, this.kibbles[i].position.x, this.kibbles[i].position.y);
                g.drawBox(k.position.x, k.position.y, 'black');
            }
        }
    }

    draw2doverlay(g: GraphicsComponent) {
        g.putTextAligned("Camels: " + this.numCamels, 'white', 1, -1, 0, 0);
        g.putTextAligned("Enemies: " + this.numEnemies, 'white', -1, 1, 0, 0);
        g.putTextAligned("Score " + this.score, 'white', 0, -1, 0, 0);
        g.putTextAligned("Lives: " + this.player.alive, 'white', 1, 1, 0, 0);
    }
}
