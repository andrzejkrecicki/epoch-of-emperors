import { Unit } from './unit.js';
import { make_image, leftpad } from '../../utils.js';
import { TERRAIN_TYPES } from '../terrain.js';

class Animal extends Unit {
    constructor() {
        super(...arguments);
        this.attributes = {
            attack: this.ATTRIBUTES.ATTACK,
        }
    }
    getFood(engine) {
        if (this.attributes.food > 0) {
            if (--this.attributes.food == 0) this.destroy(engine);
            return 1;
        }
        return 0;
    }
}
Animal.prototype.SUPPORTED_TERRAIN = new Set([TERRAIN_TYPES.GRASS, TERRAIN_TYPES.SAND]);


export { Animal }
