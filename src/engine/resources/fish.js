import { Entity } from '../entity.js';
import { leftpad, make_image, rand_choice } from '../../utils.js';

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
    getFood(engine) {
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
FishBig.prototype.AVATAR = make_image("img/interface/avatars/fish.png");
FishBig.prototype.TOOLTIP = "Fish here for food.";

FishBig.prototype.IMAGES = [];
for (let i = 0; i < 30; ++i) FishBig.prototype.IMAGES.push(
    make_image(`img/resources/fish_big/fish_${leftpad(i, 2, 0)}.png`)
)
FishBig.prototype.IMAGE_OFFSET =  { x: -5, y: 49 };

export { FishBig }