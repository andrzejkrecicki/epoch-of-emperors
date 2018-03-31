import { Unit } from './unit.js';
import { make_image, leftpad } from '../../utils.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { Actions } from '../actions.js';

class ClubMan extends Unit {
    constructor() {
        super(...arguments);
        this.attributes = {
            attack: ClubMan.prototype.ATTRIBUTES.ATTACK,
            armor: ClubMan.prototype.ATTRIBUTES.ARMOR
        }
    }
    get ACTIONS() {
        if (this.state & Unit.prototype.STATE.IDLE) return [
            Actions.StandGround
        ]; else return [Actions.StandGround, Actions.Stop]
    }
}
ClubMan.prototype.SUBTILE_WIDTH = 1;
ClubMan.prototype.NAME = "Clubman";
ClubMan.prototype.AVATAR = make_image("img/interface/avatars/clubman.png");
ClubMan.prototype.MAX_HP = 40;
ClubMan.prototype.SPEED = 1;
ClubMan.prototype.CREATION_TIME = 26 * 35;

ClubMan.prototype.ACTION_KEY = "T";
ClubMan.prototype.COST = {
    food: 50, wood: 0, stone: 0, gold: 0
}

ClubMan.prototype.SUPPORTED_TERRAIN = new Set([TERRAIN_TYPES.GRASS, TERRAIN_TYPES.SAND]);
ClubMan.prototype.ATTRIBUTES = {
    ATTACK: 3,
    ARMOR: 0
}


ClubMan.prototype.IMAGES = {};

ClubMan.prototype.IMAGES[ClubMan.prototype.STATE.IDLE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    ClubMan.prototype.IMAGES[ClubMan.prototype.STATE.IDLE][dir].push(
        make_image(`img/units/clubman/idle/${Unit.prototype.DIRECTIONS[dir]}.png`)
    );
}

ClubMan.prototype.IMAGES[ClubMan.prototype.STATE.MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 15; ++i) {
        ClubMan.prototype.IMAGES[ClubMan.prototype.STATE.MOVING][dir].push(
            make_image(`img/units/clubman/moving/${Unit.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

ClubMan.prototype.IMAGE_OFFSETS = {};
ClubMan.prototype.IMAGE_OFFSETS[ClubMan.prototype.STATE.IDLE] = { x: 6, y: 34 };
ClubMan.prototype.IMAGE_OFFSETS[ClubMan.prototype.STATE.MOVING] = { x: 6, y: 33 };


export { ClubMan }
