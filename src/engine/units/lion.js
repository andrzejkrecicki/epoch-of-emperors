import { Animal } from './animal.js';
import { Sprites } from '../../sprites.js';

class Lion extends Animal {
    constructor() {
        super(...arguments);
        this.attributes = {
            attack: Lion.prototype.ATTRIBUTES.ATTACK,
            food: 450
        }
    }
}
Lion.prototype.SUBTILE_WIDTH = 1;
Lion.prototype.NAME = "Lion";
Lion.prototype.AVATAR = Sprites.Sprite("img/interface/avatars/lion.png");
Lion.prototype.MAX_HP = 24;
Lion.prototype.SPEED = 3;
Lion.prototype.ATTACK_RATE = 8;

Lion.prototype.ATTRIBUTES = {
    ATTACK: 4
}

Lion.prototype.STATE = Object.assign({}, Lion.prototype.STATE);
Lion.prototype.STATE.SLOW = 2 << Lion.prototype.BASE_STATE_MASK_WIDTH;
Lion.prototype.STATE.SLOW_IDLE = Lion.prototype.STATE.IDLE | Lion.prototype.STATE.SLOW;
Lion.prototype.STATE.SLOW_MOVING = Lion.prototype.STATE.MOVING | Lion.prototype.STATE.SLOW;
Lion.prototype.STATE.SLOW_DYING = Lion.prototype.STATE.DYING | Lion.prototype.STATE.SLOW;


Lion.prototype.IMAGES = {
    [Lion.prototype.STATE.IDLE]: Sprites.DirectionSprites("img/units/lion/idle/", 1),
    [Lion.prototype.STATE.MOVING]: Sprites.DirectionSprites("img/units/lion/moving/", 12),
    [Lion.prototype.STATE.ATTACK]: Sprites.DirectionSprites("img/units/lion/attack/", 10),
    [Lion.prototype.STATE.DYING]: Sprites.DirectionSprites("img/units/lion/dying/", 10),
    [Lion.prototype.STATE.DEAD]: Sprites.DirectionSprites("img/units/lion/dead/", 4),
    [Lion.prototype.STATE.SLOW_MOVING]: Sprites.DirectionSprites("img/units/lion/slow/", 12),
};
Lion.prototype.IMAGES[Lion.prototype.STATE.SLOW_IDLE] = Lion.prototype.IMAGES[Lion.prototype.STATE.IDLE];
Lion.prototype.IMAGES[Lion.prototype.STATE.SLOW_DYING] = Lion.prototype.IMAGES[Lion.prototype.STATE.DYING];

Lion.prototype.IMAGE_OFFSETS = {
    [Lion.prototype.STATE.IDLE]: { x: 25, y: 34 },
    [Lion.prototype.STATE.MOVING]: { x: 27, y: 39 },
    [Lion.prototype.STATE.ATTACK]: { x: 30, y: 32 },
    [Lion.prototype.STATE.DYING]: { x: 27, y: 31 },
    [Lion.prototype.STATE.DEAD]: { x: 24, y: 19 },

    [Lion.prototype.STATE.SLOW_IDLE]: { x: 25, y: 34 },
    [Lion.prototype.STATE.SLOW_MOVING]: { x: 24, y: 28 },
    [Lion.prototype.STATE.SLOW_DYING]: { x: 27, y: 31 },
};

export { Lion }
