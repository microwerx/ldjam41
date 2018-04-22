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

class Sprite {
    index: number = 0;
    animframe: number = 0;
    offset: Vector2;
    position: Vector2;
    velocity: Vector2;
    refpoint: Vector2;
    random: number;
    timealive: number;
    enabled: boolean = false;
    alive: number = 1;
    type: number = 0;   // used for classifying the main sprite
    active: boolean = false;

    get x(): number { return this.position.x + this.offset.x; }
    get y(): number { return this.position.y + this.offset.y; }

    constructor(index: number) {
        this.index = index | 0;
        this.position = Vector2.make(0, 0);
        this.offset = Vector2.make(0, 0);
        this.velocity = Vector2.make(0, 0);
        this.refpoint = Vector2.make(0, 0);
        this.random = Math.random();
        this.timealive = 0.0;
        this.enabled = true;
        this.alive = 1;
        this.active = true;
    }

    reset(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
        this.offset.x = 0;
        this.offset.y = 0;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.refpoint.x = 0;
        this.refpoint.y = 0;
    }

    update(dt: number) {
        this.offset.x += this.velocity.x * dt;
        this.offset.y += this.velocity.y * dt;
    }

    move(dt: number) {
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
    }

    dirto(sprite: Sprite): Vector2 {
        return Sprite.DirTo(this, sprite);
    }

    distance(sprite: Sprite): number {
        return Sprite.Distance(this, sprite);
    }

    collides(sprite: Sprite, d: number): boolean {
        return Sprite.Collide(this, sprite, d);
    }

    static Distance(sprite1: Sprite, sprite2: Sprite) {
        if (!sprite1 || !sprite2) return 1e6;
        let dx = (sprite1.position.x + sprite1.offset.x) - (sprite2.position.x + sprite2.offset.x);
        let dy = (sprite1.position.y + sprite1.offset.y) - (sprite2.position.y + sprite2.offset.y);
        let d = Math.sqrt(dx * dx + dy * dy);
        return d;
    }

    static Collide(sprite1: Sprite, sprite2: Sprite, d: number) {
        if (Math.abs(sprite1.x - sprite2.x) > d) return false;
        if (Math.abs(sprite1.y - sprite2.y) > d) return false;
        return Sprite.Distance(sprite1, sprite2) < d ? true : false;
    }

    static DirTo(sprite1: Sprite, sprite2: Sprite): Vector2 {
        if (!sprite1 || !sprite2) return Vector2.make(0, 0);
        let dx = (sprite1.position.x + sprite1.offset.x) - (sprite2.position.x + sprite2.offset.x);
        let dy = (sprite1.position.y + sprite1.offset.y) - (sprite2.position.y + sprite2.offset.y);
        return Vector2.make(-dx, -dy);
    }
}
