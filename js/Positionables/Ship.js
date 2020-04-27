class ShipState {
    static Mining = 0;
    static Unloading = 1;
}

class Ship extends Sprite {

    static Cost = 100;

    #stats = {
        acceleration: 150,
        drag: 0.5,
        shotsPerSecond: 1,
        crystalAttractRange: 150,
        maxCargo: 5,
        cargoUnloadPerSecond: 5,
    };

    throttle = 0;
    mineTarget = null;
    navAccuracy = 16;
    clampSpeed = 1;
    reloadTimeRemaining = 0;
    cargoUnloadTimeRemaining = 0;
    crystalAttractor;
    cargo = 0;
    state = ShipState.Mining;

    get stats() {
        return this.#stats;
    }

    set stats(newStats) {
        // TODO: check sanity of newStats
        this.#stats = newStats;
        this.drag = this.#stats.drag;
        this.crystalAttractor.radius = this.#stats.crystalAttractRange;
    }

    get currentSpeed() {
        return MathUtil.vectorLength(this.velocity);
    }

    get cargoPercent() {
        return this.cargo / this.#stats.maxCargo;
    }

    constructor() {
        super('content/spritesheet.png');

        this.frame = new Frame(0, 16, 16, 16);
        this.drag = this.#stats.drag;
        this.collision.radius = 7;

        this.crystalAttractor = new Circle();
        this.crystalAttractor.radius = this.#stats.crystalAttractRange;
        this.crystalAttractor.color = "cyan";
        this.crystalAttractor.visible = false;       
        this.addChild(this.crystalAttractor);
    }

    update() {
        super.update();
        this.doAI();

        if(this.reloadTimeRemaining > 0) {
            this.reloadTimeRemaining -= CustomGame.Game.time.frameSeconds;
        }

        if(this.cargoUnloadTimeRemaining > 0) {
            this.cargoUnloadTimeRemaining -= CustomGame.Game.time.frameSeconds;
        }
    }

    fireWhenReady() {
        if(this.reloadTimeRemaining <= 0) {
            CustomGame.Space.requestBullet(this.position, this);
            this.reloadTimeRemaining = 1 / this.#stats.shotsPerSecond;
        }
    }

    doAI() {
        // clamp speed
        if(this.currentSpeed < this.clampSpeed) {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }

        switch(this.state) {
            case ShipState.Unloading :
                this.doStationNavigation();

                if(this.cargoPercent == 0) {
                    this.state = ShipState.Mining;
                }
                break;

            // default is to mine
            default:
                this.doMiningBehavior();

                if(this.cargoPercent == 1) {
                    this.state = ShipState.Unloading;
                }
                break;
        }

        this.acceleration.x = Math.cos(this.rotation) * (this.throttle * this.#stats.acceleration);
        this.acceleration.y = Math.sin(this.rotation) * (this.throttle * this.#stats.acceleration);
    }

    doStationNavigation() {
        let station = CustomGame.Space.station;
        this.rotation = MathUtil.angleTo(this.position, station);
        let range = station.collision.radius * 0.75;
        let stationDist = this.distanceToTarget(CustomGame.Space.station);
        let targetDist = stationDist - range;
        let stopDist = this.distanceToStop();

        if(targetDist < this.navAccuracy || stopDist > targetDist) {
            this.throttle = 0;
        }
        else {
            this.throttle = 1;
        }
    }

    doMiningBehavior() {
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
    }

    distanceToTarget(targetToMeasure = null) {
        targetToMeasure = (targetToMeasure == null) ? this.mineTarget : targetToMeasure;

        if(targetToMeasure instanceof Positionable) {
            let delta = MathUtil.vectorSubtract(this.position, targetToMeasure);
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

    addCargo(amount) {
        this.cargo += amount;
        this.cargo = MathUtil.clamp(this.cargo, 0, this.#stats.maxCargo);
    }

    unloadCargo() {
        if(this.cargoUnloadTimeRemaining <= 0) {
            this.addCargo(-1);
            CustomGame.Space.requestCrystal(this.position, false);
            this.cargoUnloadTimeRemaining = 1 / this.#stats.cargoUnloadPerSecond;
        }
    }
}