import { Unit } from './unit.js';
import { make_image, leftpad } from '../../utils.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { Actions } from '../actions.js';

class Villager extends Unit {
}
Villager.SUBTILE_WIDTH = 1;
Villager.prototype.NAME = "Villager";
Villager.prototype.AVATAR = make_image("img/interface/avatars/villager.png");
Villager.prototype.HP = 25;
Villager.prototype.SPEED = 1;
Villager.prototype.SUPPORTED_TERRAIN = new Set([TERRAIN_TYPES.GRASS, TERRAIN_TYPES.SAND]);
Villager.prototype.ACTIONS = [
    Actions.Build,
    Actions.Repair,
    Actions.Stop
];

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
Villager.prototype.IMAGES[Villager.prototype.STATE.MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 15; ++i) {
        Villager.prototype.IMAGES[Villager.prototype.STATE.MOVING][dir].push(
            make_image(`img/units/villager/moving/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Villager.prototype.IMAGE_OFFSETS = {};
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.IDLE] = { x: 0, y: 35 };
Villager.prototype.IMAGE_OFFSETS[Villager.prototype.STATE.MOVING] = { x: 9, y: 35 };


export { Villager }