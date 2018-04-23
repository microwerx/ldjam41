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
/// <reference path="Sprite.ts" />

class GraphicsComponent {
    private divElement_: HTMLDivElement;
    private canvasElement_: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    OAM: Sprite[];
    sprites: HTMLImageElement;
    spriteImages: ImageData[] = [];

    private _spritesLoaded: boolean = false;
    private _fontPixelHeight: number = 0;
    private _fontPixelHeightOver2: number = 0;
    private _fontPixelSlantAdjust: number = 0;

    private _tiles: number[] = [0];
    private _tileOffsets: Vector2[] = [];
    private _cols: number = 1;
    private _rows: number = 1;
    private _layers: number = 1;
    private _layerstride: number = 1;
    private _stride: number = 1;

    resizeTiles(cols: number, rows: number, layers: number) {
        cols = GTE.clamp(cols | 0, 1, 256);
        rows = GTE.clamp(rows | 0, 1, 256);
        layers = GTE.clamp(layers | 0, 1, 8);
        this._cols = cols;
        this._rows = rows;
        this._layers = layers;
        this._tiles.length = cols * rows * layers;
        this._tiles.fill(0);
        this._layerstride = cols * rows;
        this._stride = cols;
        for (let i = 0; i < this._tiles.length; i++) {
            if (Math.random() < 0.1)
                this._tiles[i] = (Math.random() * 15.999) | 0;
        }
    }

    setTile(col: number, row: number, layer: number, tile: number) {
        let i = this._layerstride * layer + this._stride * row + col;
        this._tiles[i] = GTE.clamp(tile, 0, 255);
    }

    drawTiles() {
        let twidth = 32;
        let theight = 32;

        for (let layer = 0; layer < this._layers; layer++) {
            let x = - layer * this.XOR.t1 * 10.0;
            let y = 0;
            for (let row = 0; row < this._rows; row++) {
                for (let col = 0; col < this._cols; col++) {
                    let i = this._layerstride * layer + this._stride * row + col;
                    let tile = this._tiles[i];
                    if (tile == 0 && layer != 0) continue;
                    if (x + col * twidth > this.width) break;
                    if (tile > 0 && tile < this._tiles.length) {
                        this.drawSprite(tile, x + col * twidth, y + row * theight);
                    }
                }
                if (y * row * theight > this.height) break;
            }
        }
    }

    constructor(public XOR: LibXOR, readonly width: number, readonly height: number) {
        let e = document.getElementById('graphicsdiv');
        if (!e) {
            this.divElement_ = document.createElement('div');
            this.divElement_.id = 'graphicsdiv';
            this.divElement_.style.textAlign = 'center';
            document.body.appendChild(this.divElement_);
        } else {
            this.divElement_ = <HTMLDivElement>e;
        }

        e = document.getElementById('graphicscanvas');
        if (!e) {
            this.canvasElement_ = document.createElement('canvas');
            this.canvasElement_.id = 'graphicscanvas';
            this.divElement_.appendChild(this.canvasElement_);
        } else {
            this.canvasElement_ = <HTMLCanvasElement>e;
        }
        this.canvasElement_.width = this.width;
        this.canvasElement_.height = this.height;

        let ctx2d = this.canvasElement_.getContext("2d");
        if (!ctx2d) throw "Fatal error, no 2d canvas";
        this.context = ctx2d;
        this.context.imageSmoothingEnabled = false;
        this.canvasElement_.setAttribute('cssText', "image-rendering: pixelated;");
        //this.context.globalCompositeOperation = "source-in";

        this.OAM = [];

        this.sprites = new Image();
        this.setFont('Salsbury,EssentialPragmataPro', 32);
    }

    get spritesLoaded() {
        return this._spritesLoaded;
    }

    get fontHeight() { return this._fontPixelHeight; }

    setFont(fontName: string, pixelHeight: number) {
        this._fontPixelHeight = pixelHeight;
        this._fontPixelHeightOver2 = pixelHeight / 2.0;
        this._fontPixelSlantAdjust = pixelHeight * Math.sin(Math.PI / 18) | 0;
        this.context.font = pixelHeight.toString() + 'px ' + fontName + ',fixed';
    }

    clearScreen(color: string | CanvasGradient | CanvasPattern | null = null) {
        if (color) {
            this.context.fillStyle = color || "black";
            this.context.fillRect(0, 0, this.width, this.height);
        } else {
            this.context.clearRect(0, 0, this.width, this.height);
        }
    }

    loadSprites(url: string) {
        let self = this;
        this._spritesLoaded = false;
        this.sprites = new Image();
        this.sprites.addEventListener("load", (e) => {
            self._spritesLoaded = true;
            this.extractSprites();
        });
        this.sprites.src = url;
    }

    resize(src: ImageData, dstw: number, dsth: number): ImageData {
        let dst = new ImageData(dstw, dsth);
        let scalex = src.width / dstw;
        let scaley = src.height / dsth;
        for (let dsty = 0; dsty < dsth; dsty++) {
            for (let dstx = 0; dstx < dstw; dstx++) {
                let srcx = GTE.clamp(Math.round(-scalex + dstx * scalex), 0, src.width - 1);
                let srcy = GTE.clamp(Math.round(-2 * scaley + dsty * scaley), 0, src.height - 1);
                let srcaddr = (srcy * src.width + srcx) << 2;
                let dstaddr = (dsty * dstw + dstx) << 2;
                dst.data[dstaddr + 0] = src.data[srcaddr + 0];
                dst.data[dstaddr + 1] = src.data[srcaddr + 1];
                dst.data[dstaddr + 2] = src.data[srcaddr + 2];
                dst.data[dstaddr + 3] = src.data[srcaddr + 3];
            }
        }
        return dst;
    }

    extractSprites() {
        let g = this.context;
        let cols = (this.sprites.width / 8) | 0;
        let rows = (this.sprites.height / 8) | 0;
        let c = document.createElement("canvas");
        c.width = this.sprites.width;
        c.height = this.sprites.height;
        let ctx = c.getContext("2d");
        if (!ctx) return;
        //ctx.globalCompositeOperation = "copy";
        ctx.drawImage(this.sprites, 0, 0);

        this.spriteImages = [];
        let self = this;
        let i = 0;
        this.spriteImages.length = cols * rows;
        for (let y = 0; y < this.sprites.height; y += 8) {
            for (let x = 0; x < this.sprites.width; x += 8) {
                let src = ctx.getImageData(x, y, 8, 8);
                let dst = this.resize(src, 32, 32);
                this.spriteImages[i] = dst;
                i++;
            }
        }

        this.spriteCoords.length = cols * rows;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                this.spriteCoords[y * cols + x] = [x * 8, y * 8];
            }
        }
    }

    setText(color: string, alignment: string) {
        let g = this.context;
        g.fillStyle = color;
        g.textAlign = alignment;
    }

    putText(text: string, x: number, y: number) {
        this.context.fillText(text, x, y + this._fontPixelHeight);
    }

    putTextAligned(text: string, color: string, xloc: number, yloc: number, xo: number, yo: number) {
        let x = 0;
        let halign = "left";
        let y = 0;
        let valign = "top";
        if (xloc == 0) {
            x += this.width / 2;
            halign = "center";
        }
        else if (xloc > 0) {
            x = this.width - this._fontPixelSlantAdjust;
            halign = "right";
        }
        if (yloc == 0) {
            y = this.height / 2 - this._fontPixelHeightOver2;
        }
        else if (yloc > 0) {
            y = this.height - this._fontPixelHeight - this._fontPixelSlantAdjust;
        }
        x += xo;
        y += yo;
        this.setText('black', halign);
        this.putText(text, x + 2, y + 2);
        this.setText(color, halign);
        this.putText(text, x, y);
    }

    putSprite(index: number, x: number, y: number) {
        let g = this.context;
        let cols = (this.sprites.width / 8) | 0;
        let sx = index % cols;
        let sy = (index / cols) | 0;
        g.putImageData(this.spriteImages[index], x, y);
        // if (this.spriteImages[index]) {
        //     g.drawImage(this.spriteImages[index], x, y);
        // }
        //g.drawImage(this.sprites, sx * 8, sy * 8, 8, 8, x, y, 32, 32);
    }

    private spriteCoords: [number, number][] = [];
    drawSprite(index: number, x: number, y: number) {
        let g = this.context;
        let sx = this.spriteCoords[index][0];
        let sy = this.spriteCoords[index][1];
        g.drawImage(this.sprites, sx, sy, 8, 8, x - 16, y - 16, 32, 32);
    }

    drawSprites() {
        for (let sprite of this.OAM) {
            if (sprite.enabled)
                this.drawSprite(sprite.index, sprite.position.x + sprite.offset.x, sprite.position.y + sprite.offset.y);
        }
    }

    drawBox(x: number, y: number, color: string, size: number = 4) {
        let g = this.context;
        g.fillStyle = color || 'black';
        g.fillRect(x - (size / 2), y - (size / 2), size, size);
    }

    get canvas(): HTMLCanvasElement {
        return this.canvasElement_;
    }

    get hidden(): boolean {
        return this.canvasElement_.hidden;
    }

    focus() {
        if (this.canvasElement_) this.canvasElement_.focus();
    }

    hide() {
        this.divElement_.hidden = true;
    }

    show() {
        this.divElement_.hidden = false;
    }
}
