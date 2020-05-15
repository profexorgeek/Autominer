import Camera from 'frostflake/Positionables/Camera';
import Positionable from 'frostflake/Positionables/Positionable';

export default class CustomCamera extends Camera {

    target;

    constructor(width, height) {
        super(width, height);
        this.background = "rgb(48, 44, 46)";
        this.resolution = 1;
    }

    update() {
        super.update();

        // track target
        if(this.target instanceof Positionable) {
            this.velocity.x = this.target.x - this.x;
            this.velocity.y = this.target.y - this.y;
        }
    }
}