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


class Texture {
    public id: string = "";

    constructor(private _renderingContext: RenderingContext,
        public name: string, public url: string, public target: number, public texture: WebGLTexture) {
    }

    makeDefaultTexture() {
        let gl = this._renderingContext.gl;
        gl.bindTexture(this.target, this.texture);
        if (this.target == gl.TEXTURE_2D) {
            let black = [0, 0, 0, 255];
            let white = [255, 255, 255, 255];
            let check = new Uint8ClampedArray([...black, ...white, ...white, ...black]);
            gl.texImage2D(this.target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(check, 2, 2));
        } else if (this.target == gl.TEXTURE_CUBE_MAP) {
            let red = new Uint8ClampedArray([255, 0, 0, 255]);
            let cyan = new Uint8ClampedArray([0, 255, 255, 255]);
            let green = new Uint8ClampedArray([0, 255, 0, 255]);
            let magenta = new Uint8ClampedArray([255, 0, 255, 255]);
            let blue = new Uint8ClampedArray([0, 0, 255, 255]);
            let yellow = new Uint8ClampedArray([255, 255, 0, 255]);
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(cyan, 1, 1));
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(red, 1, 1));
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(magenta, 1, 1));
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(green, 1, 1));
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(yellow, 1, 1));
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(blue, 1, 1));
        }
        gl.texParameteri(this.target, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(this.target, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(this.target, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(this.target, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.generateMipmap(this.target);
        gl.bindTexture(this.target, null);
    }
}
