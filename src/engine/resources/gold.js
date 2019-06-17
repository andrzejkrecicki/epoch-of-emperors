import { Entity } from '../entity.js';
import { Sprites } from '../../sprites.js';

class GoldMine extends Entity {
    constructor(subtile_x, subtile_y, imgChoice=-1) {
        super(...arguments);
        this.attributes = {
            gold: 400
        };
        if (imgChoice == -1) this.imgChoice = Math.floor(Math.random() * this.IMAGES.length);
        else this.imgChoice = imgChoice;

        this.setImage();
        this.resetBoundingBox();
    }
    getResource(engine) {
        if (this.attributes.gold > 0) {
            if (--this.attributes.gold == 0) this.destroy(engine);
            return 1;
        }
        return 0;
    }
    getOffset() {
        return this.IMAGE_OFFSETS;
    }
    getSprite() {
        return this.IMAGES[this.imgChoice];
    }
}
GoldMine.prototype.SUBTILE_WIDTH = 2;
GoldMine.prototype.NAME = "Gold Mine";
GoldMine.prototype.AVATAR = Sprites.Sprite("img/interface/avatars/gold.png");
GoldMine.prototype.TOOLTIP = "Mine here for gold.";

GoldMine.prototype.IMAGES = Sprites.SpriteSequence("img/resources/gold/", 7);
GoldMine.prototype.IMAGE_OFFSETS = { x: 12, y: 25 }


export { GoldMine }
