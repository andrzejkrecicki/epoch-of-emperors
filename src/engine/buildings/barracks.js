import { Building } from './building.js';
import { ClubMan } from '../units/clubman.js';
import { Actions } from '../actions.js';
import { leftpad } from '../../utils.js';
import { Sprites } from '../../sprites.js';

class Barracks extends Building {
    get ACTIONS() {
        if (this.isComplete) return [
            Actions.RecruitUnitFactory(ClubMan)
        ]; else return null;
    }
}
Barracks.prototype.NAME = "Barracks";
Barracks.prototype.AVATAR = Sprites.Sprite("img/interface/avatars/barracks_all_1.png");
Barracks.prototype.MAX_HP = 350;
Barracks.prototype.SUBTILE_WIDTH = 5;

Barracks.prototype.ACTION_KEY = "B";
Barracks.prototype.COST = {
    food: 0, wood: 125, stone: 0, gold: 0
}

Barracks.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [Sprites.Sprite("img/buildings/barracks/01_all.png")]
};

Barracks.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.DONE]: { x: 11, y: 82 }
}

Barracks.prototype.HITMAP = {
    ...Building.prototype.HITMAP,
    [Barracks.prototype.STATE.DONE]: Graphics.Filters.ComposeHitmask(
        Sprites.Sprite("img/buildings/base_hit_big.png"),
        Sprites.Sprite("img/buildings/barracks/01_all.png"),
        Barracks.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION],
        Barracks.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE]
    )
};


export { Barracks }
