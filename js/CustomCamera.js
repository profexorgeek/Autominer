class CustomCamera extends Camera {

    target;

    constructor(width, height) {
        super(width, height);

        this.background = "rgb(48, 44, 46)";
    }

    update() {
        super.update();

        // track target
        // TODO: lerp
        if(this.target instanceof Positionable) {
            this.x = this.target.x;
            this.y = this.target.y;
        }
    }
}