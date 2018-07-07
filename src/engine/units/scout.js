import { Unit } from './unit.js';
import { Building } from '../buildings/building.js';
import { Sprites } from '../../sprites.js';
import { Actions } from '../actions.js';
import * as interactions from '../interactions.js';

class Scout extends Unit {
    getInteractionType(object) {
        if (object instanceof Unit || object instanceof Building) return interactions.AttackInteraction;
    }
    get ACTIONS() {
        return [Actions.StandGround, Actions.Stop];
    }
}
Scout.prototype.SUBTILE_WIDTH = 2;
Scout.prototype.NAME = ["Scout"];
Scout.prototype.AVATAR = [Sprites.Sprite("img/interface/avatars/scout.png")];
Scout.prototype.TYPE = "cavalry";
Scout.prototype.MAX_HP = 60;
Scout.prototype.SPEED = 3;
Scout.prototype.CREATION_TIME = 26 * 35;
Scout.prototype.ATTACK_RATE = 5 * 3;

Scout.prototype.ACTION_KEY = "T";
Scout.prototype.COST = {
    food: 100, wood: 0, stone: 0, gold: 0
}

Scout.prototype.ATTRIBUTES = {
    ATTACK: 3,
    ARMOR: 0
}

Scout.prototype.FRAME_RATE = {
    ...Unit.prototype.FRAME_RATE,
    [Scout.prototype.STATE.ATTACK]: 3
}


Scout.prototype.IMAGES = {
    [Scout.prototype.STATE.IDLE]: [Sprites.DirectionSprites("img/units/scout/idle/", 9)],
    [Scout.prototype.STATE.MOVING]: [Sprites.DirectionSprites("img/units/scout/moving/", 10)],
    [Scout.prototype.STATE.ATTACK]: [Sprites.DirectionSprites("img/units/scout/attack/", 9)],
    [Scout.prototype.STATE.DYING]: [Sprites.DirectionSprites("img/units/scout/dying/", 18)],
    [Scout.prototype.STATE.DEAD]: [Sprites.DirectionSprites("img/units/scout/dead/", 6)],
};

Scout.prototype.IMAGE_OFFSETS = {
    [Scout.prototype.STATE.IDLE]: [{ x: 25 - 16, y: 47 }],
    [Scout.prototype.STATE.MOVING]: [{ x: 26 - 16, y: 47 }],
    [Scout.prototype.STATE.ATTACK]: [{ x: 23 - 16, y: 46 }],
    [Scout.prototype.STATE.DYING]: [{ x: 127 - 16, y: 98 }],
    [Scout.prototype.STATE.DEAD]: [{ x: 170 - 16, y: 75 }],
};

export { Scout }
