import Sprite from 'frostflake/Positionables/Sprite';
import Frame from 'frostflake/Drawing/Frame';
import Circle from 'frostflake/Positionables/Circle';

export default class Station extends Sprite {
    crystalCollector;

    constructor() {
        super('content/spritesheet.png');
        this.frame = new Frame(0, 272, 288, 288);
        this.level = -1;
        this.velocity.rotation = 0.01;
        this.collision.radius = 200;
        this.layer = -50;
        
        this.crystalCollector = new Circle();
        this.crystalCollector.color = "cyan";
        this.crystalCollector.radius = 8;
        this.crystalCollector.visible = false;
        this.addChild(this.crystalCollector);
    }

    update() {
        super.update();
    }
}