/// <reference path="../gte/GTE.ts" />

export class Toadfish
{
    private _context: AudioContext;
    private _soundVolume: GainNode;
    private _sounds: Map<string, AudioBuffer> = new Map<string, AudioBuffer>();
    private _buffers: AudioBufferSourceNode[] = [];
    private _curbuffer:number = 0;

    constructor() {        
        this._context = new AudioContext();
        if (!this._context) { throw "Unable to use Web Audio API"; }
        this._soundVolume = this._context.createGain();
    }

    setSound(name: string, ab: AudioBuffer) {
        this._sounds.set(name, ab);
    }

    setVolume(amount: number) {
        this._soundVolume.gain.value = GTE.clamp(amount, 0, 1);
    }

    playSound(name: string) {
        let sfx = this._sounds.get(name);
        if (!sfx) return;
        // if (this._buffers.length < 32) {
        //     this._buffers.push(this._context.createBufferSource())
        //     this._curbuffer = this._buffers.length - 1;
        // }
        // else {
        //     this._curbuffer = (this._curbuffer + 1) % 32;
        // }
        let source = this._context.createBufferSource();//this._buffers[this._curbuffer];
        source.buffer = sfx;
        source.connect(this._context.destination);
        source.start(0);
    }

    queueSound(name: string, url: string) {
        let self = this;
        let request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";
        request.onload = (e) => {
            self._context.decodeAudioData(request.response, (buffer: AudioBuffer) => {
                self.setSound(name, buffer);
            });
        }
        request.send();
    }
}
