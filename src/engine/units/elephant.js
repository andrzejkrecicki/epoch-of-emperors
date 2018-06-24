import { Animal } from './animal.js';
import { Sprites } from '../../sprites.js';

class Elephant extends Animal {
    constructor() {
        super(...arguments);
        this.attributes = {
            attack: Elephant.prototype.ATTRIBUTES.ATTACK,
            food: 550
        }
    }
}
Elephant.prototype.SUBTILE_WIDTH = 2;
Elephant.prototype.NAME = ["Elephant"];
Elephant.prototype.AVATAR = Sprites.Sprite("img/interface/avatars/elephant.png");
Elephant.prototype.MAX_HP = 45;
Elephant.prototype.SPEED = 1.5;
Elephant.prototype.ATTACK_RATE = 13;

Elephant.prototype.ATTRIBUTES = {
    ATTACK: 10
}

Elephant.prototype.FRAME_RATE = {
    ...Animal.prototype.FRAME_RATE,
    [Elephant.prototype.STATE.MOVING]: 3,
    [Elephant.prototype.STATE.ATTACK]: 4
}


Elephant.prototype.IMAGES = {
    [Elephant.prototype.STATE.IDLE]: [Sprites.DirectionSprites("img/units/elephant/idle/", 10)],
    [Elephant.prototype.STATE.MOVING]: [Sprites.DirectionSprites("img/units/elephant/moving/", 8)],
    [Elephant.prototype.STATE.ATTACK]: [Sprites.DirectionSprites("img/units/elephant/attack/", 10)],
    [Elephant.prototype.STATE.DYING]: [Sprites.DirectionSprites("img/units/elephant/dying/", 12)],
    [Elephant.prototype.STATE.DEAD]: [Sprites.DirectionSprites("img/units/elephant/dead/", 4)],
};

Elephant.prototype.IMAGE_OFFSETS = {
    [Elephant.prototype.STATE.IDLE]: [{ x: 21, y: 48 }],
    [Elephant.prototype.STATE.MOVING]: [{ x: 20, y: 49 }],
    [Elephant.prototype.STATE.ATTACK]: [{ x: 35, y: 53 }],
    [Elephant.prototype.STATE.DYING]: [{ x: 51, y: 74 }],
    [Elephant.prototype.STATE.DEAD]: [{ x: 34, y: 36 }],
};

export { Elephant }
