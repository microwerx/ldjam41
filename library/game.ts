/// <reference path="./gte/GTE.ts" />
/// <reference path="./libxor/LibXOR.ts" />
/// <reference path="./libxor/State.ts" />

class Game {
    XOR: LibXOR;

    series: string = "#LDJAM 41";
    title: string = "UNKNOWN GAME";
    author: string = "by microwerx";

    askToQuit: boolean = false;
    gameover: boolean = true;
    gamelevel: number = 1;
    score: number = 0;
    states: StateMachine = new StateMachine();

    constructor() {
        this.XOR = new LibXOR(640, 512);
        this.gameover = true;
        this.gamelevel = 1;
        this.score = 0;
        document.title = this.series + " " + this.title + " " + this.author;
        let e;
        if (e = document.getElementById("headerSeries")) {
            e.innerHTML = this.series;
        }
        if (e = document.getElementById("headerTitle")) {
            e.innerHTML = this.title;
        }
        if (e = document.getElementById("headerAuthor")) {
            e.innerHTML = this.author;
        }
    }


    focus() {
        this.XOR.Graphics.focus();
    }


    run() {
        this.load();
        this.mainloop(0);
    }


    mainloop(t: number) {
        let self = this;

        this.update(t);
        this.display();

        window.requestAnimationFrame((t) => {
            self.mainloop(t / 1000.0);
        });
    }


    load() {
        let XOR = this.XOR;
        let g = XOR.Graphics;
        g.loadSprites("assets/images/sprites.png?" + Date.now());

        XOR.Sounds.queueSound('hihat', 'assets/sounds/E12HIHAT.wav');
        XOR.Sounds.queueSound('kick', 'assets/sounds/E12KICK.wav');
        XOR.Sounds.queueSound('kickaccent', 'assets/sounds/E12KICKACCENT.wav');
        XOR.Sounds.queueSound('rimshot', 'assets/sounds/E12RIMSHOT.wav');
        XOR.Sounds.queueSound('snare', 'assets/sounds/E12SNARE.wav');

        g.resizeTiles(64, 64, 4);

        if (XOR.Scenegraph) {
            let sg = XOR.Scenegraph;
            sg.AddRenderConfig("default", "assets/shaders/default.vert", "assets/shaders/default.frag");
            sg.Load("assets/test.scn");
        }

        this.states.push("MAINMENU", "", 0);
        this.states.push("MAINMENU", "PAUSE", 0.25);
    }


    changelevel(which: number) {
        let XOR = this.XOR;
        let g = this.XOR.Graphics;

        if (which == 1) {
            XOR.Music.play(0);
        }
        this.gamelevel = which;
        this.states.push("MAINMENU", "", 0);
        this.states.push("GAMEMODE", "", 0);
        this.states.push("GO", "PAUSE", 6);
        this.states.push("SET", "PAUSE", 4);
        this.states.push("READY", "PAUSE", 2);
    }

    statePause(): boolean {
        if (this.states.topAlt == "PAUSE")
            return true;
        return false;
    }

    stateMainMenu(): boolean {
        let XOR = this.XOR;
        if (this.states.topName == "MAINMENU") {
            XOR.Music.fadeOut(0, 0.95);
            if (XOR.Input.getkey(KEY_START)) {
                this.changelevel(1);
            }
            return true;
        } else {
            XOR.Music.fadeIn(0, 0.05);
        }
        return false;
    }

    checkGameModeAskToQuit(): boolean {
        let XOR = this.XOR;
        if (this.states.topName == "GAMEMODE") {
            if (XOR.Input.getkey(KEY_BACK)) {
                this.states.push("ASKTOQUIT", "", 0);
                this.states.push("ASKTOQUIT", "PAUSE", 0.5);
                return true;
            }
        }
        return false;
    }

    stateAskToQuit(): boolean {
        let XOR = this.XOR;
        if (this.states.topName == "ASKTOQUIT") {
            if (XOR.Input.getkey(KEY_BACK)) {
                this.states.pop();  // pop ASKTOQUIT
                this.states.push("PAUSE", "PAUSE", 0.25);
                return true;
            }
            if (XOR.Input.getkey(KEY_START)) {
                this.states.pop();  // pop ASKTOQUIT
                this.states.pop();  // pop GAMEMODE
                this.states.push("MAINMENU", "PAUSE", 0.25);
                return true;
            }
        }
        return false;
    }

    getTimeredKey(key: number, delay: number = 1 / 15) {
        let result = false;
        let timerName = "tk" + key;
        if (this.XOR.Timers.ended(timerName)) {
            if (this.XOR.Input.getkey(key)) {
                result = true;
                this.XOR.Timers.start(timerName, delay);
            }
        }
        return result;
    }

    update(tInSeconds: number) {
        let XOR = this.XOR;
        let g = this.XOR.Graphics;

        this.states.update(tInSeconds);
        XOR.update(tInSeconds);

        if (this.XOR.Scenegraph) {
            let sg = this.XOR.Scenegraph;
            let b1 = sg.GetNode("test.scn", "bunny");
            let b2 = sg.GetNode("test.scn", "bunny2");
            b1.geometryGroup = "bunny.obj";
            b2.geometryGroup = "bunny.obj";

            let mouse = XOR.Input.lastClick;
            b1.posttransform = Matrix4.makeTranslation(mouse.x / 320 - 1, -mouse.y / 256 + 1 + GTE.oscillateBetween(XOR.t1, 0.5, 0.0, -0.5, 0.5), 0.0);
            let dirto = b2.dirto(b1).norm().mul(0.1 * XOR.dt);
            b2.posttransform.Translate(dirto.x, dirto.y, dirto.z);

            let d = sg.GetNode("test.scn", "dragon");
            dirto = XOR.Input.gamepadStick1.mul(XOR.dt);
            d.posttransform.Translate(dirto.x, -dirto.y, dirto.z);
        }


        if (this.statePause()) return;
        if (this.stateMainMenu()) return;
        if (this.stateAskToQuit()) return;
        if (this.checkGameModeAskToQuit()) return;

        XOR.Music.setVolume(1, (1.0 - XOR.Music.getVolume(0)) * 0.25 + 0.15);
        if (XOR.Music.ended(0)) XOR.Music.play(0);
        if (XOR.Music.ended(1)) XOR.Music.play(1);

        if (this.getTimeredKey(KEY_RIGHT)) {
            XOR.Sounds.playSound('snare')
        }
        if (this.getTimeredKey(KEY_LEFT)) {
            XOR.Sounds.playSound('kick')
        }
        if (this.getTimeredKey(KEY_UP)) {
            XOR.Sounds.playSound('rimshot')
        }
        if (this.getTimeredKey(KEY_RIGHT)) {
            XOR.Sounds.playSound('kickaccent')
        }

    }


    display() {
        let XOR = this.XOR;
        let g = XOR.Graphics;
        g.setFont("Salsbury,EssentialPragmataPro,consolas,fixed", 32);

        let assetsLoaded = 1;
        if (!XOR.Scenegraph.loaded || !g.spritesLoaded) {
            assetsLoaded = 0;
        }

        if (!assetsLoaded) {
            g.clearScreen('blue');
            g.putTextAligned('Loading', 'white', 0, 0, 0, 0);
        } else {
            this.draw3d();
            g.clearScreen();
            this.draw2d();
            this.draw2doverlay();
        }
    }

    draw3d() {
        let XOR = this.XOR;
        let sg = XOR.Scenegraph;
        let gl = XOR.Fluxions.gl;
        gl.clearColor(0.2, 0.3 * GTE.oscillate(XOR.t1, 0.5, 0.0, 0.3, 0.0), 0.4, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let rc = sg.UseRenderConfig("default");
        if (rc) {
            sg.sunlight.setOrbit(45, 45, 10);
            sg.camera.angleOfView = 45;
            sg.camera.setLookAt(Vector3.make(0, 0, 5), Vector3.make(0, 0, 0), Vector3.make(0, 1, 0));
            sg.SetGlobalParameters(rc)
            sg.RenderScene(rc, "");
        }
    }

    draw2d() {
        let g = this.XOR.Graphics;
        g.drawTiles();
        g.drawSprites();
    }

    draw2doverlay() {
        let g = this.XOR.Graphics;
        g.putTextAligned(this.states.topName, 'white', -1, -1, 0, 0);
        g.putTextAligned(this.states.topAlt, 'white', 1, -1, 0, 0);

        if (this.states.topName == "MAINMENU") {
            g.putTextAligned(this.title, 'white', 0, 0, 0, -g.height / 5);
            g.putTextAligned('Press START!', 'red', 0, 0, 0, 0);
        } else {
            g.context.fillStyle = 'red';
        }

        if (this.states.topName == "ASKTOQUIT") {
            g.putTextAligned("REALLY QUIT?", 'white', 0, 0, 0, 0);
            g.putTextAligned("ESCAPE = NO", 'white', 0, 0, 0, g.fontHeight * 2);
            g.putTextAligned("ENTER = YES", "white", 0, 0, 0, g.fontHeight * 3);
        }

        if (this.states.topName == "READY") {
            g.putTextAligned('READY!', 'red', -1, 1, 0, 0);
        }
        if (this.states.topName == "SET") {
            g.putTextAligned('SET!', 'yellow', 0, 1, 0, 0);
        }
        if (this.states.topName == "GO") {
            g.putTextAligned('GO!!!', 'green', 1, 1, 0, 0);
        }
    }

    setInstructions() {
        let EIs: Array<[string, string]> = [
            ["leftInstructions", ""],
            ["rightInstructions", ""],
            ["upInstructions", ""],
            ["downInstructions", ""],
            ["enterInstructions", ""],
            ["escapeInstructions", ""],
            ["spaceInstructions", ""]
        ];
        for (let ei of EIs) {
            let e = document.getElementById(ei[0]);
            if (e) {
                e.innerHTML = ei[1];
            }
        }
    }
}



function swapZQSD() {
    let e = document.getElementById('zqsd');
    if (!e) return;
    game.XOR.Input.wasdFormat = !game.XOR.Input.wasdFormat;
    if (game.XOR.Input.wasdFormat) {
        e.setAttribute("value", "Switch to ZQSD");
        let uk = document.getElementById('UPKEY');
        if (uk) uk.innerHTML = 'w';
        let lk = document.getElementById('LEFTKEY');
        if (lk) lk.innerHTML = 'a';
    }
    else {
        e.setAttribute("value", "Switch to WASD");
        let uk = document.getElementById('UPKEY');
        if (uk) uk.innerHTML = 'z';
        let lk = document.getElementById('LEFTKEY');
        if (lk) lk.innerHTML = 'q';
    }
    game.focus();
}



let game = new Game();