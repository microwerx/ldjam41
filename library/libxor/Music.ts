/// <reference path="../gte/GTE.ts" />

export class MusicComponent {
    musicElements: HTMLAudioElement[];
    currentPiece: number;
    lastPiece: number;
    private promises: any[];
    constructor() {
        this.musicElements = [];
        this.musicElements.push(document.createElement("audio"));
        this.musicElements.push(document.createElement("audio"));
        this.musicElements[0].src = "assets/music/1hgj153.mp3";
        this.musicElements[1].src = "assets/music/oceanwaves.mp3";
        this.promises = [null, null];
        this.musicElements[0].pause();
        this.musicElements[1].pause();
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
