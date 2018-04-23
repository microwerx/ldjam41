

class SharedState {
    milesTraveled = 0;
    numCamels = 16;
    numMedicines = 10;
    numSacksOfFood = 5;
    numJewels = 100;
    numHealthPoints = 5;
    numMissiles = 1;
    score = 0;
    numEnemies = 0;
    enemySpeed = 1;
    currentStepOfJourney = 0;

    constructor() {
    }

    get lost(): boolean {
        if (this.numHealthPoints <= 0) return true;
        if (this.numCamels <= 0) return true;
        return false;
    }

    get won(): boolean {
        if (this.milesTraveled >= 6000) return true;
        if (this.numEnemies > 0) return false;
        return false;
    }
}