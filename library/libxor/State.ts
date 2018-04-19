// There are different kinds of useful states and state transitions
// PAUSE - wait until a certain time, and then pop
// NORMAL - wait until popped

export class State {
    constructor(public name: string,
        public alt: string = "NONE",
        public delayTime: number = 0,
        public queueSound: string = "",
        public queueMusic: string = "") {
    }
}

export class StateMachine {
    states: State[] = [];
    private _t1: number;

    constructor() {
        this._t1 = 0;
    }

    update(tInSeconds: number) {
        this._t1 = tInSeconds;

        let topTime = this.topTime;
        if (topTime > 0 && topTime < tInSeconds) {
            this.pop();
        }
    }

    push(name: string, alt: string, delayTime: number) {
        if (delayTime > 0) delayTime += this._t1;
        this.states.push(new State(name, alt, delayTime));
    }

    pop() {
        if (this.states.length)
            this.states.pop();
    }

    get topName(): string {
        let l = this.states.length;
        if (l > 0) {
            return this.states[l - 1].name;
        }
        return "NONE";
    }

    get topAlt(): string {
        let l = this.states.length;
        if (l > 0) {
            return this.states[l - 1].alt;
        }
        return "NONE";
    }

    get topTime(): number {
        let l = this.states.length;
        if (l > 0) {
            return this.states[l - 1].delayTime;
        }
        return -1;
    }
}
