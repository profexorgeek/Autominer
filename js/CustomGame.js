class CustomGame extends FrostFlake {

    static Space;

    constructor() {
        let canvas = document.getElementById('game');
        super(canvas, 60);
        this.camera = new CustomCamera(canvas.width, canvas.height);
        this.view = new Space();

        CustomGame.Space = this.view;
    }
}