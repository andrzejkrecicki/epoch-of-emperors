import { manhatan_subtile_distance } from '../utils.js';

class Player {
    constructor(definition) {
        this.index = definition.index;
        this.name = definition.name;
        this.civ = definition.civ;
        this.color = definition.color;
        this.team = definition.team;
        this.is_cpu = definition.is_cpu;
        this.resources = { ...definition.resources };
        this.population = 0;
        this.max_population = Player.prototype.DEFAULT_POPULATION;
        this.units = [];
        this.buildings = [];
    }
    addBuilding(building) {
        this.buildings.push(building);
    }
    addUnit(unit) {
        this.units.push(unit)
    }
    deficitResource(cost) {
        for (let res in this.resources) if (this.resources[res] < cost[res]) return res;
        return null;
    }
    subtractResources(cost) {
        for (let res in this.resources) this.resources[res] -= cost[res];
    }
    getNearestBuilding(entity, filters={}) {
        let nearest = null;
        let min_dist = Infinity;
        for (let building of this.buildings) {
            let match = true;
            for (let attr in filters) {
                let attr_match = false;
                for (let attr_val of filters[attr]) {
                    if (building[attr] == attr_val) {
                        attr_match = true;
                        break;
                    }
                }
                if (!attr_match) {
                    match = false;
                    break;
                }
            }
            let curr_dist = manhatan_subtile_distance(entity, building);
            if (match && min_dist > curr_dist) {
                nearest = building;
                min_dist = curr_dist;
            }
        }
        return nearest;
    }
}
Player.prototype.DEFAULT_POPULATION = 4;

export { Player }