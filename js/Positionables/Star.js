class Star extends Sprite {

    parallax;

    constructor() {
        super('content/spritesheet.png');

        let cam = FrostFlake.Game.camera;
        this.frame = new Frame(0, 0, 16, 16);
        this.position.x = MathUtil.randomInRange(cam.width / -2, cam.width / 2);
        this.position.y = MathUtil.randomInRange(cam.height / -2, cam.height / 2);
        this.scale = MathUtil.randomInRange(0.2, 1);
        this.alpha = MathUtil.randomInRange(0.2, 0.7);
        this.parallax = MathUtil.randomInRange(0, 0.5);
    }

    update() {
        super.update();

        let cam = FrostFlake.Game.camera;

        // parallax by taking a percentage of the camera's movement
        this.x += this.parallax * (cam.position.x - cam.lastPosition.x);
        this.y += this.parallax * (cam.position.y - cam.lastPosition.y);

        if(this.x > cam.right) {
            this.x -= cam.width;
        }

        if(this.x < cam.left) {
            this.x += cam.width;
        }

        if(this.y > cam.top) {
            this.y -= cam.height;
        }

        if(this.y < cam.bottom) {
            this.y += cam.height;
        }

    }
}