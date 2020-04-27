class Rock extends Sprite {

    #size = "large";
    health = 100;
    crystalChance = 0.2;
    superDropAmount = 10;

    get size() {
        return this.#size;
    }

    set size(newSize) {
        this.#size = newSize;
        switch(newSize) {
            case "small":
                this.frame = new Frame(48, 16, 16, 16);
                this.collision.radius = 4;
                this.health = 40;
                this.drag = 0.5;
                break;
            case "medium":
                this.frame = new Frame(48, 0, 16, 16);
                this.collision.radius = 8;
                this.health = 75;
                this.drag = 1;
                break;
            default :
                this.frame = new Frame(16, 0, 32, 32);
                this.collision.radius = 16;
                this.#size = "large";
                this.health = 150;
                this.drag = 1.5;
                break;
        }
    }

    constructor() {
        super('content/spritesheet.png');
        this.size = "large";
        this.velocity.rotation = MathUtil.randomInRange(-3, 3);
        this.crystalsToDrop = Math.round(MathUtil.randomInRange(3, 5));
        this.level = -5;
    }

    update() {
        super.update();
        if(this.health <= 0) {
            this.destroy();
        }
    }

    takeDamage(amount) {
        this.health -= amount;

        if(Math.random() < this.crystalChance) {
            CustomGame.Space.requestCrystal(this.position);
        }
    }

    destroy() {
        if (this.size == "large") {
            CustomGame.Space.requestRock(this.position, "medium");
            CustomGame.Space.requestRock(this.position, "medium");
        }
        else if(this.size == "medium") {
            CustomGame.Space.requestRock(this.position, "small");
            CustomGame.Space.requestRock(this.position, "small");
        }
        else {
            // chance to super drop
            if(Math.random() < this.crystalChance) {
                for(let i = 0; i < this.crystalsToDrop; i++) {
                    CustomGame.Space.requestCrystal(this.position);
                }
            }
        }

        super.destroy();
    }
}