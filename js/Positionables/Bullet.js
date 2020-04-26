class Bullet extends Sprite {

    static Speed = 300;
    static Damage = 10;
    static Life = 0.5;
    static get Range() {
        return Bullet.Life * Bullet.Speed;
    }

    lifeRemaining;

    constructor() {
        super('content/spritesheet.png');
        this.frame = new Frame(0, 32, 16, 16);
        this.collision.radius = 12;
        this.lifeRemaining = Bullet.Life;
    }

    update() {
        super.update();

        this.velocity.x = Math.cos(this.rotation) * Bullet.Speed;
        this.velocity.y = Math.sin(this.rotation) * Bullet.Speed;

        this.lifeRemaining -= CustomGame.Game.time.frameSeconds;
        if(this.lifeRemaining <= 0) {
            this.destroy();
        }

    }
}