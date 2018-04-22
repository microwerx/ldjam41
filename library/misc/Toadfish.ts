// Toadfish Library
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
/// <reference path="./gte/GTE.ts" />

class Toadfish
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
