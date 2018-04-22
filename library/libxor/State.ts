// LibXOR Library
// Copyright (c) 2017 - 2018 Jonathan Metzgar
// All Rights Reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//
// There are different kinds of useful states and state transitions
// PAUSE - wait until a certain time, and then pop
// NORMAL - wait until popped

class State {
    constructor(public name: string,
        public alt: string = "NONE",
        public delayTime: number = 0,
        public queueSound: string = "",
        public queueMusic: string = "") {
    }
}

class StateMachine {
    states: State[] = [];
    private _t1: number;

    constructor(public XOR: LibXOR) {
        this._t1 = 0;
    }

    clear() {
        this.states = [];
    }

    update(tInSeconds: number) {
        this._t1 = tInSeconds;

        let topTime = this.topTime;
        if (topTime > 0 && topTime < tInSeconds) {
            this.pop();
            this.XOR.Sounds.playSound(this.topSound);
        }
    }

    push(name: string, alt: string, delayTime: number) {
        if (delayTime > 0) delayTime += this._t1;
        this.states.push(new State(name, alt, delayTime));
    }

    pushwithsound(name: string, alt: string, delayTime: number, sound: string, music: string) {
        if (delayTime > 0) delayTime += this._t1;
        this.states.push(new State(name, alt, delayTime, sound, music));
        this.push(name, "PAUSE", 0.01);
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

    get topSound(): string {
        let l = this.states.length;
        if (l > 0) {
            return this.states[l - 1].queueSound;
        }
        return "NONE";
    }

    get topMusic(): string {
        let l = this.states.length;
        if (l > 0) {
            return this.states[l - 1].queueMusic;
        }
        return "NONE";
    }
}
