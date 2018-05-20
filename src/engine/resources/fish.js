import { Entity } from '../entity.js';
import { Sprites } from '../../sprites.js';

class FishBig extends Entity {
    constructor(subtile_x, subtile_y) {
        super(...arguments);
        this.attributes = {
            food: 250
        };
        this.hp = FishBig.prototype.MAX_HP;
        this.max_hp = FishBig.prototype.MAX_HP;

        this.createSelectionRect();

        this.frame = 0;
        this.setImage();
        this.resetBoundingBox();
    }
    draw() {
        super.draw();
        this.frame = (this.frame + .5) % this.IMAGES.length;
        this.image.image(this.IMAGES[Math.floor(this.frame)]);
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
            image: this.IMAGES[0],
            hasHitmap: true
        });
        this.add(this.image);
    }
    createSelectionRect() {
        super.createSelectionRect({
            x: -this.IMAGE_OFFSET.x,
            y: -this.IMAGE_OFFSET.y,
            width: this.IMAGES[0].width,
            height: this.IMAGES[0].height
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
FishBig.prototype.MAX_HP = 25;
FishBig.prototype.SUBTILE_WIDTH = 3;
FishBig.prototype.NAME = "Fish";
FishBig.prototype.AVATAR = Sprites.Sprite("img/interface/avatars/fish.png");
FishBig.prototype.TOOLTIP = "Fish here for food.";

FishBig.prototype.IMAGES = Sprites.SpriteSequence("img/resources/fish_big/fish_", 30);
FishBig.prototype.IMAGE_OFFSET =  { x: -5, y: 49 };

export { FishBig }