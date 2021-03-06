// Fluxions Geometry Transformation Engine WebGL Library
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
/// <reference path="./Vector2.ts" />
/// <reference path="./Vector3.ts" />
/// <reference path="./Vector4.ts" />
/// <reference path="./Matrix2.ts" />
/// <reference path="./Matrix3.ts" />
/// <reference path="./Matrix4.ts" />

namespace GTE {
    export function oscillate(t: number, frequency: number = 1, phase: number = 0, amplitude: number = 1, offset: number = 0) {
        return Math.sin(frequency * t + phase) * amplitude + offset;
    }

    export function oscillateBetween(t: number, frequency: number = 1, phase: number = 0, lowerLimit: number = 0, upperLimit: number = 1) {
        return Math.sin(frequency * t + phase) * (upperLimit - lowerLimit) * 0.5 + lowerLimit;
    }

    export function random(a: number, b: number): number {
        return Math.random() * (b - a + 1) + a;
    }

    export function dice(sides: number): number {
        return (Math.random() * sides + 1) | 0;
    }

    export function rand01(): number {
        return Math.random();
    }

    export function rand1(): number {
        return Math.random() * 2 - 1;
    }

    export function clamp(x: number, a: number, b: number) {
        return x < a ? a : x > b ? b : x;
    }

    // 0 <= x <= 1, returns a blend of a and b
    export function lerp(a: number, b: number, x: number) {
        return (1 - x) * a + x * b;
    }

    // 0 <= x <= 1, returns a blend of a and b
    export function smoothstep(a: number, b: number, x: number) {
        if (x < 0) return a;
        if (x > 1) return b;
        let mix = x * x * (3 - 2 * x);
        return lerp(a, b, mix);
    }

    // 0 <= x <= 1, returns a blend of a and b
    export function smootherstep(a: number, b: number, x: number) {
        if (x < 0) return a;
        if (x > 1) return b;
        let mix = x * x * x * (x * (x * 6 - 15) + 10);
        return lerp(a, b, mix);
    }

    export function distancePointLine2(point: Vector2, linePoint1: Vector2, linePoint2: Vector2): number {
        let v = linePoint2.sub(linePoint1);
        let d = v.length();
        let n = Math.abs(v.y * point.x - v.x * point.y + linePoint2.x * linePoint1.y - linePoint2.y * linePoint1.x);
        if (d != 0.0) return n / d;
        return 1e30;
    }

    export function gaussian(x: number, center: number, sigma: number): number {
        let t = (x - center) / sigma;
        return 1 / (sigma * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * t * t);
        //return 1 / (Math.sqrt(2.0 * sigma * sigma * Math.PI)) * Math.exp(-Math.pow(x - center, 2) / (2 * sigma * sigma));
    }

    export function min3(a: number, b: number, c: number): number {
        return Math.min(Math.min(a, b), c);
    }

    export function max3(a: number, b: number, c: number): number {
        return Math.max(Math.max(a, b), c);
    }
}