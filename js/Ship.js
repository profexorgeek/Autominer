class Ship extends Sprite {

    #stats = {
        acceleration: 100,
        turnSpeed: 3,
        drag: 2
    };

    throttle = 0;

    get stats() {
        return this.#stats;
    }

    set stats(newStats) {
        // TODO: check sanity of newStats
        this.#stats = newStats;
        this.drag = this.#stats.drag;
    }

    constructor() {
        super('content/spritesheet.png');

        this.frame = new Frame(0, 16, 16, 16);
        this.drag = this.#stats.drag;
        this.acceleration.rotation = 1.5;
        this.throttle = 1;
    }

    update() {
        super.update();

        this.doNavigation();
    }

    doNavigation() {
        this.acceleration.x = Math.cos(this.rotation) * (this.throttle * this.#stats.acceleration);
        this.acceleration.y = Math.sin(this.rotation) * (this.throttle * this.#stats.acceleration);
    }
}