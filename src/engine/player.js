import { manhatan_subtile_distance } from '../utils.js';

class Player {
    constructor(definition, map) {
        this.index = definition.index;
        this.name = definition.name;
        this.civ = definition.civ;
        this.color = definition.color;
        this.team = definition.team;
        this.is_cpu = definition.is_cpu;
        this.resources = { ...definition.resources };
        this.population = 0;
        this.max_population = Player.prototype.DEFAULT_POPULATION;
        // TODO - remove the bellow line in production build
        this.max_population = 1000;

        this.age = map.startingAge;

        this.units = [];
        this.buildings = [];
        this.possessions = {};
        this.defaultEntityLevel = {
            Tower: 0,
            Wall: 0
        };

        this.attributeBonus = {
            infantry: {
                attack: 0,
                armor: 0,
                missile_armor: 0
            },
            archer: {
                attack: 0,
                armor: 0,
                missile_armor: 0
            },
            cavalry: {
                attack: 0,
                armor: 0,
                missile_armor: 0
            },
            farm: {
                food: 0
            },
            villager: {
                capacity: {
                    food: 0,
                    wood: 0,
                    stone: 0,
                    gold: 0
                },
                speed: 0
            },
            ship: {},
            other: {}
        }
        this.interactionBonus = {
            FarmingInteraction: 0,
            ChopInteraction: 0,
            ForageInteraction: 0,
            GoldMineInteraction: 0,
            StoneMineInteraction: 0,
            ButcherInteraction: 0,
            FishingInteraction: 0
        }
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
