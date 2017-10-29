import { Unit } from './unit.js';
import { make_image } from '../../utils.js';
import { TERRAIN_TYPES } from '../terrain.js';

class Villager extends Unit {
}
Villager.SUBTILE_WIDTH = 1;
Villager.prototype.NAME = "Villager";
Villager.prototype.HP = 25;
Villager.prototype.IMAGES = {};
Villager.prototype.IMAGES[Villager.prototype.STATE.IDLE] = [
    [make_image("img/units/villager/idle/N.png")],
    [make_image("img/units/villager/idle/NE.png")],
    [make_image("img/units/villager/idle/E.png")],
    [make_image("img/units/villager/idle/SE.png")],
    [make_image("img/units/villager/idle/S.png")],
    [make_image("img/units/villager/idle/SW.png")],
    [make_image("img/units/villager/idle/W.png")],
    [make_image("img/units/villager/idle/NW.png")],
];
Villager.prototype.IMAGE_OFFSETS = {};
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.IDLE] = { x: 11, y: 23 };
Villager.prototype.SUPPORTED_TERRAIN = new Set([TERRAIN_TYPES.GRASS, TERRAIN_TYPES.SAND]);


export { Villager }