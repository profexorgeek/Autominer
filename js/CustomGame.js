class CustomGame extends FrostFlake {

    static Space;
    static SaveName = "AutominerPlayer"
    static Player;

    ui;


    constructor() {
        let canvas = document.getElementById('game');
        super(canvas, 60);
        this.camera = new CustomCamera(canvas.width, canvas.height);
        this.tryLoadPlayerData();
        this.view = new Space();
        CustomGame.Space = this.view;
        
        this.showDebug = false;
        FrostFlake.Log.setLevel("info");

        this.ui = new UiManager();
    }

    update() {
        super.update();
        this.ui.update();
    }

    tryLoadPlayerData() {
        let saveData = JSON.parse(localStorage.getItem(CustomGame.SaveName));
        if(saveData == null) {
            CustomGame.Player = new PlayerData();
            this.saveGame();
        }
        else {
            CustomGame.Player = PlayerData.FromGeneric(saveData);
        }
    }

    saveGame() {
        let plyr = JSON.stringify(CustomGame.Player)
        localStorage.setItem(CustomGame.SaveName, plyr);
    }

    static GetCost(upgrades, unitCost) {
        return Math.ceil(Math.pow(2, upgrades) * unitCost);
    }
}