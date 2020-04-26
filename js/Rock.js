class Rock extends Sprite {

    #size = "large";

    get size() {
        return this.#size;
    }

    set size(newSize) {
        this.#size = newSize;
        switch(newSize) {
            case "small":
                this.frame = new Frame(48, 16, 16, 16);
                this.collision.radius = 4;
                break;
            case "medium":
                this.frame = new Frame(48, 0, 16, 16);
                this.collision.radius = 8;
                break;
            default :
                this.frame = new Frame(16, 0, 32, 32);
                this.collision.radius = 16;
                this.#size = "large";
                break;
        }
    }

    constructor() {
        super('content/spritesheet.png');

        this.size = "large";
        this.velocity.rotation = MathUtil.randomInRange(-3, 3);
    }

    update() {
        super.update();
    }
}