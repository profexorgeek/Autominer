class PlayerData {
    ships = 1;
    cash = 0;

    static FromGeneric(obj) {
        let plyr = new PlayerData();
        plyr.ships = obj.ships;
        plyr.cash = obj.cash;
        return plyr;
    }
}