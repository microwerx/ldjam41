export class TimerComponent {
    dt: number = 0;
    t0: number = 0;
    t1: number = 0;

    timers: Map<string, number> = new Map<string, number>();

    constructor() {
    }

    update(tInSeconds: number) {
        this.t0 = this.t1;
        this.t1 = tInSeconds;
        this.dt = this.t1 - this.t0;
    }

    start(name: string, length: number) {
        this.timers.set(name, this.t1 + length);
    }

    ended(name: string): boolean {
        let timer = this.timers.get(name);
        if (!timer) return true;
        if (this.t1 >= timer) {
            return true;
        }
        return false;
    }

    timeleft(name: string): number {
        let timer = this.timers.get(name);
        if (!timer) return 0;
        if (this.t1 < timer) {
            return timer - this.t1;
        }
        return 0;
    }
}
