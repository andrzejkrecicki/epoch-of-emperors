import { Building } from './building.js';
import { FireSmall, SmokeSmall } from './details.js';
import { RESOURCE_TYPES } from '../../utils.js';
import { Sprites } from '../../sprites.js';

class House extends Building {
    constructor() {
        super(...arguments);
        this.add(this.fire_small = new FireSmall({
            x: 50 - this.IMAGE_OFFSETS[this.STATE.DONE].x,
            y: 30 - this.IMAGE_OFFSETS[this.STATE.DONE].y,
            visible: false
        }));
        this.add(this.smoke_small = new SmokeSmall({
            x: 51 - this.IMAGE_OFFSETS[this.STATE.DONE].x,
            y: 23 - this.IMAGE_OFFSETS[this.STATE.DONE].y,
            visible: false
        }));
    }
    setComplete() {
        super.setComplete();
        this.fire_small.show();
        this.smoke_small.show();
        this.player.max_population += House.prototype.PEOPLE_PER_HOUSE;
        let that = this;
        this.attributes = {
            get population() {
                return `${that.player.population}/${that.player.max_population}`;
            }
        }
    }
    destroy(engine) {
        super.destroy(engine);
        if (this.isComplete) this.player.max_population -= House.prototype.PEOPLE_PER_HOUSE;
    }
}
House.prototype.NAME = "House";
House.prototype.AVATAR = Sprites.Sprite("img/interface/avatars/house_01_all.png");
House.prototype.MAX_HP = 75;
House.prototype.SUBTILE_WIDTH = 3;
House.prototype.PEOPLE_PER_HOUSE = 4;

House.prototype.ACTION_KEY = "E";
House.prototype.COST = {
    food: 0, wood: 30, stone: 0, gold: 0
}

House.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [Sprites.Sprite("img/buildings/house/01_all.png")],
    [Building.prototype.STATE.CONSTRUCTION]: Sprites.SpriteSequence("img/buildings/house/construction_01_all_", 4)
}

House.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.CONSTRUCTION]: { x: -2, y: 30 },
    [Building.prototype.STATE.DONE]: { x: -9, y: 25 }
}

House.prototype.HITMAP = {
    ...Building.prototype.HITMAP,
    [House.prototype.STATE.DONE]: Graphics.Filters.ComposeHitmask(
        Sprites.Sprite("img/buildings/house/base_hit_01_all.png"),
        Sprites.Sprite("img/buildings/house/01_all.png"),
        House.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION],
        House.prototype.IMAGE_OFFSETS[Building.prototype.STATE.DONE]
    )
}

export { House }
