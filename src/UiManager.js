import Autominer from './Autominer.js';
import Ship from './Positionables/Ship.js';

export default class UiManager {

    static UpdateFrequencySeconds = 1;

    timeToNextUpdate = 0;

    cash;

    shipCount;
    shipCost;
    shipPurchase;

    cargoCount;
    cargoCost;
    cargoPurchase;

    accelCount;
    accelCost;
    accelPurchase;

    rofCount;
    rofCost;
    rofPurchase;

    cameraPrev;
    cameraStation;
    cameraNext;

    constructor() {
        this.cash = document.getElementById('cash');

        this.shipCount = document.getElementById('shipCount');
        this.shipCost = document.getElementById('shipCost');
        this.shipPurchase = document.getElementById('shipPurchase');
        this.shipPurchase.addEventListener('click', () => this.purchaseShip());

        this.cargoCount = document.getElementById('cargoCount');
        this.cargoCost = document.getElementById('cargoCost');
        this.cargoPurchase = document.getElementById('cargoPurchase');
        this.cargoPurchase.addEventListener('click', () => this.upgradeCargo());
        
        this.accelCount = document.getElementById('accelCount');
        this.accelCost = document.getElementById('accelCost');
        this.accelPurchase = document.getElementById('accelPurchase');
        this.accelPurchase.addEventListener('click', () => this.upgradeAccel());

        this.rofCount = document.getElementById('rofCount');
        this.rofCost = document.getElementById('rofCost');
        this.rofPurchase = document.getElementById('rofPurchase');
        this.rofPurchase.addEventListener('click', () => this.upgradeRof());

        this.cameraPrev = document.getElementById('cameraPrev');
        this.cameraPrev.addEventListener('click', () => Autominer.Space.focusPrevShip());

        this.cameraNext = document.getElementById('cameraNext');
        this.cameraNext.addEventListener('click', () => Autominer.Space.focusNextShip());

        this.cameraStation = document.getElementById('cameraStation');
        this.cameraStation.addEventListener('click', () => Autominer.Space.focusOnStation());
    }

    update() {
        this.timeToNextUpdate -= Autominer.Game.time.frameSeconds;
        if(this.timeToNextUpdate <= 0) {
            this.updateUi();
            this.timeToNextUpdate = UiManager.UpdateFrequencySeconds;
        }
    }

    updateUi() {
        let player = Autominer.Player;

        this.shipPurchase.classList.remove('btn-success');
        this.cargoPurchase.classList.remove('btn-success');
        this.accelPurchase.classList.remove('btn-success');
        this.rofPurchase.classList.remove('btn-success');

        let shipCost = Autominer.GetCost(player.ships, Ship.ShipUnitCost);
        let cargoCost = Autominer.GetCost(player.cargoUpgrades, Ship.CargoUnitCost);
        let accelCost = Autominer.GetCost(player.accelUpgrades, Ship.AccelUnitCost);
        let rofCost = Autominer.GetCost(player.rofUpgrades, Ship.ROFUnitCost);

        this.cash.innerHTML = `$${player.cash}`;

        this.shipCount.innerHTML = player.ships;
        this.shipCost.innerHTML = `$${shipCost}`;
        if(shipCost <= player.cash) {
            this.shipPurchase.classList.add('btn-success');
        }

        this.cargoCount.innerHTML = Ship.CargoBase + (Ship.CargoUnit * player.cargoUpgrades);
        this.cargoCost.innerHTML = `$${cargoCost}`;
        if(cargoCost <= player.cash) {
            this.cargoPurchase.classList.add('btn-success');
        }

        this.accelCount.innerHTML = (Ship.AccelBase + (Ship.AccelUnit * player.accelUpgrades)) / Ship.Drag;
        this.accelCost.innerHTML = `$${accelCost}`;
        if(accelCost <= player.cash) {
            this.accelPurchase.classList.add('btn-success');
        }

        this.rofCount.innerHTML = Ship.ROFBase + (Ship.ROFUnit * player.rofUpgrades);
        this.rofCost.innerHTML = `$${rofCost}`;
        if(rofCost <= player.cash) {
            this.rofPurchase.classList.add('btn-success');
        }
    }

    purchaseShip() {
        let player = Autominer.Player;
        let cost = Autominer.GetCost(player.ships, Ship.ShipUnitCost);
        if(player.cash >= cost) {
            player.cash -= cost;
            player.ships += 1;
            Autominer.Space.addPlayerShip();
            Autominer.Game.saveGame();
            Autominer.Log.info('New ship purchased.');
            this.updateUi();
        }
        else {
            Autominer.Log.warn('You do not have the cash to purchase a ship.');
        }
    }

    upgradeCargo() {
        let player = Autominer.Player;
        let cost = Autominer.GetCost(player.cargoUpgrades, Ship.CargoUnitCost);
        if(player.cash >= cost) {
            player.cash -= cost;
            player.cargoUpgrades += 1;
            Autominer.Game.saveGame();
            Autominer.Log.info('Cargo space purchased.');
            this.updateUi();
        }
        else {
            Autominer.Log.warn('You do not have the cash to purchase this.');
        }
    }

    upgradeAccel() {
        let player = Autominer.Player;
        let cost = Autominer.GetCost(player.accelUpgrades, Ship.AccelUnitCost);
        if(player.cash >= cost) {
            player.cash -= cost;
            player.accelUpgrades += 1;
            Autominer.Game.saveGame();
            Autominer.Log.info('Accel upgrade purchased.');
            this.updateUi();
        }
        else {
            Autominer.Log.warn('You do not have the cash to purchase this.');
        }
    }

    upgradeRof() {
        let player = Autominer.Player;
        let cost = Autominer.GetCost(player.rofUpgrades, Ship.ROFUnitCost);
        if(player.cash >= cost) {
            player.cash -= cost;
            player.rofUpgrades += 1;
            Autominer.Game.saveGame();
            Autominer.Log.info('ROF upgrade purchased.');
            this.updateUi();
        }
        else {
            Autominer.Log.warn('You do not have the cash to purchase this.');
        }
    }
}