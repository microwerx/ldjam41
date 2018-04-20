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
/// <reference path="./Fluxions.ts" />

class FBO {
    private _fbo: WebGLFramebuffer;
    private _colorTexture: WebGLTexture | null = null;
    private _depthTexture: WebGLTexture | null = null;
    private _colorType: number = 0;
    private _complete: boolean = false;
    private _colorUnit: number = -1;
    private _depthUnit: number = -1;
    private _savedViewport: Int32Array | undefined;
    public clearColor: Vector3 = Vector3.make(0.2, 0.2, 0.2);
    private _powerOfTwoDimensions: Vector2;

    get complete(): boolean { return this._complete; }
    get dimensions(): Vector2 { return Vector2.make(this.width, this.height); }

    constructor(private _renderingContext: RenderingContext,
        readonly depth: boolean, readonly color: boolean,
        readonly width: number = 512, readonly height: number = 512, readonly colorType: number) {
        let gl = _renderingContext.gl;
        let fbo = gl.createFramebuffer();
        if (fbo) {
            this._fbo = fbo;
        }
        else {
            throw "Unable to create FBO"
        }
        width = Math.pow(2.0, Math.floor(Math.log2(width)) + 1);
        height = Math.pow(2.0, Math.floor(Math.log2(height)) + 1);
        this._powerOfTwoDimensions = Vector2.make(
            this.width, this.height
        );
        
        if (colorType == 0) this._colorType = gl.UNSIGNED_BYTE;
        else if (colorType == gl.FLOAT) this._colorType = gl.FLOAT;
        else if (colorType == gl.UNSIGNED_BYTE) this._colorType = gl.UNSIGNED_BYTE;
        else this._colorType = gl.FLOAT;

        this.make();
    }

    make() {
        let gl = this._renderingContext.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo);
        gl.activeTexture(gl.TEXTURE0);

        if (this.color && !this._colorTexture) {
            this._colorTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this._colorTexture);
            // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
            //     this._powerOfTwoDimensions.x, this._powerOfTwoDimensions.y, 0, gl.RGBA, this._colorType, null);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
                 this.width, this.height, 0, gl.RGBA, this._colorType, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0,
                gl.TEXTURE_2D, this._colorTexture, 0);
        }

        if (this.depth && !this._depthTexture) {
            this._depthTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this._depthTexture);
            // gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT,
            //     this._powerOfTwoDimensions.x, this._powerOfTwoDimensions.y, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT,
                this.width, this.height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT,
                gl.TEXTURE_2D, this._depthTexture, 0);
        }

        if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
            this._complete = false;
            hflog.error("Unable to create a complete framebuffer");
            hflog.error("---------------------------------------");
        } else {
            this._complete = true;
            hflog.log("Framebuffer is okay! size is " + this.width + "x" + this.height + " texture: " +
                this._powerOfTwoDimensions.x + "x" + this._powerOfTwoDimensions.y);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    use(clearScreen: boolean = true, disableColorWrites: boolean = false) {
        let gl = this._renderingContext.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._fbo);
        if (disableColorWrites)
            gl.colorMask(false, false, false, false);
        this._savedViewport = gl.getParameter(gl.VIEWPORT);
        gl.viewport(0, 0, this.width, this.height);
        if (clearScreen) {
            gl.clearColor(this.clearColor.x, this.clearColor.y, this.clearColor.z, 1.0);
            let bits = 0;
            if (this.color) bits |= gl.COLOR_BUFFER_BIT;
            if (this.depth) bits |= gl.DEPTH_BUFFER_BIT;
            gl.clear(bits);
        }
    }

    restore() {
        let gl = this._renderingContext.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        if (this.color && this._colorTexture) {
            gl.bindTexture(gl.TEXTURE_2D, this._colorTexture);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }

        gl.colorMask(true, true, true, true);
        if (this._savedViewport) {
            gl.viewport(
                this._savedViewport[0],
                this._savedViewport[1],
                this._savedViewport[2],
                this._savedViewport[3]);
            this._savedViewport = undefined;
        }
    }

    bindTextures(colorUnit: number = 15, depthUnit: number = 16) {
        let gl = this._renderingContext.gl;
        this._colorUnit = colorUnit;
        this._depthUnit = depthUnit;
        if (this._colorUnit >= 0) {
            gl.activeTexture(this._colorUnit + gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this._colorTexture);
        }
        if (this._depthUnit >= 0) {
            gl.activeTexture(this._depthUnit + gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this._depthTexture);
        }
        gl.activeTexture(gl.TEXTURE0);
    }

    unbindTextures() {
        let gl = this._renderingContext.gl;
        if (this._colorUnit >= 0) {
            gl.activeTexture(this._colorUnit + gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            this._colorUnit = -1;
        }
        if (this._depthUnit >= 0) {
            gl.activeTexture(this._depthUnit + gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            this._depthUnit = -1;
        }
        gl.activeTexture(gl.TEXTURE0);
    }
}