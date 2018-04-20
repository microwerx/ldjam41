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
/// <reference path="../Hatchetfish.ts" />
/// <reference path="../Toadfish.ts" />
/// <reference path="../fluxions/Fluxions.ts" />
/// <reference path="Graphics.ts" />
/// <reference path="Input.ts" />
/// <reference path="Music.ts" />
/// <reference path="Timer.ts" />

class LibXOR {
    Graphics: GraphicsComponent;
    Input: InputComponent;
    Music: MusicComponent;
    Timers: TimerComponent;
    Sounds: Toadfish;
    Fluxions: RenderingContext | null = null;
    Scenegraph: Scenegraph | null = null;

    constructor(readonly width: number = 640, readonly height: number = 512, readonly hasWebGLContext: boolean = false) {
        if (hasWebGLContext) {
            this.Fluxions = new RenderingContext(width, height);
            this.Scenegraph = new Scenegraph(this.Fluxions);
        }
        this.Graphics = new GraphicsComponent(this, width, height);

        this.Input = new InputComponent();
        this.Music = new MusicComponent();
        this.Timers = new TimerComponent();
        this.Sounds = new Toadfish();
    }

    update(tInSeconds: number) {
        this.Timers.update(tInSeconds);
        this.Music.update(tInSeconds);
        this.Input.update();
    }

    get dt(): number { return this.Timers.dt; }
    get t1(): number { return this.Timers.t1; }
    get t0(): number { return this.Timers.t0; }
}
