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
class TimerComponent {
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
