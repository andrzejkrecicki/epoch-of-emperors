import { Animal } from './animal.js';
import { make_image, leftpad } from '../../utils.js';

class Lion extends Animal {
    constructor() {
        super(...arguments);
        this.attributes = {
            food: 450
        }
    }
}
Lion.prototype.SUBTILE_WIDTH = 1;
Lion.prototype.NAME = "Lion";
Lion.prototype.AVATAR = make_image("img/interface/avatars/lion.png");
Lion.prototype.MAX_HP = 24;
Lion.prototype.SPEED = 2;

Lion.prototype.ATTRIBUTES = {}

Lion.prototype.STATE = Object.assign({}, Lion.prototype.STATE);
Lion.prototype.STATE.SLOW = 1 << Lion.prototype.BASE_STATE_MASK_WIDTH;
Lion.prototype.STATE.SLOW_IDLE = Lion.prototype.STATE.IDLE | Lion.prototype.STATE.SLOW;
Lion.prototype.STATE.SLOW_MOVING = Lion.prototype.STATE.MOVING | Lion.prototype.STATE.SLOW;
Lion.prototype.STATE.SLOW_DYING = Lion.prototype.STATE.DYING | Lion.prototype.STATE.SLOW;


Lion.prototype.IMAGES = {};

Lion.prototype.IMAGES[Lion.prototype.STATE.IDLE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    Lion.prototype.IMAGES[Lion.prototype.STATE.IDLE][dir].push(
        make_image(`img/units/lion/idle/${Lion.prototype.DIRECTIONS[dir]}_00.png`)
    );
}

Lion.prototype.IMAGES[Lion.prototype.STATE.MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 12; ++i) {
        Lion.prototype.IMAGES[Lion.prototype.STATE.MOVING][dir].push(
            make_image(`img/units/lion/moving/${Lion.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Lion.prototype.IMAGES[Lion.prototype.STATE.DYING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 10; ++i) {
        Lion.prototype.IMAGES[Lion.prototype.STATE.DYING][dir].push(
            make_image(`img/units/lion/dying/${Lion.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Lion.prototype.IMAGES[Lion.prototype.STATE.DEAD] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 4; ++i) {
        Lion.prototype.IMAGES[Lion.prototype.STATE.DEAD][dir].push(
            make_image(`img/units/lion/dead/${Lion.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}



Lion.prototype.IMAGES[Lion.prototype.STATE.SLOW_IDLE] = Lion.prototype.IMAGES[Lion.prototype.STATE.IDLE];
Lion.prototype.IMAGES[Lion.prototype.STATE.SLOW_DYING] = Lion.prototype.IMAGES[Lion.prototype.STATE.DYING];

Lion.prototype.IMAGES[Lion.prototype.STATE.SLOW_MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 12; ++i) {
        Lion.prototype.IMAGES[Lion.prototype.STATE.SLOW_MOVING][dir].push(
            make_image(`img/units/lion/slow/${Lion.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}


Lion.prototype.IMAGE_OFFSETS = {};
Lion.prototype.IMAGE_OFFSETS[Lion.prototype.STATE.IDLE] = { x: 25, y: 34 };
Lion.prototype.IMAGE_OFFSETS[Lion.prototype.STATE.MOVING] = { x: 27, y: 39 };
Lion.prototype.IMAGE_OFFSETS[Lion.prototype.STATE.DYING] = { x: 27, y: 31 };
Lion.prototype.IMAGE_OFFSETS[Lion.prototype.STATE.DEAD] = { x: 24, y: 19 };

Lion.prototype.IMAGE_OFFSETS[Lion.prototype.STATE.SLOW_IDLE] = { x: 25, y: 34 };
Lion.prototype.IMAGE_OFFSETS[Lion.prototype.STATE.SLOW_MOVING] = { x: 24, y: 28 };
Lion.prototype.IMAGE_OFFSETS[Lion.prototype.STATE.SLOW_DYING] = { x: 27, y: 31 };

export { Lion }
