/// <reference path="../gte/GTE.ts" />
/// <reference path="../libxor/LibXOR.ts" />
/// <reference path="../libxor/State.ts" />
/// <reference path="Common.ts" />
/// <reference path="SharedState.ts" />
/// <reference path="AdventureGame.ts" />
/// <reference path="ActionGame.ts" />


class Game {
    XOR: LibXOR;

    sharedState: SharedState;
    actionGame: ActionGame;
    adventureGame: AdventureGame;

    series: string = "#LDJAM 41";
    title: string = "Marco Polo";
    author: string = "by microwerx";

    askToQuit: boolean = false;
    gameover: boolean = true;
    gamelevel: number = 1;
    score: number = 0;
    states: StateMachine;

    levelColors: [string, string][] = [
        ["#7271dc", '#1a2dff'],
    ];
    currentEnvironmentColor: string = 'lightbrown';

    constructor() {
        this.XOR = new LibXOR(640, 512);
        this.states = new StateMachine(this.XOR);

        this.sharedState = new SharedState();
        this.actionGame = new ActionGame(this.XOR, this.sharedState);
        this.adventureGame = new AdventureGame(this.XOR, this.sharedState);

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
        g.loadSprites("assets/images/marcopolo.png?" + Date.now());

        XOR.Sounds.queueSound('hihat', 'assets/sounds/E12HIHAT.wav');
        XOR.Sounds.queueSound('kick', 'assets/sounds/E12KICK.wav');
        XOR.Sounds.queueSound('kickaccent', 'assets/sounds/E12KICKACCENT.wav');
        XOR.Sounds.queueSound('rimshot', 'assets/sounds/E12RIMSHOT.wav');
        XOR.Sounds.queueSound('snare', 'assets/sounds/E12SNARE.wav');
        XOR.Sounds.queueSound('missile', "assets/sounds/E32SPACEDRUM.wav");
        XOR.Sounds.queueSound('death', 'assets/sounds/E32SNAP.wav');
        XOR.Sounds.queueSound('cameldeath', 'assets/sounds/cameldie.wav');
        XOR.Sounds.queueSound('item', 'assets/sounds/E32HIHAT2.wav')



        g.resizeTiles(64, 64, 4);

        if (XOR.Scenegraph) {
            let sg = XOR.Scenegraph;
            //sg.AddRenderConfig("default", "assets/shaders/default.vert", "assets/shaders/default.frag");
            //sg.Load("assets/test.scn");
        }

        this.states.push("MAINMENU", "", 0);
        this.states.push("MAINMENU", "PAUSE", 0.25);
    }


    changelevel(which: number) {
        let XOR = this.XOR;
        let g = this.XOR.Graphics;


        this.gamelevel = which;
        this.states.push("MAINMENU", "", 0);
        //this.states.push("ACTIONGAME", "INIT", 0);
        this.states.push("ADVENTUREGAME", "INIT", 0);
    }

    readySetGo() {
        let name = this.states.topName;
        this.states.pushwithsound(name, "GO", 3, "snare", "");
        this.states.pushwithsound(name, "SET", 2, "snare", "");
        this.states.pushwithsound(name, "READY", 1, "snare", "");
    }

    statePause(): boolean {
        if (this.states.topAlt == "PAUSE")
            return true;
        return false;
    }

    stateMainMenu(): boolean {
        let XOR = this.XOR;
        if (this.states.topName == "MAINMENU") {
            if (XOR.Input.getkey(KEY_START)) {
                this.changelevel(1);
            }
            return true;
        } else {
        }
        return false;
    }

    checkGameModeAskToQuit(): boolean {
        let XOR = this.XOR;
        if (this.states.topAlt == "PLAY"
            && this.adventureGame.states.topAlt != "GETCHOICE"
            && this.adventureGame.states.topAlt != "GETQUANTITY") {
            if (XOR.Input.getkey(KEY_BACK)) {
                this.states.push("ASKTOQUIT", "INIT", 0);
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

        if (this.statePause()) return;
        if (this.stateMainMenu()) return;
        if (this.stateAskToQuit()) return;
        if (this.checkGameModeAskToQuit()) return;

        let currentTrack = 0;
        if (this.states.topName == "ADVENTUREGAME")
            currentTrack = 2;
        if (this.states.topName == "ACTIONGAME")
            currentTrack = 3;

        XOR.Music.fadeIn(currentTrack, 0.05);
        if (XOR.Music.ended(currentTrack)) XOR.Music.play(currentTrack);

        for (let i = 0; i < 4; i++) {
            if (currentTrack == i) continue;
            XOR.Music.fadeOut(i, 0.05);
            //if (XOR.Music.getVolume(i) < 0.1) XOR.Music.stop(i);
        }


        if (this.stateActionGame() && this.states.topAlt == "PLAY") {
            if (this.actionGame.lost) {
                this.states.pop();
                this.states.push("MAINMENU", "", 0);
                this.states.push("ACTIONGAME", "LOST", 4);
                XOR.Music.play(0);
            }
            else if (this.actionGame.won) {
                this.states.pop();
                this.states.push("ADVENTUREGAME", "PLAY", 0);
                this.adventureGame.start();
                this.readySetGo();
                this.states.push("ACTIONGAME", "WON", 4);
                XOR.Music.play(1);
            }
            this.actionGame.update();
            return;
        }
        if (this.stateAdventureGame() && this.states.topAlt == "PLAY") {
            if (this.adventureGame.lost) {
                this.states.pop();
                this.states.push("MAINMENU", "", 0);
                this.states.push("ADVENTUREGAME", "LOST", 4);
                XOR.Music.play(0);
            }
            else if (this.adventureGame.won) {
                this.states.pop();
                this.states.push("MAINMENU", "", 0);
                this.states.push("ADVENTUREGAME", "WON", 4);
                XOR.Music.play(1);
            }
            else if (this.adventureGame.timeForAction) {
                this.states.push("ACTIONGAME", "PLAY", 0);
                this.actionGame.start();
                this.readySetGo();
            }
            else {
                this.adventureGame.update();
            }
            return;
        }
    }

    stateActionGame() {
        if (this.states.topName != "ACTIONGAME") return false;
        if (this.states.topAlt == "INIT") {
            this.actionGame.init();
            this.states.pop();
            this.states.push("ACTIONGAME", "PLAY", 0);
            this.readySetGo();
        }
        return true;
    }

    stateAdventureGame() {
        if (this.states.topName != "ADVENTUREGAME") return false;
        if (this.states.topAlt == "INIT") {
            this.adventureGame.init();
            this.adventureGame.start();
            this.states.pop();
            this.states.push("ADVENTUREGAME", "PLAY", 0);
            this.readySetGo();
        }
        return true;
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
            //this.draw3d();
            let gradient = g.context.createLinearGradient(0, 0, 0, XOR.height);
            gradient.addColorStop(0, this.levelColors[0][0]);
            gradient.addColorStop(1, this.levelColors[0][1]);
            g.clearScreen(gradient);
            this.draw2d();
            this.draw2doverlay();
        }
    }

    draw3d() {
    }

    draw2d() {
        let g = this.XOR.Graphics;
        //g.drawTiles();
        //g.drawSprites();

        if (this.states.topName == "ACTIONGAME") {
            this.actionGame.draw(g);
        }
        if (this.states.topName == "ADVENTUREGAME") {
            this.adventureGame.draw(g);
        }
    }

    draw2doverlay() {
        let g = this.XOR.Graphics;
        if (this.states.topName == "MAINMENU") {
            let font = g.context.font
            g.context.font = "64px Salsbury,EssentialPragmataPro,sans-serif";
            g.putTextAligned(this.title, 'white', 0, 0, 0, -g.height / 5);
            g.context.font = font;
            g.putTextAligned('Press START!', 'red', 0, 0, 0, 0);
        } else {
            g.context.fillStyle = 'red';
        }

        if (this.states.topName == "ASKTOQUIT") {
            g.putTextAligned("REALLY QUIT?", 'white', 0, 0, 0, 0);
            g.putTextAligned("ESCAPE = NO", 'white', 0, 0, 0, g.fontHeight * 2);
            g.putTextAligned("ENTER = YES", "white", 0, 0, 0, g.fontHeight * 3);
        }

        if (this.states.topAlt == "READY") {
            g.putTextAligned('READY!', 'red', 0, 0, 0, 0);
        }
        if (this.states.topAlt == "SET") {
            g.putTextAligned('SET!', 'yellow', 0, 0, 0, 0);
        }
        if (this.states.topAlt == "GO") {
            g.putTextAligned('GO!!!', 'lime', 0, 0, 0, 0);
        }

        if (this.states.topName == "ACTIONGAME") {
            this.actionGame.draw2doverlay(g);
            if (this.states.topAlt == "WON") {
                g.putTextAligned("YAY! YOU WON THIS ROUND!!!", 'red', 0, 0, 0, 0);
            }
            if (this.states.topAlt == "LOST") {
                g.putTextAligned("OH NO! YOU LOST!!!", 'red', 0, 0, 0, 0);
            }
        }

        if (this.states.topName == "ADVENTUREGAME") {
            this.adventureGame.draw2doverlay(g);
            if (this.states.topAlt == "WON") {
                g.putTextAligned("YAY! YOU WON THE GAME!!!", 'red', 0, 0, 0, 0);
            }
            if (this.states.topAlt == "LOST") {
                g.putTextAligned("OH NO! YOU LOST!!!", 'red', 0, 0, 0, 0);
            }
        }

        // let debug = true;
        // if (debug) {
        //     g.putTextAligned(this.states.topName, 'white', -1, -1, 0, 0);
        //     g.putTextAligned(this.states.topAlt, 'white', -1, -1, 0, 32);
        //     g.putTextAligned("Time: " + Math.ceil(this.XOR.t1 - this.states.topTime), 'white', -1, -1, 0, 64);
        //     for (let i = 0; i < 4; i++) {
        //         g.putTextAligned("" + this.XOR.Music.getVolume(i).toFixed(2), "white", 0, 0, 0, i * 32);
        //     }
        // }
    }

    setInstructions() {
        let EIs: Array<[string, string]> = [
            ["gameInstructions", "Part Adventure, Part Action. Marco Polo is journeying across Asia with his camels. But many deadly foes and situations lay ahead. Will he survive?"],
            ["leftInstructions", "Move left"],
            ["rightInstructions", "Move right"],
            ["upInstructions", "Move up"],
            ["downInstructions", "Move down"],
            ["enterInstructions", "Fire"],
            ["escapeInstructions", "Quit game"],
            ["spaceInstructions", "Fire"]
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