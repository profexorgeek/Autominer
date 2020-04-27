class CustomGame extends FrostFlake {

    static Space;
    static SaveName = "AutominerPlayer"
    static Player;

    // UI
    uiShipCount;
    uiCash;


    constructor() {
        let canvas = document.getElementById('game');
        super(canvas, 60);
        this.camera = new CustomCamera(canvas.width, canvas.height);
        this.bindUi();
        this.tryLoadPlayerData();
        this.view = new Space();
        CustomGame.Space = this.view;
        this.showDebug = false;
    }

    update() {
        super.update();

        this.updateUi();
    }

    bindUi() {
        document.getElementById('btnPurchaseShip').addEventListener('click', () => {
            CustomGame.Space.tryPurchaseShip();
        });

        this.uiShipCount = document.getElementById('infoShipCount');
        this.uiCash = document.getElementById('infoCash');
    }

    updateUi() {
        this.uiShipCount.innerHTML = CustomGame.Player.ships;
        this.uiCash.innerHTML =`$${CustomGame.Player.cash}`;
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
}