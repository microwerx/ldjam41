// Fluxions WebGL Library
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


class MatrixStack {
    private _matrix: Array<Matrix4> = [Matrix4.makeIdentity()];

    constructor() { }

    Push() {
        this._matrix.push(this.m);
    }

    Pop() {
        if (this.length == 1) return;
        this._matrix.pop();
    }

    toColMajorArray(): Array<number> {
        return this.m.toColMajorArray();
    }

    toRowMajorArray(): Array<number> {
        return this.m.toRowMajorArray();
    }

    get empty(): boolean { return this._matrix.length == 0; }
    get length(): number { return this._matrix.length; }
    get m(): Matrix4 {
        if (!this.empty) {
            return this._matrix[this._matrix.length - 1];
        }
        return Matrix4.makeIdentity();
    }
}