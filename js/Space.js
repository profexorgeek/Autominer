class Space extends View {

    numStars = 100;
    numRocks = 100;
    worldSize = 2000;
    rocks = [];
    bullets = [];
    player;


    constructor() {
        super();

        let cam = FrostFlake.Game.camera;

        this.createStars();
        this.createRocks();

        this.player = new Ship();
        this.addChild(this.player);

        FrostFlake.Game.camera.target = this.player;
    }

    update() {
        // remove destroyed things before normal update cycle
        this.doDestroyedChecks();

        super.update();

        this.doCollisions();
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

        // randomize velocity
        r.velocity.x = MathUtil.randomInRange(-5, 5);
        r.velocity.y = MathUtil.randomInRange(-5, 5);

        this.rocks.push(r);
        this.addChild(r);
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

    createRocks() {
        for (let i = 0; i < this.numRocks; i++) {
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
    }
}