class Space extends View {

    numStars = 100;
    numRocks = 100;
    worldSize = 10000;
    rocks = [];
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
        super.update();
    }

    createStars() {
        for(let i = 0; i < this.numStars; i++) {
            let s = new Star();
            s.layer = -1000;
            this.addChild(s);
        }
    }

    createRocks() {
        for(let i = 0; i < this.numRocks; i++) {
            let r = new Rock();

            r.position.x = MathUtil.randomInRange(this.worldSize / -2, this.worldSize / 2);
            r.position.y = MathUtil.randomInRange(this.worldSize / -2, this.worldSize / 2);
            
            let rand = Math.random();
            if(rand > 0.66) {
                r.size = "medium";
            }
            else if(rand > 0.33) {
                r.size = "small";
            }

            this.rocks.push(r);
            this.addChild(r);
        }
    }
}