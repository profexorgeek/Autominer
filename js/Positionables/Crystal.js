class Crystal extends Sprite {

    target;

    constructor() {
        super('content/spritesheet.png');

        this.frame = new Frame(16, 32, 16, 16);
        this.velocity.rotation = MathUtil.randomInRange(-8, 8);
    }

    update() {
        super.update();

        if(this.target instanceof Positionable && !this.target.destroyed) {
            this.rotation = MathUtil.angleTo(this.position, this.target.position);
            this.velocity.x = this.target.x - this.x;
            this.velocity.y = this.target.y - this.y;
        }
    }
}