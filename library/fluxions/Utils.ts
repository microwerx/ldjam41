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

namespace Utils {
    // return last part of the url name ignoring possible ending slash
    export function GetURLResource(url: string): string {
        let parts = url.split('/');
        let lastSection = parts.pop() || parts.pop();
        if (lastSection) {
            return lastSection;
        }
        else {
            return "unknown";
        }
    }

    export function GetURLPath(url: string): string {
        let parts = url.split('/');
        if (!parts.pop()) parts.pop();
        let path = parts.join("/") + "/";
        if (path) {
            return path;
        }
        else {
            return "";
        }
    }

    export function IsExtension(sourceString: string, extensionWithDot: string): boolean {
        let start = sourceString.length - extensionWithDot.length - 1;
        if (start >= 0 && sourceString.substr(start, extensionWithDot.length) == extensionWithDot) {
            return true;
        }
        return false;
    }

    export function GetExtension(sourceString: string): string {
        let position = sourceString.lastIndexOf(".");
        if (position >= 0) {
            return sourceString.substr(position + 1).toLowerCase();
        }
        return "";
    }

    export class TextFileLoader {
        private _loaded: boolean = false;
        private _failed: boolean = false;
        public data: string = "";
        public name: string;
        get loaded(): boolean { return this._loaded; }
        get failed(): boolean { return this._failed; }

        constructor(url: string, private callbackfn: (data: string, name: string, parameter: number) => void, parameter: number = 0) {
            this.name = GetURLResource(url);
            let self = this;
            let xhr = new XMLHttpRequest();
            xhr.addEventListener("load", (e) => {
                if (!xhr.responseText) {
                    self._failed = true;
                    self.data = "unknown";
                }
                else {
                    self.data = xhr.responseText;
                }
                self._loaded = true;
                callbackfn(self.data, self.name, parameter);
            });
            xhr.addEventListener("abort", (e) => {
                self._failed = true;
                console.error("unable to GET " + url);
            });
            xhr.addEventListener("error", (e) => {
                self._failed = true;
                console.error("unable to GET " + url);
            });
            xhr.open("GET", url);
            xhr.send();
        }
    }

    export class ImageFileLoader {
        private _loaded: boolean = false;
        private _failed: boolean = false;
        public image: HTMLImageElement = new Image();
        public name: string;
        get loaded(): boolean { return this._loaded; }
        get failed(): boolean { return this._failed; }

        constructor(url: string, private callbackfn: (data: HTMLImageElement, name: string, parameter: number) => void, parameter: number = 0) {
            this.name = GetURLResource(url);
            let self = this;
            let ajax = new XMLHttpRequest();
            this.image.addEventListener("load", (e) => {
                self._loaded = true;
                callbackfn(self.image, this.name, parameter);
            });
            this.image.addEventListener("error", (e) => {
                self._failed = true;
                console.error("unable to GET " + url);
            });
            this.image.addEventListener("abort", (e) => {
                self._failed = true;
                console.error("unable to GET " + url);
            });
            this.image.src = url;
        }
    }

    export function niceTimestamp(timestamp: number): string {
        return (Math.round(1000.0 * timestamp) / 1000.0).toString() + "ms";
    }

    export function niceFramesPerSecond(t0: number, t1: number): string {
        let s = (t1 - t0);
        return Math.round(1.0 / s).toString() + "fps";
    }

    export function niceDuration(t0: number, t1: number): string {
        return ((Math.round(1000.0 * (t1 - t0))) / 1000.0).toString() + "ms";
    }

    export function round3(x: number): number {
        return Math.round(x * 1000.0) / 1000.0;
    }

    export function round3str(x: number): string {
        return (Math.round(x * 1000.0) / 1000.0).toString();
    }

    export function niceVector(v: Vector3): string {
        return "(" + round3str(v.x) + ", " + round3str(v.y) + ", " + round3str(v.z) + ")"
    }

    export function niceNumber(x: number, digits: number): string {
        let t = Math.pow(10.0, digits);
        return (Math.round(x * t) / t).toString();
    }

    export function niceMatrix4(m: Matrix4): string {
        return "("
            + round3str(m.m11) + ", " + round3str(m.m12) + ", " + round3str(m.m13) + ", " + round3str(m.m14) + ", "
            + round3str(m.m21) + ", " + round3str(m.m22) + ", " + round3str(m.m23) + ", " + round3str(m.m24) + ", "
            + round3str(m.m31) + ", " + round3str(m.m32) + ", " + round3str(m.m33) + ", " + round3str(m.m34) + ", "
            + round3str(m.m41) + ", " + round3str(m.m42) + ", " + round3str(m.m43) + ", " + round3str(m.m44)
            + ")";
    }

    export function SeparateCubeMapImages(image: HTMLImageElement, images: null[] | ImageData[]): void {
        if (image.width != 6 * image.height) {
            return;
        }

        // images are laid out: +X, -X, +Y, -Y, +Z, -Z
        let canvas = document.createElement("canvas");
        if (canvas) {
            canvas.width = image.width;
            canvas.height = image.height;
            let ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(image, 0, 0);

                for (let i = 0; i < 6; i++) {
                    images[i] = ctx.getImageData(i * image.height, 0, image.height, image.height);
                }
            }
        }
    }

    export class TextParser {
        readonly lines: Array<string[]> = [];

        constructor(data: string) {
            // split using regex any sequence of 1 or more newlines or carriage returns
            let lines = data.split(/[\n\r]+/);
            for (let line of lines) {
                let unfilteredTokens = line.split(/\s+/);
                if (unfilteredTokens.length > 0 && unfilteredTokens[0][0] == '#') continue;
                let tokens: string[] = [];
                for (let t of unfilteredTokens) {
                    if (t.length > 0) {
                        tokens.push(t);
                    }
                }
                if (tokens.length == 0) {
                    continue;
                }

                this.lines.push(tokens);
            }
        }

        static MakeIdentifier(token: string): string {
            if (token.length == 0)
                return "unknown";
            return token.replace(/[^\w]+/, "_");
        }

        static ParseIdentifier(tokens: string[]): string {
            if (tokens.length >= 2)
                return tokens[1].replace(/[^\w]+/, "_");
            return "unknown";
        }

        static ParseFloat(tokens: string[]): number {
            let x = (tokens.length >= 2) ? parseFloat(tokens[1]) : 0.0;
            return x;
        }

        static ParseVector(tokens: string[]): Vector3 {
            let x: number = (tokens.length >= 2) ? parseFloat(tokens[1]) : 0.0;
            let y: number = (tokens.length >= 3) ? parseFloat(tokens[2]) : 0.0;
            let z: number = (tokens.length >= 4) ? parseFloat(tokens[3]) : 0.0;
            return new Vector3(x, y, z);
        }

        static ParseArray(tokens: string[]): number[] {
            let v: number[] = new Array(tokens.length - 1);
            for (let i = 1; i < tokens.length; i++) {
                v[i] = parseFloat(tokens[i]);
            }
            return v;
        }

        static ParseMatrix(tokens: string[]): Matrix4 {
            if (tokens.length > 16 && tokens[0] == "transform") {
                let m = new Matrix4(
                    parseFloat(tokens[1]),
                    parseFloat(tokens[2]),
                    parseFloat(tokens[3]),
                    parseFloat(tokens[4]),
                    parseFloat(tokens[5]),
                    parseFloat(tokens[6]),
                    parseFloat(tokens[7]),
                    parseFloat(tokens[8]),
                    parseFloat(tokens[9]),
                    parseFloat(tokens[10]),
                    parseFloat(tokens[11]),
                    parseFloat(tokens[12]),
                    parseFloat(tokens[13]),
                    parseFloat(tokens[14]),
                    parseFloat(tokens[15]),
                    parseFloat(tokens[16]),
                ).asTranspose();
                return m;
            }
            return Matrix4.makeZero();
        }

        static ParseFaceIndices(_token: string): Array<number> {
            // index 0 is position
            // index 1 is texcoord
            // index 2 is normal
            let indices: Array<number> = [-1, -1, -1];
            let token = _token.replace("//", "/0/");
            let tokens = token.split("/");
            if (tokens.length >= 1) {
                indices[0] = parseInt(tokens[0]) - 1;
            }
            if (tokens.length == 2) {
                indices[2] = parseInt(tokens[1]) - 1;
            } else if (tokens.length == 3) {
                indices[1] = parseInt(tokens[1]) - 1;
                indices[2] = parseInt(tokens[2]) - 1;
            }
            return indices;
        }

        static ParseFace(tokens: string[]): number[] {
            let indices: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            if (tokens.length < 4) {
                return indices;
            }
            let v1: Array<number> = TextParser.ParseFaceIndices(tokens[1]);
            let v2: Array<number> = TextParser.ParseFaceIndices(tokens[2]);
            let v3: Array<number> = TextParser.ParseFaceIndices(tokens[3]);

            return [...v1, ...v2, ...v3];
        }
    } // class TextParser    

    export class ShaderLoader {
        private vertLoaded: boolean = false;
        private fragLoaded: boolean = false;
        private vertFailed: boolean = false;
        private fragFailed: boolean = false;
        public vertShaderSource: string = "";
        public fragShaderSource: string = "";

        get failed(): boolean { return this.vertFailed || this.fragFailed; }
        get loaded(): boolean { return this.vertLoaded && this.fragLoaded; }

        constructor(public vertShaderUrl: string, public fragShaderUrl: string, private callbackfn: (vertShaderSource: string, fragShaderSource: string) => void) {
            let self = this;
            let vertXHR: XMLHttpRequest = new XMLHttpRequest();
            vertXHR.addEventListener("load", (e) => {
                self.vertShaderSource = vertXHR.responseText;
                self.vertLoaded = true;
                if (this.loaded) {
                    self.callbackfn(self.vertShaderSource, self.fragShaderSource);
                }
            });
            vertXHR.addEventListener("abort", (e) => {
                self.vertFailed = true;
                console.error("unable to GET " + vertShaderUrl);
            });
            vertXHR.addEventListener("error", (e) => {
                self.vertFailed = true;
                console.error("unable to GET " + vertShaderUrl);
            })
            vertXHR.open("GET", vertShaderUrl);
            vertXHR.send();

            let fragXHR: XMLHttpRequest = new XMLHttpRequest();
            fragXHR.addEventListener("load", (e) => {
                self.fragShaderSource = fragXHR.responseText;
                self.fragLoaded = true;
                if (this.loaded) {
                    self.callbackfn(self.vertShaderSource, self.fragShaderSource);
                }
            });
            fragXHR.addEventListener("abort", (e) => {
                self.fragFailed = true;
                console.error("unable to GET " + fragShaderUrl);
            })
            fragXHR.addEventListener("error", (e) => {
                self.vertFailed = true;
                console.error("unable to GET " + fragShaderUrl);
            })
            fragXHR.open("GET", fragShaderUrl);
            fragXHR.send();
        }
    }


    export class GLTypeInfo {
        constructor(public type: number, public baseType: number, public components: number, public sizeOfType: number) { }

        CreateArray(size: number): Float32Array | Int32Array | Int16Array | Uint32Array | Uint16Array | Uint8ClampedArray | null {
            switch (this.type) {
                case WebGLRenderingContext.FLOAT:
                case WebGLRenderingContext.FLOAT_VEC2:
                case WebGLRenderingContext.FLOAT_VEC3:
                case WebGLRenderingContext.FLOAT_VEC4:
                case WebGLRenderingContext.FLOAT_MAT2:
                case WebGLRenderingContext.FLOAT_MAT3:
                case WebGLRenderingContext.FLOAT_MAT4:
                    return new Float32Array(size);
                case WebGLRenderingContext.INT:
                case WebGLRenderingContext.INT_VEC2:
                case WebGLRenderingContext.INT_VEC3:
                case WebGLRenderingContext.INT_VEC4:
                    return new Int32Array(size);
                case WebGLRenderingContext.SHORT:
                    return new Int16Array(size);
                case WebGLRenderingContext.UNSIGNED_INT:
                    return new Uint32Array(size);
                case WebGLRenderingContext.UNSIGNED_SHORT:
                    return new Uint16Array(size);
                case WebGLRenderingContext.UNSIGNED_BYTE:
                    return new Uint8ClampedArray(size);
                case WebGLRenderingContext.BOOL:
                    return new Uint32Array(size);
            }
            return null;
        }
    }

    export var WebGLTypeInfo: Map<number, GLTypeInfo> = new Map<number, GLTypeInfo>([
        [WebGLRenderingContext.BYTE, new GLTypeInfo(WebGLRenderingContext.BYTE, WebGLRenderingContext.BYTE, 1, 1)],
        [WebGLRenderingContext.UNSIGNED_BYTE, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_BYTE, WebGLRenderingContext.UNSIGNED_BYTE, 1, 1)],
        [WebGLRenderingContext.SHORT, new GLTypeInfo(WebGLRenderingContext.SHORT, WebGLRenderingContext.SHORT, 1, 2)],
        [WebGLRenderingContext.UNSIGNED_SHORT, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_SHORT, WebGLRenderingContext.UNSIGNED_SHORT, 1, 2)],
        [WebGLRenderingContext.INT, new GLTypeInfo(WebGLRenderingContext.INT, WebGLRenderingContext.INT, 1, 4)],
        [WebGLRenderingContext.UNSIGNED_INT, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        [WebGLRenderingContext.BOOL, new GLTypeInfo(WebGLRenderingContext.BOOL, WebGLRenderingContext.INT, 1, 4)],
        [WebGLRenderingContext.FLOAT, new GLTypeInfo(WebGLRenderingContext.FLOAT, WebGLRenderingContext.FLOAT, 1, 4)],
        [WebGLRenderingContext.FLOAT_VEC2, new GLTypeInfo(WebGLRenderingContext.FLOAT_VEC2, WebGLRenderingContext.FLOAT, 2, 4)],
        [WebGLRenderingContext.FLOAT_VEC3, new GLTypeInfo(WebGLRenderingContext.FLOAT_VEC3, WebGLRenderingContext.FLOAT, 3, 4)],
        [WebGLRenderingContext.FLOAT_VEC4, new GLTypeInfo(WebGLRenderingContext.FLOAT_VEC4, WebGLRenderingContext.FLOAT, 4, 4)],
        [WebGLRenderingContext.FLOAT_MAT2, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT2, WebGLRenderingContext.FLOAT, 4, 4)],
        [WebGLRenderingContext.FLOAT_MAT3, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT3, WebGLRenderingContext.FLOAT, 9, 4)],
        [WebGLRenderingContext.FLOAT_MAT4, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT4, WebGLRenderingContext.FLOAT, 16, 4)],
        // [WebGLRenderingContext.FLOAT_MAT2x3, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT2x3, WebGLRenderingContext.FLOAT, 6, 4)],
        // [WebGLRenderingContext.FLOAT_MAT2x4, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT2x4, WebGLRenderingContext.FLOAT, 8, 4)],
        // [WebGLRenderingContext.FLOAT_MAT3x2, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT3x2, WebGLRenderingContext.FLOAT, 6, 4)],
        // [WebGLRenderingContext.FLOAT_MAT3x4, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT3x4, WebGLRenderingContext.FLOAT, 12, 4)],
        // [WebGLRenderingContext.FLOAT_MAT4x2, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT4x2, WebGLRenderingContext.FLOAT, 8, 4)],
        // [WebGLRenderingContext.FLOAT_MAT4x3, new GLTypeInfo(WebGLRenderingContext.FLOAT_MAT4x3, WebGLRenderingContext.FLOAT, 12, 4)],
        // [WebGLRenderingContext.SAMPLER_1D, new GLTypeInfo(WebGLRenderingContext.SAMPLER_1D, WebGLRenderingContext.FLOAT, 1, 4)],
        [WebGLRenderingContext.SAMPLER_2D, new GLTypeInfo(WebGLRenderingContext.SAMPLER_2D, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.SAMPLER_3D, new GLTypeInfo(WebGLRenderingContext.SAMPLER_3D, WebGLRenderingContext.FLOAT, 1, 4)],
        [WebGLRenderingContext.SAMPLER_CUBE, new GLTypeInfo(WebGLRenderingContext.SAMPLER_CUBE, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.SAMPLER_1D_SHADOW, new GLTypeInfo(WebGLRenderingContext.SAMPLER_1D_SHADOW, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.SAMPLER_2D_SHADOW, new GLTypeInfo(WebGLRenderingContext.SAMPLER_2D_SHADOW, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.SAMPLER_2D_MULTISAMPLE, new GLTypeInfo(WebGLRenderingContext.SAMPLER_2D_MULTISAMPLE, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.SAMPLER_2D_MULTISAMPLE_ARRAY, new GLTypeInfo(WebGLRenderingContext.SAMPLER_2D_MULTISAMPLE_ARRAY, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.SAMPLER_1D_ARRAY, new GLTypeInfo(WebGLRenderingContext.SAMPLER_1D_ARRAY, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.SAMPLER_2D_ARRAY, new GLTypeInfo(WebGLRenderingContext.SAMPLER_2D_ARRAY, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.SAMPLER_1D_ARRAY_SHADOW, new GLTypeInfo(WebGLRenderingContext.SAMPLER_1D_ARRAY_SHADOW, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.SAMPLER_2D_ARRAY_SHADOW, new GLTypeInfo(WebGLRenderingContext.SAMPLER_2D_ARRAY_SHADOW, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.DOUBLE, new GLTypeInfo(WebGLRenderingContext.DOUBLE, WebGLRenderingContext.DOUBLE, 1, 8)],
        // [WebGLRenderingContext.DOUBLE_VEC2, new GLTypeInfo(WebGLRenderingContext.DOUBLE_VEC2, WebGLRenderingContext.DOUBLE, 2, 8)],
        // [WebGLRenderingContext.DOUBLE_VEC3, new GLTypeInfo(WebGLRenderingContext.DOUBLE_VEC3, WebGLRenderingContext.DOUBLE, 3, 8)],
        // [WebGLRenderingContext.DOUBLE_VEC4, new GLTypeInfo(WebGLRenderingContext.DOUBLE_VEC4, WebGLRenderingContext.DOUBLE, 4, 8)],
        // [WebGLRenderingContext.DOUBLE_MAT2, new GLTypeInfo(WebGLRenderingContext.DOUBLE_MAT2, WebGLRenderingContext.DOUBLE, 4, 8)],
        // [WebGLRenderingContext.DOUBLE_MAT3, new GLTypeInfo(WebGLRenderingContext.DOUBLE_MAT3, WebGLRenderingContext.DOUBLE, 9, 8)],
        // [WebGLRenderingContext.DOUBLE_MAT4, new GLTypeInfo(WebGLRenderingContext.DOUBLE_MAT4, WebGLRenderingContext.DOUBLE, 16, 8)],
        // [WebGLRenderingContext.DOUBLE_MAT2x3, new GLTypeInfo(WebGLRenderingContext.DOUBLE_MAT2x3, WebGLRenderingContext.DOUBLE, 6, 8)],
        // [WebGLRenderingContext.DOUBLE_MAT2x4, new GLTypeInfo(WebGLRenderingContext.DOUBLE_MAT2x4, WebGLRenderingContext.DOUBLE, 8, 8)],
        // [WebGLRenderingContext.DOUBLE_MAT3x2, new GLTypeInfo(WebGLRenderingContext.DOUBLE_MAT3x2, WebGLRenderingContext.DOUBLE, 6, 8)],
        // [WebGLRenderingContext.DOUBLE_MAT3x4, new GLTypeInfo(WebGLRenderingContext.DOUBLE_MAT3x4, WebGLRenderingContext.DOUBLE, 12, 8)],
        // [WebGLRenderingContext.DOUBLE_MAT4x2, new GLTypeInfo(WebGLRenderingContext.DOUBLE_MAT4x2, WebGLRenderingContext.DOUBLE, 8, 8)],
        // [WebGLRenderingContext.DOUBLE_MAT4x3, new GLTypeInfo(WebGLRenderingContext.DOUBLE_MAT4x3, WebGLRenderingContext.DOUBLE, 12, 8)],
        // [WebGLRenderingContext.INT_SAMPLER_1D, new GLTypeInfo(WebGLRenderingContext.INT_SAMPLER_1D, WebGLRenderingContext.INT, 1, 4)],
        // [WebGLRenderingContext.INT_SAMPLER_2D, new GLTypeInfo(WebGLRenderingContext.INT_SAMPLER_2D, WebGLRenderingContext.INT, 1, 4)],
        // [WebGLRenderingContext.INT_SAMPLER_3D, new GLTypeInfo(WebGLRenderingContext.INT_SAMPLER_3D, WebGLRenderingContext.INT, 1, 4)],
        // [WebGLRenderingContext.INT_SAMPLER_CUBE, new GLTypeInfo(WebGLRenderingContext.INT_SAMPLER_CUBE, WebGLRenderingContext.INT, 1, 4)],
        // [WebGLRenderingContext.INT_SAMPLER_2D_MULTISAMPLE, new GLTypeInfo(WebGLRenderingContext.INT_SAMPLER_2D_MULTISAMPLE, WebGLRenderingContext.INT, 1, 4)],
        // [WebGLRenderingContext.INT_SAMPLER_2D_MULTISAMPLE_ARRAY, new GLTypeInfo(WebGLRenderingContext.INT_SAMPLER_2D_MULTISAMPLE_ARRAY, WebGLRenderingContext.INT, 1, 4)],
        // [WebGLRenderingContext.INT_SAMPLER_1D_ARRAY, new GLTypeInfo(WebGLRenderingContext.INT_SAMPLER_1D_ARRAY, WebGLRenderingContext.INT, 1, 4)],
        // [WebGLRenderingContext.INT_SAMPLER_2D_ARRAY, new GLTypeInfo(WebGLRenderingContext.INT_SAMPLER_2D_ARRAY, WebGLRenderingContext.INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_SAMPLER_1D, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_SAMPLER_1D, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_SAMPLER_2D, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_SAMPLER_2D, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_SAMPLER_3D, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_SAMPLER_3D, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_SAMPLER_CUBE, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_SAMPLER_CUBE, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_SAMPLER_2D_MULTISAMPLE, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_SAMPLER_2D_MULTISAMPLE, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_SAMPLER_2D_MULTISAMPLE_ARRAY, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_SAMPLER_2D_MULTISAMPLE_ARRAY, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_SAMPLER_1D_ARRAY, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_SAMPLER_1D_ARRAY, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_SAMPLER_2D_ARRAY, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_SAMPLER_2D_ARRAY, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        // [WebGLRenderingContext.IMAGE_1D, new GLTypeInfo(WebGLRenderingContext.IMAGE_1D, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.IMAGE_2D, new GLTypeInfo(WebGLRenderingContext.IMAGE_2D, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.IMAGE_3D, new GLTypeInfo(WebGLRenderingContext.IMAGE_3D, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.IMAGE_2D_RECT, new GLTypeInfo(WebGLRenderingContext.IMAGE_2D_RECT, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.IMAGE_CUBE, new GLTypeInfo(WebGLRenderingContext.IMAGE_CUBE, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.IMAGE_BUFFER, new GLTypeInfo(WebGLRenderingContext.IMAGE_BUFFER, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.IMAGE_1D_ARRAY, new GLTypeInfo(WebGLRenderingContext.IMAGE_1D_ARRAY, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.IMAGE_2D_ARRAY, new GLTypeInfo(WebGLRenderingContext.IMAGE_2D_ARRAY, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.IMAGE_2D_MULTISAMPLE, new GLTypeInfo(WebGLRenderingContext.IMAGE_2D_MULTISAMPLE, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.IMAGE_2D_MULTISAMPLE_ARRAY, new GLTypeInfo(WebGLRenderingContext.IMAGE_2D_MULTISAMPLE_ARRAY, WebGLRenderingContext.FLOAT, 1, 4)],
        // [WebGLRenderingContext.INT_IMAGE_1D, new GLTypeInfo(WebGLRenderingContext.INT_IMAGE_1D, WebGLRenderingContext.INT, 1, 4)],
        // [WebGLRenderingContext.INT_IMAGE_2D, new GLTypeInfo(WebGLRenderingContext.INT_IMAGE_2D, WebGLRenderingContext.INT, 1, 4)],
        // [WebGLRenderingContext.INT_IMAGE_3D, new GLTypeInfo(WebGLRenderingContext.INT_IMAGE_3D, WebGLRenderingContext.INT, 1, 4)],
        // [WebGLRenderingContext.INT_IMAGE_2D_RECT, new GLTypeInfo(WebGLRenderingContext.INT_IMAGE_2D_RECT, WebGLRenderingContext.INT, 1, 4)],
        // [WebGLRenderingContext.INT_IMAGE_CUBE, new GLTypeInfo(WebGLRenderingContext.INT_IMAGE_CUBE, WebGLRenderingContext.INT, 1, 4)],
        // [WebGLRenderingContext.INT_IMAGE_BUFFER, new GLTypeInfo(WebGLRenderingContext.INT_IMAGE_BUFFER, WebGLRenderingContext.INT, 1, 4)],
        // [WebGLRenderingContext.INT_IMAGE_1D_ARRAY, new GLTypeInfo(WebGLRenderingContext.INT_IMAGE_1D_ARRAY, WebGLRenderingContext.INT, 1, 4)],
        // [WebGLRenderingContext.INT_IMAGE_2D_ARRAY, new GLTypeInfo(WebGLRenderingContext.INT_IMAGE_2D_ARRAY, WebGLRenderingContext.INT, 1, 4)],
        // [WebGLRenderingContext.INT_IMAGE_2D_MULTISAMPLE, new GLTypeInfo(WebGLRenderingContext.INT_IMAGE_2D_MULTISAMPLE, WebGLRenderingContext.INT, 1, 4)],
        // [WebGLRenderingContext.INT_IMAGE_2D_MULTISAMPLE_ARRAY, new GLTypeInfo(WebGLRenderingContext.INT_IMAGE_2D_MULTISAMPLE_ARRAY, WebGLRenderingContext.INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_IMAGE_1D, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_IMAGE_1D, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_IMAGE_2D, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_IMAGE_2D, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_IMAGE_3D, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_IMAGE_3D, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_IMAGE_2D_RECT, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_IMAGE_2D_RECT, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_IMAGE_CUBE, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_IMAGE_CUBE, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_IMAGE_BUFFER, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_IMAGE_BUFFER, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_IMAGE_1D_ARRAY, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_IMAGE_1D_ARRAY, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_IMAGE_2D_ARRAY, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_IMAGE_2D_ARRAY, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_IMAGE_2D_MULTISAMPLE, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_IMAGE_2D_MULTISAMPLE, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_IMAGE_2D_MULTISAMPLE_ARRAY, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_IMAGE_2D_MULTISAMPLE_ARRAY, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
        // [WebGLRenderingContext.UNSIGNED_INT_ATOMIC_COUNTER, new GLTypeInfo(WebGLRenderingContext.UNSIGNED_INT_ATOMIC_COUNTER, WebGLRenderingContext.UNSIGNED_INT, 1, 4)],
    ]);
}