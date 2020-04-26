class Rock extends Sprite {

    #size = "large";
    health = 100;

    get size() {
        return this.#size;
    }

    set size(newSize) {
        this.#size = newSize;
        switch(newSize) {
            case "small":
                this.frame = new Frame(48, 16, 16, 16);
                this.collision.radius = 4;
                this.health = 20;
                this.drag = 0.5;
                break;
            case "medium":
                this.frame = new Frame(48, 0, 16, 16);
                this.collision.radius = 8;
                this.health = 50;
                this.drag = 1;
                break;
            default :
                this.frame = new Frame(16, 0, 32, 32);
                this.collision.radius = 16;
                this.#size = "large";
                this.health = 100;
                this.drag = 1.5;
                break;
        }
    }

    constructor() {
        super('content/spritesheet.png');

        this.size = "large";
        this.velocity.rotation = MathUtil.randomInRange(-3, 3);
        this.drag = 1;
    }

    update() {
        super.update();
        if(this.health <= 0) {
            this.destroy();
        }
    }

    takeDamage(amount) {
        this.health -= amount;
    }

    destroy() {
        if(this.size == "medium") {
            CustomGame.Space.requestRock(this.position, "small");
            CustomGame.Space.requestRock(this.position, "small");
        }
        else if (this.size == "large") {
            CustomGame.Space.requestRock(this.position, "medium");
            CustomGame.Space.requestRock(this.position, "medium");
        }

        super.destroy();
    }
}