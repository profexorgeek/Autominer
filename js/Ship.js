class Ship extends Sprite {

    #stats = {
        acceleration: 100,
        drag: 2
    };

    throttle = 0;
    mineTarget = null;
    navAccuracy = 16;
    clampSpeed = 1;

    get stats() {
        return this.#stats;
    }

    set stats(newStats) {
        // TODO: check sanity of newStats
        this.#stats = newStats;
        this.drag = this.#stats.drag;
    }

    get currentSpeed() {
        return MathUtil.vectorLength(this.velocity);
    }

    constructor() {
        super('content/spritesheet.png');

        this.frame = new Frame(0, 16, 16, 16);
        this.drag = this.#stats.drag;
    }

    update() {
        super.update();
        this.doNavigation();
    }

    doNavigation() {
        // clamp speed
        if(this.currentSpeed < this.clampSpeed) {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }

        // TODO: also check destroyed
        if(this.mineTarget == null || this.distanceToTarget() < this.navAccuracy) {
            this.mineTarget = CustomGame.Space.getRandomRock(this);
        }
        
        this.rotation = MathUtil.angleTo(this.position, this.mineTarget.position);
        let targetDist = this.distanceToTarget();
        let stopDist = this.distanceToStop();

        if(targetDist < this.navAccuracy || stopDist >= targetDist) {
            this.throttle = 0;
        }
        else {
            this.throttle = 1;
        }

        this.acceleration.x = Math.cos(this.rotation) * (this.throttle * this.#stats.acceleration);
        this.acceleration.y = Math.sin(this.rotation) * (this.throttle * this.#stats.acceleration);
    }

    distanceToTarget() {
        if(this.mineTarget instanceof Positionable) {
            let delta = MathUtil.vectorSubtract(this.position, this.mineTarget.position);
            return MathUtil.vectorLength(delta);
        }
        return Number.MAX_SAFE_INTEGER;
    }

    distanceToStop() {
        let maxIterations = 1000;
        let i = 0;
        let dist = 0;
        let calcResolution = 1;
        let speed = this.currentSpeed;
        while(speed > 0 && i <= maxIterations) {
            dist += speed;
            speed -= this.drag * speed * calcResolution;
            i++;

            if(i == maxIterations) {
                CustomGame.Log.warn('Exceeded max iterations when calculating stop distance!');
            }
        }
        return dist;
    }
}