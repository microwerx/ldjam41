

class AdventureGame
{
    sprites: [number, number][];
    constructor(public XOR: LibXOR) {
        this.sprites = CreateSprites();
    }

    update() {
        let t1 = this.XOR.t1;
    }

    draw(g: GraphicsComponent) {

    }

    draw2doverlay(g: GraphicsComponent) {

    }
}
