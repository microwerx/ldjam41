
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
const SCENARIO_LUCK = 3;

function plural(x: number): string {
    if (x == 1) return "";
    return "s";
}

class AdventureGame {
    numTurns = 0;
    currentChoice = 0;
    currentQuantity = 0;
    currentScenario = 0;
    currentScenarioDescription = "";
    maxQuantity = 0;
    market: number[] = [];

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
    constructor(public XOR: LibXOR, public sharedState: SharedState) {
        this.sprites = CreateSprites();
        this.states = new StateMachine(XOR);
    }

    get lost(): boolean {
        if (this.sharedState.numCamels <= 0) return true;
        if (this.sharedState.numHealthPoints <= 0) return true;
        return false;
    }

    get won(): boolean {
        if (this.sharedState.milesTraveled > MILES_TO_TRAVEL) return true;
        return false;
    }

    get timeForAction(): boolean {
        if (this.numTurns > 10) {
            this.sharedState.numEnemies = 25 + GTE.dice(this.sharedState.currentStepOfJourney * 2 + 5);
            this.sharedState.enemySpeed = 1 + GTE.dice(this.sharedState.currentStepOfJourney / 2);
            return true;
        }
        return false;
    }

    init() {
        this.sharedState.milesTraveled = 0;
        this.sharedState.numCamels = INITIAL_CAMELS;
        this.sharedState.numHealthPoints = INITIAL_HEALTH;
        this.sharedState.currentStepOfJourney = 0;
        this.sharedState.numCamels = 16;

        this.market = [0, 0, 0];

        this.lines = [
            "You are setting out on a fantastic",
            "journey...",
            "",
            "It is full of danger...",
            "",
            "Yay!"];
        this.XOR.Timers.start("simwait", SIM_TIME_PER_STEP);
    }

    start() {
        this.XOR.Music.play(2);
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
                let dy = XOR.Input.getkey2(KEY_UP, KEY_DOWN) + XOR.Input.gamepadStick1.y;
                dy = GTE.clamp(dy, -1, 1);
                if (dy != 0) {
                    this.currentChoice = GTE.clamp(this.currentChoice + dy, 0, 3);
                    XOR.Sounds.playSound("rimshot");
                    XOR.Input.clearkeys();
                    XOR.Timers.start("GETKEY", 0.25);
                }

                if (XOR.Input.getkey(KEY_START) || XOR.Input.gamepadButtons[0]) {
                    this.chooseQuantity();
                    XOR.Input.clearkeys();
                    XOR.Timers.start("GETKEY", 0.25);
                    XOR.Sounds.playSound("rimshot");
                }
            }
            return;
        }

        if (this.states.topAlt == "GETQUANTITY") {
            if (XOR.Timers.ended("GETKEY")) {
                let dy = XOR.Input.getkey2(KEY_DOWN, KEY_UP) + XOR.Input.gamepadStick1.y;
                dy = GTE.clamp(dy, -1, 1);
                if (dy != 0) {
                    this.currentQuantity = GTE.clamp(this.currentQuantity + dy, 0, this.maxQuantity);
                    XOR.Input.clearkeys();
                    XOR.Timers.start("GETKEY", 0.2);
                }

                if (XOR.Input.getkey(KEY_START) || XOR.Input.gamepadButtons[0]) {
                    this.makePurchase();
                    XOR.Input.clearkeys();
                    XOR.Timers.start("GETKEY", 0.2);
                }

                if (XOR.Input.getkey(KEY_BACK) || XOR.Input.gamepadButtons[1]) {
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
                    this.maxQuantity = Math.floor(this.sharedState.numJewels / this.market[CAMELS]);
                    break;
                case 1:
                    this.maxQuantity = Math.floor(this.sharedState.numJewels / this.market[MEDICINES]);
                    break;
                case 2:
                    this.maxQuantity = Math.floor(this.sharedState.numJewels / this.market[SACKSOFFOOD]);
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
        this.sharedState.numCamels += this.currentQuantity;
        this.sharedState.numJewels -= this.currentQuantity * this.market[CAMELS];
    }

    buyMedicine() {
        this.sharedState.numMedicines += this.currentQuantity;
        this.sharedState.numJewels -= this.currentQuantity * this.market[MEDICINES];
    }

    buyFood() {
        this.sharedState.numSacksOfFood += this.currentQuantity;
        this.sharedState.numJewels -= this.currentQuantity * this.market[SACKSOFFOOD];
    }

    continueJourney() {
        this.states.clear();
        this.states.push("SIM", "", 0);
        this.XOR.Timers.start("simwait", SIM_TIME_PER_STEP);
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
            if (GTE.dice(6) > 3) {
                this.currentScenario = SCENARIO_LUCK;
            }

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
                case SCENARIO_LUCK:
                    this.createLuckScenario();
                    break;
            }
            this.lines.push("");
            this.lines.push("Press ENTER to continue");
            this.states.push("SCENARIO", "PAUSE", 2);
            return;
        }
    }

    createCamelScenario() {
        let lostCamels = GTE.random(1, Math.min(this.sharedState.numCamels, 3)) | 0;
        this.sharedState.numCamels -= lostCamels;
        let adverbs = ["unfortunate", "unthinkable", "improbable"];
        this.lines = [
            "Your camels suffered an " + adverbs[GTE.random(0, 2) | 0],
            "accident. You lost " + lostCamels + " camel" + plural(lostCamels) + "."
        ];
    }

    createHealthScenario() {
        let lostHealth = GTE.random(1, Math.min(this.sharedState.numHealthPoints, 3)) | 0;
        this.sharedState.numHealthPoints -= lostHealth;;
        let issues = ["E. coli", "tapeworms", "the flu", "botulism"];
        this.lines = [
            "You got sick with " + issues[GTE.random(0, issues.length - 1) | 0] + ".",
            "You lost " + lostHealth + " health point" + plural(lostHealth) + ".",
            "You have " + this.sharedState.numHealthPoints + " health point" + plural(this.sharedState.numHealthPoints) + " left."
        ];
    }

    createFoodScenario() {
        let ss = this.sharedState;
        let lostFood = GTE.dice(3);
        if (lostFood > ss.numSacksOfFood) {
            lostFood = ss.numSacksOfFood;
        }
        if (lostFood == 0) {
            this.lines = [
                "Thieves came to steal your food,",
                "but you have none!",
                ""
            ];
            if (GTE.rand01() < 0.1) {
                this.lines.push("They feel bad for you and give you");
                this.lines.push("a stolen sack from a rich man they")
                this.lines.push("robbed earlier.");
                ss.numSacksOfFood++;
            }
            return;
        }
        this.sharedState.numSacksOfFood -= lostFood;
        this.sharedState.numSacksOfFood = GTE.clamp(this.sharedState.numSacksOfFood, 0, 1000);
        let issues = ["thieves", "camel spit", "worms", "spoilage"];
        this.lines = [
            "Some food was lost due to " + issues[GTE.random(0, issues.length - 1) | 0] + ".",
            "You lost " + lostFood.toFixed(2) + " sack" + plural(lostFood) + " of food.",
            "You have " + this.sharedState.numSacksOfFood.toFixed(2) + " sack" + plural(this.sharedState.numSacksOfFood) + " of food remaining."
        ];
    }

    createLuckScenario() {
        let gainedHealth = 0;
        let gainedJewels = 0;
        let gainedMissile = 0;

        let ss = this.sharedState;
        let roll = GTE.dice(4);
        if (roll == 1 && GTE.rand01() < 0.05) {
            if (ss.numMissiles < MAX_MISSILES - 1) {
                gainedMissile++;
                ss.numMissiles++;
                this.lines = [
                    "Hooray! You have found a new missile. This",
                    "should make defending the camels a bit easier."
                ];
            }
        }
        else if (roll == 2) {
            if (ss.numHealthPoints < 20 && GTE.rand01() < 0.5) {
                let chance = GTE.rand01();
                if (chance < 0.01) {
                    gainedHealth = MAX_PLAYER_HEALTH - ss.numHealthPoints;

                } else if (chance < 0.5) {
                    gainedHealth = GTE.dice(5);
                }
                if (gainedHealth > 0) {
                    this.lines = [
                        "That was a great night's rest! Your",
                        "health went up " + gainedHealth + " point" + plural(gainedHealth) + "."
                    ]
                }
            }
        } else if (roll == 3) {
            if (ss.numJewels < 1000) {
                let chance = GTE.rand01();
                if (chance < 0.01) {
                    gainedJewels += GTE.random(100, 500) | 0;
                } else if (chance < 0.1) {
                    gainedJewels += GTE.random(50, 75) | 0;
                } else if (chance < 0.5) {
                    gainedJewels += GTE.random(10, 20) | 0;
                }
                ss.numJewels += gainedJewels;
                this.lines = [
                    "You stumble upon some treasure.",
                    "You found " + gainedJewels + " jewels."
                ];
            }
        }
        if (gainedHealth == 0 && gainedJewels == 0 && gainedMissile == 0) {
            let strings = [
                "You admire the lovely landscape.",
                "That was a really nice butterfly.",
                "Wow, camels really like to spit!",
                "It sure is a hot day! I'm thirsty!",
                "You really miss the gondolas.",
                "Wow, this scenary is incredible!",
                "You admire a flowing brook.",
                "Is it really the 13th century?",
                this.journeySteps[ss.currentStepOfJourney] + " is nice to visit!",
                "The citizens of " + this.journeySteps[ss.currentStepOfJourney] + " hate you!",
                "You stop to feed your " + ss.numCamels + " camel" + plural(ss.numCamels) + "."
            ];
            this.lines = [
                strings[GTE.random(0, strings.length - 1) | 0]
            ];
        }
    }

    status() {
        let ss = this.sharedState;
        if (this.states.topName != "STATUS") {
            this.states.pop();
            this.states.push("STATUS", "", 0);
            this.states.push("STATUS", "GETCHOICE", 0);
        }

        this.lines = [
            "You have traveled " + this.sharedState.milesTraveled + " miles.",
            "The province of " + this.journeySteps[ss.currentStepOfJourney] + " is nearby.",
            "",
            "Status",
            "-----------------  Owned",
            " Number of camels  " + this.sharedState.numCamels,
            " Health/Medicines  " + this.sharedState.numHealthPoints + "/" + this.sharedState.numMedicines,
            " Sacks of Food     " + this.sharedState.numSacksOfFood.toFixed(2),
            " Jewels            " + this.sharedState.numJewels,
            "",
            "What would you like to do?",
            "    Buy Camels",
            "    Buy Medicine",
            "    Buy Food",
            "    Continue Journey"
        ];
    }

    sim() {
        let ss = this.sharedState;
        this.numTurns++;
        this.sharedState.milesTraveled += GTE.random(50, 60) | 0;
        this.sharedState.currentStepOfJourney = GTE.clamp(this.sharedState.milesTraveled / (6000 / this.journeySteps.length), 0, this.journeySteps.length - 1) | 0;
        let mix = this.sharedState.milesTraveled / 6000.0;
        this.market = [
            GTE.lerp(GTE.random(9, 11), GTE.random(45, 55), mix) | 0, // CAMEL
            GTE.lerp(GTE.random(9, 11), GTE.random(20, 25), mix) | 0, // MEDICINE
            GTE.lerp(GTE.random(9, 11), GTE.random(15, 25), mix) | 0 // FOOD
        ];

        // use medicine
        if (this.sharedState.numHealthPoints < 5) {
            if (this.sharedState.numMedicines > 0) {
                this.sharedState.numHealthPoints++;
                this.sharedState.numMedicines--;
            }
        }

        // use food
        if (this.sharedState.numSacksOfFood > 0) {

            this.sharedState.numSacksOfFood -= (GTE.random(1, 10) | 0) / 10;
            if (ss.numSacksOfFood < 0) {
                ss.numSacksOfFood = 0;
                if (GTE.rand01() < 0.5) {
                    ss.numHealthPoints--;
                }
                if (GTE.rand01() < 0.1) {
                    ss.numCamels--;
                }
            }
        }

        if (this.numTurns > 1 && GTE.rand01() < 0.5) {
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
