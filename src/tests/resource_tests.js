import { Test } from './test.js';

import { Villager } from '../engine/units/villager.js';
import { TownCenter } from '../engine/buildings/town_center.js';
import { Bush } from '../engine/resources/bush.js';
import { LeafTree } from '../engine/trees.js';


class BushTest extends Test {
    constructor(engine) {
        super(engine)
        this.towncenter = this.building(TownCenter, 1, -8, 0);
        this.villager = this.unit(Villager, 7, -10, 0);
        this.bush = this.entity(Bush, 1, 4);
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.villager, this.bush);
    }
    check() {
        if (this.bush.destroyed &&
            this.engine.current_player.resources.food == 550 &&
            this.engine.current_player.resources.wood == 400 &&
            this.engine.current_player.resources.gold == 400 &&
            this.engine.current_player.resources.stone == 400
        ) this.pass();
    }
}

class TreeTest extends Test {
    constructor(engine) {
        super(engine)
        this.towncenter = this.building(TownCenter, 1, -8, 0);
        this.villager = this.unit(Villager, 7, -10, 0);
        this.tree = this.entity(LeafTree, 1, 4);
    }
    setup() {
        super.setup();
        this.engine.interactOrder(this.villager, this.tree);
    }
    check() {
        if (this.tree.destroyed &&
            this.engine.current_player.resources.food == 400 &&
            this.engine.current_player.resources.wood == 475 &&
            this.engine.current_player.resources.gold == 400 &&
            this.engine.current_player.resources.stone == 400
        ) this.pass();
    }
}

export {
    BushTest,
    TreeTest,
}