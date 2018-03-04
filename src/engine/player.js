import { manhatan_subtile_distance } from '../utils.js';

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

export { Player }