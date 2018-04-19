class Sprite {
    index: number = 0;
    x: number = 0;
    y: number = 0;
    offset: Vector2;
    position: Vector2;
    velocity: Vector2;
    random: number;
    timealive: number;
    enabled: boolean = false;
    alive: number = 1;
    active: boolean = false;
    constructor(index: number) {
        this.index = index | 0;
        this.position = Vector2.make(0, 0);
        this.offset = Vector2.make(0, 0);
        this.velocity = Vector2.make(0, 0);
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
    }

    update(dt: number) {
        this.offset.x += this.velocity.x * dt;
        this.offset.y += this.velocity.y * dt;
    }

    static Distance(sprite1: Sprite, sprite2: Sprite) {
        if (!sprite1 || !sprite2) return 1e6;
        let dx = (sprite1.x + sprite1.offset.x) - (sprite2.x + sprite2.offset.x);
        let dy = (sprite1.y + sprite1.offset.y) - (sprite2.y + sprite2.offset.y);
        return Math.sqrt(dx * dx + dy * dy);
    }

    static Collide(sprite1: Sprite, sprite2: Sprite, d: number) {
        return Sprite.Distance(sprite1, sprite2) < d ? true : false;
    }
}
