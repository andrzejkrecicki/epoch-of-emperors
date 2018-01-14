class Player {
    constructor(definition) {
        this.index = definition.index;
        this.name = definition.name;
        this.civ = definition.civ;
        this.colour = definition.colour;
        this.team = definition.team;
        this.is_cpu = definition.is_cpu;
        this.resources = definition.resources;
        this.units = [];
        this.buildings = [];
    }
    addBuilding(building) {
        this.buildings.push(building);
    }
    addUnit(unit) {
        this.units.push(unit)
    }
}

export { Player }