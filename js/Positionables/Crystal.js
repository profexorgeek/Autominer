class Crystal extends Sprite {

    target;
    collectible = true;

    constructor() {
        super('content/spritesheet.png');

        this.frame = new Frame(16, 32, 16, 16);
        this.velocity.rotation = MathUtil.randomInRange(-8, 8);
        this.collision.radius = 4;
        this.drag = 0.1;
    }

    update() {
        super.update();

        if(this.target != null && (this.target.cargoPercent == 1 || this.target.destroyed)) {
            this.target = null;
        }

        if(this.target instanceof Positionable) {
            this.rotation = MathUtil.angleTo(this.position, this.target.position);
            this.velocity.x = this.target.velocity.x + this.target.x - this.x;
            this.velocity.y = this.target.velocity.y + this.target.y - this.y;
        }
    }
}