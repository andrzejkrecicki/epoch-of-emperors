import { Animal } from './animal.js';
import { make_image, leftpad } from '../../utils.js';

class Gazelle extends Animal {
    constructor() {
        super(...arguments);
        this.attributes = {
            food: 150
        }
    }
    toggleDead(engine) {
        if (this.attributes.food > 0 && this.ticks_waited > 4 * 35) {
            --this.attributes.food;
            this.ticks_waited = 0;
        } else ++this.ticks_waited;

        if (this.attributes.food == 0) {
            this.state = Animal.prototype.STATE.DEAD;
            this.destroy(engine);
        }
    }
    takeHit(value, engine) {
        super.takeHit(value, engine);
        if (this.hp > 0) engine.escapeOrder(this);
    }
}
Gazelle.prototype.SUBTILE_WIDTH = 1;
Gazelle.prototype.NAME = "Gazelle";
Gazelle.prototype.AVATAR = make_image("img/interface/avatars/gazelle.png");
Gazelle.prototype.MAX_HP = 8;
Gazelle.prototype.SPEED = 2;

Gazelle.prototype.ATTRIBUTES = {}

Gazelle.prototype.STATE = Object.assign({}, Gazelle.prototype.STATE);
Gazelle.prototype.STATE.SLOW = 1 << Gazelle.prototype.BASE_STATE_MASK_WIDTH;
Gazelle.prototype.STATE.SLOW_IDLE = Gazelle.prototype.STATE.IDLE | Gazelle.prototype.STATE.SLOW;
Gazelle.prototype.STATE.SLOW_MOVING = Gazelle.prototype.STATE.MOVING | Gazelle.prototype.STATE.SLOW;
Gazelle.prototype.STATE.SLOW_DYING = Gazelle.prototype.STATE.DYING | Gazelle.prototype.STATE.SLOW;


Gazelle.prototype.IMAGES = {};

Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.IDLE] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.IDLE][dir].push(
        make_image(`img/units/gazelle/idle/${Gazelle.prototype.DIRECTIONS[dir]}_00.png`)
    );
}

Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 8; ++i) {
        Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.MOVING][dir].push(
            make_image(`img/units/gazelle/run/${Gazelle.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.DYING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 10; ++i) {
        Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.DYING][dir].push(
            make_image(`img/units/gazelle/dying/${Gazelle.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}

Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.DEAD] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 4; ++i) {
        Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.DEAD][dir].push(
            make_image(`img/units/gazelle/dead/${Gazelle.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}



Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.SLOW_IDLE] = Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.IDLE];
Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.SLOW_DYING] = Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.DYING];

Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.SLOW_MOVING] = new Array(8).fill(null).map(() => []);
for (let dir = 0; dir < 8; ++dir) {
    for (let i = 0; i < 10; ++i) {
        Gazelle.prototype.IMAGES[Gazelle.prototype.STATE.SLOW_MOVING][dir].push(
            make_image(`img/units/gazelle/moving/${Gazelle.prototype.DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`)
        )
    }
}


Gazelle.prototype.IMAGE_OFFSETS = {};
Gazelle.prototype.IMAGE_OFFSETS[Gazelle.prototype.STATE.IDLE] = { x: 15, y: 24 };
Gazelle.prototype.IMAGE_OFFSETS[Gazelle.prototype.STATE.MOVING] = { x: 15, y: 44 };
Gazelle.prototype.IMAGE_OFFSETS[Gazelle.prototype.STATE.DYING] = { x: 19, y: 33 };
Gazelle.prototype.IMAGE_OFFSETS[Gazelle.prototype.STATE.DEAD] = { x: 16, y: 19 };

Gazelle.prototype.IMAGE_OFFSETS[Gazelle.prototype.STATE.SLOW_IDLE] = { x: 15, y: 24 };
Gazelle.prototype.IMAGE_OFFSETS[Gazelle.prototype.STATE.SLOW_MOVING] = { x: 17, y: 34 };
Gazelle.prototype.IMAGE_OFFSETS[Gazelle.prototype.STATE.SLOW_DYING] = { x: 19, y: 33 };

export { Gazelle }
