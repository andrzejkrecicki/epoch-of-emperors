import { Animal } from './animal.js';
import { Sprites } from '../../sprites.js';

class Gazelle extends Animal {
    constructor() {
        super(...arguments);
        this.attributes = {
            food: 150
        }
    }
}
Gazelle.prototype.SUBTILE_WIDTH = 1;
Gazelle.prototype.NAME = "Gazelle";
Gazelle.prototype.AVATAR = Sprites.Sprite("img/interface/avatars/gazelle.png");
Gazelle.prototype.MAX_HP = 8;
Gazelle.prototype.SPEED = 2;

Gazelle.prototype.ATTRIBUTES = {}

Gazelle.prototype.STATE = Object.assign({}, Gazelle.prototype.STATE);
Gazelle.prototype.STATE.SLOW = 1 << Gazelle.prototype.BASE_STATE_MASK_WIDTH;
Gazelle.prototype.STATE.SLOW_IDLE = Gazelle.prototype.STATE.IDLE | Gazelle.prototype.STATE.SLOW;
Gazelle.prototype.STATE.SLOW_MOVING = Gazelle.prototype.STATE.MOVING | Gazelle.prototype.STATE.SLOW;
Gazelle.prototype.STATE.SLOW_DYING = Gazelle.prototype.STATE.DYING | Gazelle.prototype.STATE.SLOW;


Gazelle.prototype.IMAGES = {
    [Gazelle.prototype.STATE.IDLE]: Sprites.DirectionSprites("img/units/gazelle/idle/", 1),
    [Gazelle.prototype.STATE.MOVING]: Sprites.DirectionSprites("img/units/gazelle/moving/", 8),
    [Gazelle.prototype.STATE.DYING]: Sprites.DirectionSprites("img/units/gazelle/dying/", 10),
    [Gazelle.prototype.STATE.DEAD]: Sprites.DirectionSprites("img/units/gazelle/dead/", 4),

    [Gazelle.prototype.STATE.SLOW_MOVING]: Sprites.DirectionSprites("img/units/gazelle/slow/", 10)
};
Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.SLOW_IDLE] = Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.IDLE];
Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.SLOW_DYING] = Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.DYING];

Gazelle.prototype.IMAGE_OFFSETS = {
    [Gazelle.prototype.STATE.IDLE]: { x: 11, y: 24 },
    [Gazelle.prototype.STATE.MOVING]: { x: 19, y: 43 },
    [Gazelle.prototype.STATE.DYING]: { x: 15, y: 34 },
    [Gazelle.prototype.STATE.DEAD]: { x: 12, y: 17 },

    [Gazelle.prototype.STATE.SLOW_IDLE]: { x: 11, y: 24 },
    [Gazelle.prototype.STATE.SLOW_MOVING]: { x: 13, y: 35 },
    [Gazelle.prototype.STATE.SLOW_DYING]: { x: 15, y: 34 }
};


export { Gazelle }
