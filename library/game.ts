/// <reference path="gte/GTE.ts" />
/// <reference path="LibXOR.ts" />
/// <reference path="State.ts" />

export class Game {
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
        this.XOR = new LibXOR();
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
        if (!g.spritesLoaded) {
            g.clearScreen('blue');
            g.putTextAligned('Loading', 'white', 0, 0, 0, 0);
        } else {
            g.clearScreen('lightblue');
            if (XOR.Input.getkey(KEY_LEFT))
                g.clearScreen('lightblue');
            else if (XOR.Input.getkey(KEY_RIGHT))
                g.clearScreen('yellow');

            g.putTextAligned(this.states.topName, 'white', -1, -1, 0, 0);
            g.putTextAligned(this.states.topAlt, 'white', 1, -1, 0, 0);

            g.drawSprites();

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

    }
}


let game = new Game();
game.run();
