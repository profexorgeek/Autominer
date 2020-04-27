class ShipState {
    static Mining = 0;
    static Unloading = 1;
}

class Ship extends Sprite {

    // #region static base costs
    static ShipUnit = 1;
    static ShipUnitCost = 50;

    static CargoBase = 4;
    static CargoUnit = 1;
    static CargoUnitCost = 25;

    static AccelBase = 100;
    static AccelUnit = 10;
    static AccelUnitCost = 50;

    static ROFBase = 1;
    static ROFUnit = 1;
    static ROFUnitCost = 200;

    static CrystalAttractRange = 150;
    static CargoUnloadPerSecond = 5;
    static Drag = 1;
    static NavAccuracy = 16;
    static ClampSpeed = 1;
    // #endregion

    currentAcceleration = Ship.AccelBase;
    currentRof = Ship.ROFBase;
    currentMaxCargo = Ship.CargoBase;

    reloadTimeRemaining = 0;
    cargoUnloadTimeRemaining = 0;

    throttle = 0;
    mineTarget = null;
    crystalAttractor;
    cargo = 0;
    state = ShipState.Mining;

    get currentSpeed() {
        return MathUtil.vectorLength(this.velocity);
    }

    get cargoPercent() {
        return this.cargo / this.currentMaxCargo;
    }

    constructor() {
        super('content/spritesheet.png');

        this.frame = new Frame(0, 16, 16, 16);
        this.drag = Ship.Drag;
        this.collision.radius = 7;

        this.crystalAttractor = new Circle();
        this.crystalAttractor.radius = Ship.CrystalAttractRange;
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
            this.reloadTimeRemaining = 1 / this.currentRof;
        }
    }

    doAI() {
        // clamp speed
        if(this.currentSpeed < Ship.ClampSpeed) {
            this.velocity.x = 0;
            this.velocity.y = 0;
        }

        switch(this.state) {
            case ShipState.Unloading :
                this.doStationNavigation();

                // unloading cargo is done, resume mining
                if(this.cargoPercent == 0) {

                    // check and apply new stats, simulates
                    // getting maintenance at the dock
                    this.recalculateStats();

                    this.state = ShipState.Mining;
                }
                break;

            // default is to mine asteroids
            default:
                this.doMiningBehavior();

                if(this.cargoPercent == 1) {
                    this.state = ShipState.Unloading;
                }
                break;
        }

        this.acceleration.x = Math.cos(this.rotation) * (this.throttle * this.currentAcceleration);
        this.acceleration.y = Math.sin(this.rotation) * (this.throttle * this.currentAcceleration);
    }

    doStationNavigation() {
        let station = CustomGame.Space.station;
        this.rotation = MathUtil.angleTo(this.position, station);
        let range = station.collision.radius * 0.75;
        let stationDist = this.distanceToTarget(CustomGame.Space.station);
        let targetDist = stationDist - range;
        let stopDist = this.distanceToStop();

        if(targetDist < Ship.NavAccuracy || stopDist > targetDist) {
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

        if(targetDist < Ship.NavAccuracy || stopDist > targetDist) {
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
        let maxIterations = 5000;
        let i = 0;
        let dist = 0;
        let calcResolution = 0.5;
        let speed = this.currentSpeed;
        while(speed > 0 && i <= maxIterations) {
            dist += speed;
            speed -= this.drag * speed * calcResolution;
            i++;

            if(i == maxIterations) {
                CustomGame.Log.debug('Exceeded max iterations when calculating stop distance!');
            }
        }
        return dist;
    }

    addCargo(amount) {
        this.cargo += amount;
        this.cargo = MathUtil.clamp(this.cargo, 0, this.currentMaxCargo);
    }

    unloadCargo() {
        if(this.cargoUnloadTimeRemaining <= 0) {
            this.addCargo(-1);
            CustomGame.Space.requestCrystal(this.position, false);
            this.cargoUnloadTimeRemaining = 1 / Ship.CargoUnloadPerSecond;
        }
    }

    recalculateStats() {
        let player = CustomGame.Player;
        this.currentAcceleration = Ship.AccelBase + (player.accelUpgrades * Ship.AccelUnit);
        this.currentRof = Ship.ROFBase + (player.rofUpgrades * Ship.ROFUnit);
        this.currentMaxCargo = Ship.CargoBase + (player.cargoUpgrades * Ship.CargoUnit);
    }
}