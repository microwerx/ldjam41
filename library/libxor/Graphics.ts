/// <reference path="../gte/GTE.ts" />

export class GraphicsComponent {
    readonly width: number;
    readonly height: number;
    context: CanvasRenderingContext2D;
    OAM: Sprite[];
    sprites: HTMLImageElement;

    private _spritesLoaded: boolean = false;
    private _fontPixelHeight: number = 0;
    private _fontPixelHeightOver2: number = 0;
    private _fontPixelSlantAdjust: number = 0;

    constructor(public canvasElement: HTMLCanvasElement) {
        let ctx2d = this.canvasElement.getContext("2d");
        if (!ctx2d) throw "Fatal error, no 2d canvas";
        this.canvasElement = canvasElement;
        this.width = canvasElement.width;
        this.height = canvasElement.height;
        this.context = ctx2d;
        this.context.imageSmoothingEnabled = false;
        this.canvasElement.setAttribute('cssText', "image-rendering: pixelated;");
        this.canvasElement.focus();

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

    clearScreen(color: string) {
        this.context.fillStyle = color || "black";
        this.context.fillRect(0, 0, this.width, this.height);
    }

    loadSprites(url: string) {
        let self = this;
        this._spritesLoaded = false;
        this.sprites = new Image();
        this.sprites.addEventListener("load", (e) => {
            self._spritesLoaded = true;
        });
        this.sprites.src = url;
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

    drawSprite(index: number, x: number, y: number) {
        let g = this.context;
        let cols = this.sprites.width / 8;
        let sx = index % cols;
        let sy = index / cols | 0;
        g.drawImage(this.sprites, sx * 8, sy * 8, 8, 8, x, y, 32, 32);
    }

    drawSprites() {
        for (let sprite of this.OAM) {
            if (sprite.enabled)
                this.drawSprite(sprite.index, sprite.x + sprite.offset.x, sprite.y + sprite.offset.y);
        }
    }
}
