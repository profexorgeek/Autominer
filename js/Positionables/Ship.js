class Ship extends Sprite {

    #stats = {
        acceleration: 100,
        drag: 2,
        shotsPerSecond: 1
    };

    throttle = 0;
    mineTarget = null;
    navAccuracy = 16;
    clampSpeed = 1;
    reloadTimeRemaining = 0;

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

        this.reloadTimeRemaining -= CustomGame.Game.time.frameSeconds;
    }

    fireWhenReady() {
        if(this.reloadTimeRemaining <= 0) {
            CustomGame.Space.requestBullet(this.position, this);
            this.reloadTimeRemaining = 1 / this.#stats.shotsPerSecond;
        }
    }

    doNavigation() {
        // clamp speed
        if(this.currentSpeed < this.clampSpeed) {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }

        if(this.mineTarget == null || this.mineTarget.destroyed == true) {
            this.mineTarget = CustomGame.Space.getNearestRock(this);
        }
        
        this.rotation = MathUtil.angleTo(this.position, this.mineTarget.position);
        let range = Bullet.Range / 2;
        let targetDist = this.distanceToTarget() - range;
        let stopDist = this.distanceToStop();

        if(targetDist < this.navAccuracy || stopDist > targetDist) {
            this.throttle = 0;
            this.fireWhenReady();
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