import { Animal } from './animal.js';
import { make_image, leftpad } from '../../utils.js';

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
Gazelle.prototype.AVATAR = make_image("img/interface/avatars/gazelle.png");
Gazelle.prototype.MAX_HP = 8;
Gazelle.prototype.SPEED = 2;

Gazelle.prototype.ATTRIBUTES = {}

Gazelle.prototype.STATE = Object.assign({}, Gazelle.prototype.STATE);
Gazelle.prototype.STATE.ESCAPE = 1 << Gazelle.prototype.BASE_STATE_MASK_WIDTH;
Gazelle.prototype.STATE.ESCAPE_IDLE = Gazelle.prototype.STATE.IDLE | Gazelle.prototype.STATE.ESCAPE;
Gazelle.prototype.STATE.ESCAPE_MOVING = Gazelle.prototype.STATE.MOVING | Gazelle.prototype.STATE.ESCAPE;


Gazelle.prototype.IMAGES = {};

Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.IDLE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.IDLE][dir].push(
        make_image(`img/units/gazelle/idle/${Gazelle.prototype.DIRECTIONS[dir]}_00.png`)
    );
}

Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 10; ++i) {
        Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.MOVING][dir].push(
            make_image(`img/units/gazelle/moving/${Gazelle.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.ESCAPE_IDLE] = Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.IDLE];

Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.ESCAPE_MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 8; ++i) {
        Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.ESCAPE_MOVING][dir].push(
            make_image(`img/units/gazelle/run/${Gazelle.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}


Gazelle.prototype.IMAGE_OFFSETS = {};
Gazelle.prototype.IMAGE_OFFSETS[Gazelle.prototype.STATE.IDLE] = { x: 15, y: 24 };
Gazelle.prototype.IMAGE_OFFSETS[Gazelle.prototype.STATE.MOVING] = { x: 17, y: 34 };

Gazelle.prototype.IMAGE_OFFSETS[Gazelle.prototype.STATE.ESCAPE_IDLE] = { x: 15, y: 24 };
Gazelle.prototype.IMAGE_OFFSETS[Gazelle.prototype.STATE.ESCAPE_MOVING] = { x: 15, y: 44 };


export { Gazelle }
