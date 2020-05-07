import Sprite from '../../../frostflake/Positionables/Sprite.js';
import Frame from '../../../frostflake/Drawing/Frame.js';
import Autominer from '../Autominer.js';

export default class Bullet extends Sprite {

    static Speed = 300;
    static Damage = 5;
    static Life = 0.5;
    static get Range() {
        return Bullet.Life * Bullet.Speed;
    }

    lifeRemaining;

    constructor() {
        super('content/spritesheet.png');
        this.frame = new Frame(0, 32, 16, 16);
        this.collision.radius = 6;
        this.lifeRemaining = Bullet.Life;
        this.level = -10;
    }

    update() {
        super.update();

        this.velocity.x = Math.cos(this.rotation) * Bullet.Speed;
        this.velocity.y = Math.sin(this.rotation) * Bullet.Speed;

        this.lifeRemaining -= Autominer.Game.time.frameSeconds;
        if(this.lifeRemaining <= 0) {
            this.destroy();
        }

    }
}