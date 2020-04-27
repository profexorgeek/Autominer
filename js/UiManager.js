class UiManager {

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
    }

    update() {
        this.timeToNextUpdate -= CustomGame.Game.time.frameSeconds;
        if(this.timeToNextUpdate <= 0) {
            this.updateUi();
            this.timeToNextUpdate = UiManager.UpdateFrequencySeconds;
        }
    }

    updateUi() {
        let player = CustomGame.Player;

        this.cash.innerHTML = `$${player.cash}`;

        this.shipCount.innerHTML = player.ships;
        this.shipCost.innerHTML = CustomGame.GetCost(player.ships, Ship.ShipUnitCost);

        this.cargoCount.innerHTML = player.cargoUpgrades;
        this.cargoCost.innerHTML = CustomGame.GetCost(player.cargoUpgrades, Ship.CargoUnitCost);

        this.accelCount.innerHTML = player.accelUpgrades;
        this.accelCost.innerHTML = CustomGame.GetCost(player.accelUpgrades, Ship.AccelUnitCost);

        this.rofCount.innerHTML = player.rofUpgrades;
        this.rofCost.innerHTML = CustomGame.GetCost(player.rofUpgrades, Ship.ROFUnitCost);
    }

    purchaseShip() {
        let player = CustomGame.Player;
        let cost = CustomGame.GetCost(player.ships, Ship.ShipUnitCost);
        if(player.cash >= cost) {
            player.cash -= cost;
            player.ships += 1;
            CustomGame.Space.addPlayerShip();
            CustomGame.Game.saveGame();
            FrostFlake.Log.info('New ship purchased.');
            this.updateUi();
        }
        else {
            FrostFlake.Log.warn('You do not have the cash to purchase a ship.');
        }
    }

    upgradeCargo() {
        let player = CustomGame.Player;
        let cost = CustomGame.GetCost(player.cargoUpgrades, Ship.CargoUnitCost);
        if(player.cash >= cost) {
            player.cash -= cost;
            player.cargoUpgrades += 1;
            CustomGame.Game.saveGame();
            FrostFlake.Log.info('Cargo space purchased.');
            this.updateUi();
        }
        else {
            FrostFlake.Log.warn('You do not have the cash to purchase this.');
        }
    }

    upgradeAccel() {
        let player = CustomGame.Player;
        let cost = CustomGame.GetCost(player.accelUpgrades, Ship.AccelUnitCost);
        if(player.cash >= cost) {
            player.cash -= cost;
            player.accelUpgrades += 1;
            CustomGame.Game.saveGame();
            FrostFlake.Log.info('Accel upgrade purchased.');
            this.updateUi();
        }
        else {
            FrostFlake.Log.warn('You do not have the cash to purchase this.');
        }
    }

    upgradeRof() {
        let player = CustomGame.Player;
        let cost = CustomGame.GetCost(player.rofUpgrades, Ship.ROFUnitCost);
        if(player.cash >= cost) {
            player.cash -= cost;
            player.rofUpgrades += 1;
            CustomGame.Game.saveGame();
            FrostFlake.Log.info('ROF upgrade purchased.');
            this.updateUi();
        }
        else {
            FrostFlake.Log.warn('You do not have the cash to purchase this.');
        }
    }
}