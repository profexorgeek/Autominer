class PlayerData {
    ships = 1;
    cash = 50;
    cargoUpgrades = 0;
    accelUpgrades = 0;
    rofUpgrades = 0;

    static FromGeneric(obj) {
        let plyr = new PlayerData();

        plyr.ships = PlayerData.SanitizeAsNumber(obj.ships);
        plyr.cash = PlayerData.SanitizeAsNumber(obj.cash);
        plyr.cargoUpgrades = PlayerData.SanitizeAsNumber(obj.cargoUpgrades);
        plyr.accelUpgrades = PlayerData.SanitizeAsNumber(obj.accelUpgrades);
        plyr.rofUpgrades = PlayerData.SanitizeAsNumber(obj.rofUpgrades);

        return plyr;
    }

    static SanitizeAsNumber(val, def = 0) {
        if(val) {
            if(typeof val === "number") {
                return val;
            }
        }
        else return def;
    }
}