import { Entity } from '../entity.js';
import { rand_choice } from '../../utils.js';
import { Sprites } from '../../sprites.js';

class Bush extends Entity {
    constructor(subtile_x, subtile_y) {
        super(...arguments);
        this.attributes = {
            food: 150
        };
        this.hp = Bush.prototype.MAX_HP;
        this.max_hp = Bush.prototype.MAX_HP;

        this.createSelectionRect();
        this.setImage();
        this.resetBoundingBox();
    }
    getResource(engine) {
        if (this.attributes.food > 0) {
            if (--this.attributes.food == 0) this.destroy(engine);
            return 1;
        }
        return 0;
    }
    setImage() {
        this.image = new Graphics.Image({
            x: -this.IMAGE_OFFSET.x,
            y: -this.IMAGE_OFFSET.y,
            image: this.IMAGE,
            hasHitmap: true,
        });
        this.add(this.image);
    }
    createSelectionRect() {
        super.createSelectionRect({
            x: -this.IMAGE_OFFSET.x,
            y: -this.IMAGE_OFFSET.y,
            width: this.IMAGE.width,
            height: this.IMAGE.height
        });
    }
    resetBoundingBox() {
        this.boundingBox = {
            x: this.x() - this.IMAGE_OFFSET.x,
            y: this.y() - this.IMAGE_OFFSET.y,
            w: this.image.width(),
            h: this.image.height()
        }
    }
    getBoundingBox() {
        return this.boundingBox;
    }
    height() {
        return this.image.height();
    }
    width() {
        return this.image.width();
    }
}
Bush.prototype.MAX_HP = 25;
Bush.prototype.SUBTILE_WIDTH = 2;
Bush.prototype.NAME = "Berry Bush";
Bush.prototype.AVATAR = Sprites.Sprite("img/interface/avatars/bush.png");
Bush.prototype.TOOLTIP = "Forage here for food.";

Bush.prototype.IMAGE = Sprites.Sprite("img/resources/bush.png");
Bush.prototype.IMAGE_OFFSET = { x: -12, y: 25 };

export { Bush }