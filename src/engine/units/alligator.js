import { Animal } from './animal.js';
import { Sprites } from '../../sprites.js';

class Alligator extends Animal {
    constructor() {
        super(...arguments);
        this.attributes = {
            attack: Alligator.prototype.ATTRIBUTES.ATTACK,
            food: 200
        }
    }
}
Alligator.prototype.SUBTILE_WIDTH = 1;
Alligator.prototype.NAME = "Alligator";
Alligator.prototype.AVATAR = Sprites.Sprite("img/interface/avatars/alligator.png");
Alligator.prototype.MAX_HP = 24;
Alligator.prototype.SPEED = .75;
Alligator.prototype.ATTACK_RATE = 19;

Alligator.prototype.ATTRIBUTES = {
    ATTACK: 4
}

Alligator.prototype.FRAME_RATE = {
    ...Animal.prototype.FRAME_RATE,
    [Alligator.prototype.STATE.ATTACK]: 3
}

Alligator.prototype.IMAGES = {
    [Alligator.prototype.STATE.IDLE]: Sprites.DirectionSprites("img/units/alligator/idle/", 1),
    [Alligator.prototype.STATE.MOVING]: Sprites.DirectionSprites("img/units/alligator/moving/", 10),
    [Alligator.prototype.STATE.ATTACK]: Sprites.DirectionSprites("img/units/alligator/attack/", 15),
    [Alligator.prototype.STATE.DYING]: Sprites.DirectionSprites("img/units/alligator/dying/", 13),
    [Alligator.prototype.STATE.DEAD]: Sprites.DirectionSprites("img/units/alligator/dead/", 4),
};

Alligator.prototype.IMAGE_OFFSETS = {
    [Alligator.prototype.STATE.IDLE]: { x: 21, y: 18 },
    [Alligator.prototype.STATE.MOVING]: { x: 24, y: 19 },
    [Alligator.prototype.STATE.ATTACK]: { x: 25, y: 24 },
    [Alligator.prototype.STATE.DYING]: { x: 25, y: 23 },
    [Alligator.prototype.STATE.DEAD]: { x: 13, y: 18 },
};

export { Alligator }
