import { Unit } from './unit.js';
import { Sprites } from '../../sprites.js';
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
ClubMan.prototype.AVATAR = Sprites.Sprite("img/interface/avatars/clubman.png");
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

ClubMan.prototype.IMAGES = {
    [ClubMan.prototype.STATE.IDLE]: Sprites.DirectionSprites("img/units/clubman/idle/", 1),
    [ClubMan.prototype.STATE.MOVING]: Sprites.DirectionSprites("img/units/clubman/moving/", 15)
};

ClubMan.prototype.IMAGE_OFFSETS = {
    [ClubMan.prototype.STATE.IDLE]: { x: 6, y: 34 },
    [ClubMan.prototype.STATE.MOVING]: { x: 6, y: 33 },
};


export { ClubMan }
