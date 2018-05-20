import { Building } from './building.js';
import { Villager } from '../units/villager.js';
import { Actions } from '../actions.js';
import { leftpad } from '../../utils.js';
import { Sprites } from '../../sprites.js';

class TownCenter extends Building {
    get ACTIONS() {
        if (this.isComplete) return [
            Actions.RecruitUnitFactory(Villager)
        ]; else return null;
    }
    acceptsResource(type) {
        return this.isComplete;
    }
}
TownCenter.prototype.NAME = "Town Center";
TownCenter.prototype.AVATAR = Sprites.Sprite("img/interface/avatars/town_center_01_all.png");
TownCenter.prototype.MAX_HP = 600;
TownCenter.prototype.SUBTILE_WIDTH = 5;

TownCenter.prototype.ACTION_KEY = "N";
TownCenter.prototype.COST = {
    food: 0, wood: 200, stone: 0, gold: 0
}

TownCenter.prototype.IMAGES = Object.assign({}, Building.prototype.IMAGES);
TownCenter.prototype.IMAGES[Building.prototype.STATE.DONE] = [Sprites.Sprite("img/buildings/town_center/01_all.png")];
TownCenter.prototype.IMAGES[Building.prototype.STATE.DENIED] = [Graphics.Filters.RedFilter(Sprites.Sprite("img/buildings/town_center/01_all.png"))];

TownCenter.prototype.IMAGE_OFFSETS = Object.assign({}, Building.prototype.IMAGE_OFFSETS);
TownCenter.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE] = { x: 3, y: 54 };

TownCenter.prototype.HITMAP = Object.assign({}, Building.prototype.HITMAP);
TownCenter.prototype.HITMAP[TownCenter.prototype.STATE.DONE] = Graphics.Filters.ComposeHitmask(
    Sprites.Sprite("img/buildings/base_hit_big.png"),
    Sprites.Sprite("img/buildings/town_center/01_all.png"),
    TownCenter.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION],
    TownCenter.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE]
);

export { TownCenter }
