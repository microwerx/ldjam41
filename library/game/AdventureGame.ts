
const INITIAL_CAMELS = 16;
const INITIAL_HEALTH = 16;
const MILES_TO_TRAVEL = 6000;

class AdventureGame {
    milesTraveled = 0;
    numCamels = 16;
    playerHealth = 5;
    numJewels = 100;
    numTurns = 0;

    lines: string[] = [];
    states: StateMachine;

    sprites: [number, number][];
    constructor(public XOR: LibXOR) {
        this.sprites = CreateSprites();
        this.states = new StateMachine(XOR);
    }

    get lost(): boolean {
        if (this.numCamels <= 0) return true;
        if (this.playerHealth <= 0) return true;
        return false;
    }

    get won(): boolean {
        if (this.milesTraveled > MILES_TO_TRAVEL) return true;
        return false;
    }

    get timeForAction(): boolean {
        if (this.numTurns > 10) return true;
        return false;
    }

    init() {
        this.milesTraveled = 0;
        this.numCamels = INITIAL_CAMELS;
        this.playerHealth = INITIAL_HEALTH;

        this.lines = [
            "You are setting out on a fantastic",
            "journey...",
            "",
            "It is full of danger...",
            "",
            "Yay!"];
        this.XOR.Timers.start("simwait", 4);
    }

    start() {
        this.numTurns = 0;
    }

    update() {
        let XOR = this.XOR;
        if (XOR.Timers.ended("simwait")) {
            this.sim();
            XOR.Timers.start("simwait", 4);
        }
    }

    printStatus() {
        this.lines = [
            "Number of camels: " + this.numCamels,
            "Health: " + this.playerHealth
        ];
    }

    sim() {
        this.numTurns++;
        this.printStatus();
    }

    draw(g: GraphicsComponent) {

    }

    draw2doverlay(g: GraphicsComponent) {
        let y = 0;
        let font = g.context.font;
        g.setFont("EssentialPragmataPro", 32);
        g.context.fillStyle = "black";
        g.context.textAlign = "left";
        for (let line of this.lines) {
            g.putText(line, 0, y);
            y += 32;
        }
        g.context.font = font;
    }
}
