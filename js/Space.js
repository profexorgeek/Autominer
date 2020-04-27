class Space extends View {

    numStars = 200;
    numRocks = 100;
    worldSize = 2000;
    rocks = [];
    bullets = [];
    crystals = [];
    ships = [];
    station;


    constructor() {
        super();

        let cam = FrostFlake.Game.camera;

        this.createStars();
        this.createStartingRocks();

        this.station = new Station();
        this.addChild(this.station);

        for(let i = 0; i < CustomGame.Player.ships; i++) {
            let s = new Ship();
            s.x += MathUtil.randomInRange(-this.station.collision.radius, this.station.collision.radius);
            s.y += MathUtil.randomInRange(-this.station.collision.radius, this.station.collision.radius);
            this.ships.push(s);
            this.addChild(s);
        }

        CustomGame.Game.camera.target = this.ships[0];
    }

    update() {
        // remove destroyed things before normal update cycle
        this.doDestroyedChecks();

        super.update();

        this.doCollisions();
        this.doMinRockCheck();
    }

    doDestroyedChecks() {
        for (let i = this.bullets.length - 1; i > -1; i--) {
            if (this.bullets[i].destroyed) {
                this.removeChild(this.bullets[i]);
                this.bullets.splice(i, 1);
            }
        }

        for(let i = this.rocks.length - 1; i > -1; i--) {
            if(this.rocks[i].destroyed) {
                this.removeChild(this.rocks[i]);
                this.rocks.splice(i, 1);
            }
        }

        for(let i = this.crystals.length - 1; i > -1; i--) {
            if(this.crystals[i].destroyed) {
                this.removeChild(this.crystals[i]);
                this.crystals.splice(i, 1);
            }
        }
    }

    doCollisions() {
        for (let i = this.rocks.length - 1; i > -1; i--) {
            let rock = this.rocks[i];

            // test rocks vs bullets
            for (let j = this.bullets.length - 1; j > -1; j--) {
                let bullet = this.bullets[j];
                if(bullet.collision.collideWith(rock.collision, RepositionType.Bounce, 1, 0, 0.05)) {
                    rock.takeDamage(Bullet.Damage);
                    bullet.destroy();
                }
            }
            
            // test rocks vs other rocks
            for(let j = i; j > -1; j--) {
                let rock2 = this.rocks[j];
                if(rock != rock2) {
                    rock.collision.collideWith(rock2.collision, RepositionType.Bounce, 0.5, 0.5);
                }
            }
        }

        // test crystals for pickup or attract
        for(let i = this.crystals.length - 1; i > -1; i--) {
            let crystal = this.crystals[i];
            for(let j = this.ships.length - 1; j > -1; j--) {
                let ship = this.ships[j];

                if(ship.cargoPercent == 1 || ship.state != ShipState.Mining) {
                    continue;
                }

                if(crystal.collectible) {
                    if(crystal.collision.collideWith(ship.collision)) {
                        ship.addCargo(1);
                        crystal.destroy();
                    }
                    else if(crystal.collision.collideWith(ship.crystalAttractor)) {
                        crystal.target = ship;
                    }
                }
                else {
                    if(crystal.collision.collideWith(this.station.crystalCollector)) {
                        this.awardPlayerCash(Crystal.Value);
                        crystal.destroy();
                    }
                    else {
                        crystal.target = this.station;
                    }
                }
                
            }
        }
        
        // test ship for station proximity
        for(let i = this.ships.length - 1; i > -1; i--) {
            let ship = this.ships[i];
            if(ship.state == ShipState.Unloading && ship.collision.collideWith(this.station.collision)) {
                ship.unloadCargo();
            }
        }
    }

    doMinRockCheck() {
        if(this.rocks.length < this.numRocks) {
            this.createRock();
        }
    }

    requestBullet(position, owner) {
        let b = new Bullet();

        // set these individual because position is a reference type
        b.x = position.x;
        b.y = position.y;
        b.rotation = position.rotation;
        b.layer = -5;

        this.bullets.push(b);
        this.addChild(b);
    }

    requestRock(position, size) {
        let r = new Rock();
        r.size = size;
        r.x = position.x;
        r.y = position.y;
        r.velocity.x = MathUtil.randomInRange(-20, 20);
        r.velocity.y = MathUtil.randomInRange(-20, 20);

        // force separation for collision
        r.x += r.velocity.x;
        r.y += r.velocity.y;

        this.rocks.push(r);
        this.addChild(r);
    }

    requestCrystal(position, collectible = true) {
        let c = new Crystal();
        c.x = position.x;
        c.y = position.y;
        c.velocity.x = MathUtil.randomInRange(-5, 5);
        c.velocity.y = MathUtil.randomInRange(-5, 5);

        // force separation
        c.x += c.velocity.x;
        c.y += c.velocity.y;

        c.collectible = collectible
        this.crystals.push(c);
        this.addChild(c);
    }

    getNearestRock(positionable) {
        let lastDisk = Number.MAX_SAFE_INTEGER;
        let rock = null;

        for (let i = 0; i < this.rocks.length; i++) {
            let delta = MathUtil.vectorSubtract(this.rocks[i].position, positionable.position);
            let newDist = MathUtil.vectorLength(delta);
            if (newDist < lastDisk) {
                rock = this.rocks[i];
                lastDisk = newDist;
            }
        }

        return rock;
    }

    getRandomRock() {
        var i = Math.round(MathUtil.randomInRange(0, this.rocks.length - 1));
        return this.rocks[i];
    }

    createStars() {
        for (let i = 0; i < this.numStars; i++) {
            let s = new Star();
            s.layer = -1000;
            this.addChild(s);
        }
    }

    createStartingRocks() {
        for (let i = 0; i < this.numRocks; i++) {
            this.createRock();
        }
    }

    createRock() {
        let r = new Rock();

        r.position.x = MathUtil.randomInRange(this.worldSize / -2, this.worldSize / 2);
        r.position.y = MathUtil.randomInRange(this.worldSize / -2, this.worldSize / 2);

        let rand = Math.random();
        if (rand > 0.66) {
            r.size = "medium";
        }
        else if (rand > 0.33) {
            r.size = "small";
        }

        this.rocks.push(r);
        this.addChild(r);
    }

    tryPurchaseShip() {
        if(CustomGame.Player.cash >= Ship.Cost) {
            CustomGame.Player.ships += 1;
            CustomGame.Player.cash -= Ship.Cost;
            CustomGame.Game.saveGame();

            let s = new Ship();
            s.x += MathUtil.randomInRange(-this.station.collision.radius, this.station.collision.radius);
            s.y += MathUtil.randomInRange(-this.station.collision.radius, this.station.collision.radius);
            this.ships.push(s);
            this.addChild(s);

            CustomGame.Game.camera.target = this.ships[this.ships.length - 1];
        }
    }

    awardPlayerCash(amount) {
        CustomGame.Player.cash += amount;
        CustomGame.Game.saveGame();
    }
}