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
/// <reference path="../gte/GTE.ts" />

class MusicComponent {
    musicElements: HTMLAudioElement[];
    currentPiece: number;
    lastPiece: number;
    private promises: any[];
    constructor() {
        this.musicElements = [];
        this.musicElements.push(document.createElement("audio"));
        this.musicElements.push(document.createElement("audio"));
        this.musicElements.push(document.createElement("audio"));
        this.musicElements.push(document.createElement("audio"));
        this.musicElements[0].src = "assets/music/noise.mp3";
        this.musicElements[1].src = "assets/music/maintheme.mp3";
        this.musicElements[2].src = "assets/music/adventuretheme.mp3"
        this.musicElements[3].src = "assets/music/arcadetheme.mp3";
        this.promises = [null, null, null, null];
        this.musicElements[0].pause();
        this.musicElements[1].pause();
        this.musicElements[2].pause();
        this.musicElements[3].pause();
        this.currentPiece = -1;
        this.lastPiece = -1;
    }

    load(url: string) {
        this.musicElements.push(document.createElement("audio"));
        let i = this.musicElements.length - 1;
        this.musicElements[i].pause();
        this.promises.push(null);
    }

    play(which: number): boolean {
        if (which < 0 || which >= this.musicElements.length) return false;
        this.musicElements[which].currentTime = 0;
        this.promises[which] = this.musicElements[which].play();
        this.mute(this.lastPiece);
        this.lastPiece = this.currentPiece;
        this.currentPiece = which;
        return true;
    }

    update(tInSeconds: number) {
        // blend the current and last pieces together
    }

    ended(index: number): boolean {
        if (index < 0 || index >= this.musicElements.length)
            return true;
        return this.musicElements[index].ended || this.musicElements[index].paused;
    }

    stop(index: number) {
        if (index < 0 || index >= this.musicElements.length)
            return;
        this.musicElements[index].currentTime = 0.0;
        this.musicElements[index].pause();
    }

    mute(index: number) {
        if (index < 0 || index >= this.musicElements.length)
            return;
        this.musicElements[index].volume = 0;
    }

    fadeOut(index: number, amount: number): number {
        if (index < 0 || index >= this.musicElements.length)
            return 0;
        this.musicElements[index].volume *= GTE.clamp(amount, 0.0, 0.99999);
        return this.musicElements[index].volume;
    }

    fadeIn(index: number, amount: number): number {
        if (index < 0 || index >= this.musicElements.length)
            return 0.0;;
        this.musicElements[index].volume += (1.0 - this.musicElements[index].volume) * amount;
        return this.musicElements[index].volume;
    }

    setVolume(index: number, volume: number) {
        if (index < 0 || index >= this.musicElements.length)
            return;
        this.musicElements[index].volume = volume;
    }

    getVolume(index: number): number {
        if (index < 0 || index >= this.musicElements.length)
            return 0;
        return this.musicElements[index].volume;
    }
}
