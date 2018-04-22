
const INITIAL_CAMELS = 16;
const INITIAL_HEALTH = 16;
const MILES_TO_TRAVEL = 6000;

const CAMELS = 0;
const MEDICINES = 1;
const SACKSOFFOOD = 2;
const MAX_MARKET_ITEMS = 3;

const SCENARIO_CAMEL = 0;
const SCENARIO_HEALTH = 1;
const SCENARIO_FOOD = 2;

class AdventureGame {
    milesTraveled = 0;
    numCamels = 16;
    numMedicines = 10;
    numSacksOfFood = 5;
    numJewels = 100;
    playerHealth = 5;
    numTurns = 0;
    currentChoice = 0;
    currentQuantity = 0;
    currentScenario = 0;
    currentScenarioDescription = "";
    maxQuantity = 10;
    market: number[] = [];

    currentStepOfJourney = 0;
    journeySteps: string[] = [
        "Acre",
        "Trebizond",
        "Baghdad",
        "Terbil",
        "Ormuz",
        "Balkh",
        "Kashgar",
        "Lanzhou",
        "Karakorum",
        "Beijing"
    ];

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
        this.currentStepOfJourney = 0;

        this.market = [0, 0, 0];

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
        this.states.push("SIM", "", 0);
    }

    update() {
        let XOR = this.XOR;
        this.states.update(this.XOR.t1);
        if (!XOR.Timers.ended("simwait"))
            return;

        if (this.states.topName == "SIM") {
            this.sim();
        }

        if (this.states.topName == "SCENARIO") {
            this.scenario();
            if (XOR.Timers.ended("GETKEY")) {
                if (XOR.Input.buttons) {
                    XOR.Input.clearkeys();
                    XOR.Timers.start("GETKEY", 0.25);
                    this.status();
                    return;
                }
            }
        }

        if (this.states.topName == "STATUS") {
            this.status();
        }

        if (this.states.topAlt == "GETCHOICE") {
            if (XOR.Timers.ended("GETKEY")) {
                let dy = XOR.Input.getkey2(KEY_UP, KEY_DOWN);
                if (dy != 0) {
                    this.currentChoice = GTE.clamp(this.currentChoice + dy, 0, 3);
                    XOR.Input.clearkeys();
                    XOR.Timers.start("GETKEY", 0.25);
                }

                if (XOR.Input.getkey(KEY_START)) {
                    this.chooseQuantity();
                    XOR.Input.clearkeys();
                    XOR.Timers.start("GETKEY", 0.25);
                }
            }
        }

        if (this.states.topAlt == "GETQUANTITY") {
            if (XOR.Timers.ended("GETKEY")) {
                let dy = XOR.Input.getkey2(KEY_DOWN, KEY_UP);
                if (dy != 0) {
                    this.currentQuantity = GTE.clamp(this.currentQuantity + dy, 0, this.maxQuantity);
                    XOR.Input.clearkeys();
                    XOR.Timers.start("GETKEY", 0.2);
                }

                if (XOR.Input.getkey(KEY_START)) {
                    this.makePurchase();
                    XOR.Input.clearkeys();
                    XOR.Timers.start("GETKEY", 0.2);
                }

                if (XOR.Input.getkey(KEY_BACK)) {
                    this.states.pop();
                    return;
                }
            }
        }
    }

    chooseQuantity() {
        if (this.states.topName == "STATUS") {
            switch (this.currentChoice) {
                case 0:
                    this.maxQuantity = Math.floor(this.numJewels / this.market[CAMELS]);
                    break;
                case 1:
                    this.maxQuantity = Math.floor(this.numJewels / this.market[MEDICINES]);
                    break;
                case 2:
                    this.maxQuantity = Math.floor(this.numJewels / this.market[SACKSOFFOOD]);
                    break;
                case 3:
                    this.continueJourney();
                    return;
            }
            this.currentQuantity = this.maxQuantity;
            this.states.push("STATUS", "GETQUANTITY", 0);
        }
    }

    buyCamels() {
        this.numCamels += this.currentQuantity;
        this.numJewels -= this.currentQuantity * this.market[CAMELS];
    }

    buyMedicine() {
        this.numMedicines += this.currentQuantity;
        this.numJewels -= this.currentQuantity * this.market[MEDICINES];
    }

    buyFood() {
        this.numSacksOfFood += this.currentQuantity;
        this.numJewels -= this.currentQuantity * this.market[SACKSOFFOOD];
    }

    continueJourney() {
        this.numTurns++;
        this.states.clear();
        this.states.push("SIM", "", 0);
        this.XOR.Timers.start("simwait", 2);
    }

    makePurchase() {
        if (this.states.topName == "STATUS") {
            switch (this.currentChoice) {
                case 0: this.buyCamels(); break;
                case 1: this.buyMedicine(); break;
                case 2: this.buyFood(); break;
            }
        }
        this.states.pop();
    }

    scenario() {
        if (this.states.topName != "SCENARIO") {
            this.states.clear();
            this.states.push("SCENARIO", "", 0);
            this.states.push("SCENARIO", "GETCHOICE", 0);

            this.currentScenario = GTE.random(0, 2) | 0;

            switch (this.currentScenario) {
                case SCENARIO_CAMEL:
                    this.createCamelScenario();
                    break;
                case SCENARIO_HEALTH:
                    this.createHealthScenario();
                    break;
                case SCENARIO_FOOD:
                    this.createFoodScenario();
                    break;
            }
            this.lines.push("");
            this.lines.push("Press ENTER to continue");
            this.states.push("SCENARIO", "PAUSE", 2);
            return;
        }
    }

    createCamelScenario() {
        let lostCamels = GTE.random(0, Math.min(this.numCamels, 3)) | 0;
        this.numCamels -= lostCamels;
        let adverbs = ["unfortunate", "unthinkable", "improbable"];
        this.lines = [
            "Your camels suffered an " + adverbs[GTE.random(0, 2) | 0] + " accident.",
            "You lost " + lostCamels + " camels."
        ];
    }

    createHealthScenario() {
        let lostHealth = GTE.random(0, Math.min(this.playerHealth, 3)) | 0;
        this.playerHealth -= lostHealth;;
        let issues = ["E. coli", "tapeworms", "the flu", "botulism"];
        this.lines = [
            "You got sick with " + issues[GTE.random(0, issues.length - 1) | 0] + ".",
            "You lost " + lostHealth + " health rating points.",
            "You have " + this.playerHealth + " health rating points remaining."
        ];
    }

    createFoodScenario() {
        let lostFood = GTE.random(0, Math.min(this.numSacksOfFood, 3)) | 0;
        this.numSacksOfFood -= lostFood;
        let issues = ["contamination", "camel spit", "bug infestation", "spoilage"];
        this.lines = [
            "Some food was lost due to " + issues[GTE.random(0, issues.length - 1) | 0] + ".",
            "You lost " + lostFood + " sacks of food.",
            "You have " + this.numSacksOfFood + " sacks of food remaining."
        ];
    }

    status() {
        if (this.states.topName != "STATUS") {
            this.states.pop();
            this.states.push("STATUS", "", 0);
            this.states.push("STATUS", "GETCHOICE", 0);
        }
        this.lines = [
            "You have traveled " + this.milesTraveled + " miles.",
            "The province of " + this.journeySteps[this.currentStepOfJourney] + " is nearby.",
            "",
            "Status",
            "-----------------  Owned",
            " Number of camels  " + this.numCamels,
            " Health            " + this.playerHealth,
            " Sacks of Food     " + this.numSacksOfFood,
            " Jewels            " + this.numJewels,
            "",
            "What would you like to do?",
            "    Buy Camels",
            "    Buy Medicine",
            "    Buy Food",
            "    Continue Journey"
        ];
    }

    sim() {
        this.numTurns++;
        this.milesTraveled += GTE.random(50, 60) | 0;
        let mix = this.milesTraveled / 6000.0;
        this.market = [
            GTE.lerp(GTE.random(9, 11), GTE.random(45, 55), mix) | 0, // CAMEL
            GTE.lerp(GTE.random(9, 11), GTE.random(20, 25), mix) | 0, // MEDICINE
            GTE.lerp(GTE.random(9, 11), GTE.random(15, 25), mix) | 0 // FOOD
        ];
        if (this.numTurns > 0 && GTE.rand01() < 0.18) {
            this.scenario();
        } else {
            this.status();
        }
    }

    draw(g: GraphicsComponent) {

    }

    draw2doverlay(g: GraphicsComponent) {
        let x = 32;
        let y = 0;
        let font = g.context.font;
        g.setFont("EssentialPragmataPro", 32);
        g.context.fillStyle = "white";
        g.context.textAlign = "left";
        for (let line of this.lines) {
            g.context.fillStyle = "black";
            g.putText(line, x + 2, y + 2);
            g.context.fillStyle = "white";
            g.putText(line, x, y);
            y += 32;
        }

        if (this.states.topName == "STATUS") {
            let sprites = [16, 21, 22, 7];
            for (y = 0; y < 4; y++) {
                g.drawSprite(sprites[y], 16, (6 + y) * 32 - 16);
            }

            g.putTextAligned("Cost", 'white', 1, -1, -32, 4 * 32);
            for (y = 0; y < 3; y++) {
                g.putTextAligned("" + this.market[y], 'white', 1, -1, -32, (5 + y) * 32);
            }

            if (this.XOR.Timers.ended("GETKEY")) {
                g.context.fillStyle = "black";
                g.putText(" ->", 64 + 2, (11 + this.currentChoice) * 32 + 2);
                g.context.fillStyle = "white";
                g.putText(" ->", 64, (11 + this.currentChoice) * 32);
            }

            if (this.states.topAlt == "GETQUANTITY") {
                g.putText("" + this.currentQuantity, g.width - 32 * 5, 32 * (11 + this.currentChoice));
            }
        }
        g.context.font = font;
    }
}
