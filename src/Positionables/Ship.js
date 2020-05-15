import Sprite from 'frostflake/Positionables/Sprite';
import Frame from 'frostflake/Drawing/Frame';
import Circle from 'frostflake/Positionables/Circle';
import Autominer from '../Autominer.js';
import MathUtil from 'frostflake/Utility/MathUtil';
import Bullet from '../Positionables/Bullet.js';
import Positionable from 'frostflake/Positionables/Positionable';
import ShipState from './ShipState.js';

export default class Ship extends Sprite {

    // #region static base costs
    static ShipUnit = 1;
    static ShipUnitCost = 35;

    static CargoBase = 5;
    static CargoUnit = 1;
    static CargoUnitCost = 15;

    static AccelBase = 120;
    static AccelUnit = 5;
    static AccelUnitCost = 5;

    static ROFBase = 1.5;
    static ROFUnit = 0.25;
    static ROFUnitCost = 35;

    static CrystalAttractRange = 150;
    static CargoUnloadPerSecond = 5;
    static Drag = 1;
    static NavAccuracy = 16;
    static ClampSpeed = 1;
    static ShipColors = 5;
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

        let shipColor = Math.floor(MathUtil.randomInRange(0, Ship.ShipColors));
        this.frame = new Frame(shipColor * 16, 48, 16, 16);
        this.drag = Ship.Drag;
        this.collision.radius = 7;

        this.crystalAttractor = new Circle();
        this.crystalAttractor.radius = Ship.CrystalAttractRange;
        this.crystalAttractor.color = "cyan";
        this.crystalAttractor.visible = false;       
        this.addChild(this.crystalAttractor);

        this.recalculateStats();
    }

    update() {
        super.update();
        this.doAI();

        if(this.reloadTimeRemaining > 0) {
            this.reloadTimeRemaining -= Autominer.Game.time.frameSeconds;
        }

        if(this.cargoUnloadTimeRemaining > 0) {
            this.cargoUnloadTimeRemaining -= Autominer.Game.time.frameSeconds;
        }
    }

    fireWhenReady() {
        if(this.reloadTimeRemaining <= 0) {
            Autominer.Space.requestBullet(this.position, this);
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
        let station = Autominer.Space.station;
        this.rotation = MathUtil.angleTo(this.position, station);
        let range = station.collision.radius * 0.75;
        let stationDist = this.distanceToTarget(Autominer.Space.station);
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
            this.mineTarget = Autominer.Space.getNearestRock(this);
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
                Autominer.Log.debug('Exceeded max iterations when calculating stop distance!');
            }
        }
        return dist;
    }

    addCargo(amount) {
        this.cargo += amount;
        this.cargo = MathUtil.clamp(this.cargo, 0, this.currentMaxCargo);
    }

    unloadCargo() {
        if(this.cargoUnloadTimeRemaining <= 0 && this.cargoPercent > 0) {
            this.addCargo(-1);
            Autominer.Space.requestCrystal(this.position, false);
            this.cargoUnloadTimeRemaining = 1 / Ship.CargoUnloadPerSecond;
        }
    }

    recalculateStats() {
        let player = Autominer.Player;
        this.currentAcceleration = Ship.AccelBase + (player.accelUpgrades * Ship.AccelUnit);
        this.currentRof = Ship.ROFBase + (player.rofUpgrades * Ship.ROFUnit);
        this.currentMaxCargo = Ship.CargoBase + (player.cargoUpgrades * Ship.CargoUnit);
    }
}