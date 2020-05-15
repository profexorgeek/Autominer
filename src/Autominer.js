import FrostFlake from 'frostflake/FrostFlake';
import Space from './Views/Space.js';
import UiManager from './UiManager.js';
import PlayerData from './PlayerData.js';
import CustomCamera from './Positionables/CustomCamera.js';

export default class Autominer extends FrostFlake {

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
        Autominer.Space = this.view;
        
        this.showDebug = false;
        Autominer.Log.setLevel("info");

        this.ui = new UiManager();
    }

    update() {
        super.update();
        this.ui.update();
    }

    tryLoadPlayerData() {
        let saveData = JSON.parse(localStorage.getItem(Autominer.SaveName));
        if(saveData == null) {
            Autominer.Player = new PlayerData();
            this.saveGame();
        }
        else {
            Autominer.Player = PlayerData.FromGeneric(saveData);
        }
    }

    saveGame() {
        let plyr = JSON.stringify(Autominer.Player)
        localStorage.setItem(Autominer.SaveName, plyr);
    }

    static GetCost(upgrades, unitCost) {
        return Math.ceil(Math.pow(2, upgrades) * unitCost);
    }
}