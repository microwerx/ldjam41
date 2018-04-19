/// <reference path="gte/GTE.ts" />
/// <reference path="Graphics.ts" />
/// <reference path="Input.ts" />
/// <reference path="Music.ts" />
/// <reference path="Timer.ts" />
/// <reference path="Toadfish.ts" />

export class LibXOR {
    divElement: HTMLDivElement;
    canvasElement: HTMLCanvasElement;
    Graphics: GraphicsComponent;
    Input: InputComponent;
    Music: MusicComponent;
    Timers: TimerComponent;
    Sounds: Toadfish;

    constructor(public width: number = 640, public height: number = 512) {
        this.divElement = document.createElement('div');
        this.divElement.id = 'game';
        this.divElement.style.textAlign = 'center';
        this.canvasElement = document.createElement('canvas');
        this.canvasElement.id = 'gamecanvas';
        this.canvasElement.width = this.width;
        this.canvasElement.height = this.height;
        document.body.appendChild(this.divElement);
        this.divElement.appendChild(this.canvasElement);
        this.Graphics = new GraphicsComponent(this.canvasElement);
        this.Input = new InputComponent();
        this.Music = new MusicComponent();
        this.Timers = new TimerComponent();
        this.Sounds = new Toadfish();
    }

    update(tInSeconds: number) {
        this.Timers.update(tInSeconds);
        this.Music.update(tInSeconds);
    }

    get dt(): number { return this.Timers.dt; }
    get t1(): number { return this.Timers.t1; }
    get t0(): number { return this.Timers.t0; }
}
