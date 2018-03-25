import { Entity } from '../entity.js';
import { make_image, rand_choice } from '../../utils.js';

class GoldMine extends Entity {
    constructor(subtile_x, subtile_y) {
        super(...arguments);
        this.attributes = {
            gold: 400
        };
        this.imgChoice = Math.floor(Math.random() * this.IMAGES.length);
        this.hp = this.MAX_HP;
        this.max_hp = this.MAX_HP;

        this.createSelectionRect();
        this.setImage();
        this.resetBoundingBox();
    }
    getGold() {
        if (this.attributes.gold > 0) {
            if (--this.attributes.gold == 0) this.destroyed = true;
            return 1;
        }
        return 0;
    }
    setImage() {
        this.image = new Graphics.Image({
            x: -this.IMAGE_OFFSETS.x,
            y: -this.IMAGE_OFFSETS.y,
            image: this.IMAGES[this.imgChoice],
            width: this.IMAGES[this.imgChoice].width,
            height: this.IMAGES[this.imgChoice].height,
            hasHitmap: true
        });
        this.add(this.image);
    }
    createSelectionRect() {
        let referenceSprite = this.IMAGES[this.imgChoice];
        super.createSelectionRect({
            x: Math.round(-this.IMAGE_OFFSETS.x),
            y: Math.round(-this.IMAGE_OFFSETS.y),
            width: referenceSprite.width,
            height: referenceSprite.height
        })
    }
    resetBoundingBox() {
        this.boundingBox = {
            x: this.x() - this.IMAGE_OFFSETS.x,
            y: this.y() - this.IMAGE_OFFSETS.y,
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
GoldMine.prototype.SUBTILE_WIDTH = 2;
GoldMine.prototype.NAME = "Gold Mine";
GoldMine.prototype.AVATAR = make_image("img/interface/avatars/gold.png");
GoldMine.prototype.MAX_HP = 25;
GoldMine.prototype.TOOLTIP = "Mine here for gold.";


GoldMine.prototype.IMAGES = [
    make_image("img/resources/gold/00.png"),
    make_image("img/resources/gold/01.png"),
    make_image("img/resources/gold/02.png"),
    make_image("img/resources/gold/03.png"),
    make_image("img/resources/gold/04.png"),
    make_image("img/resources/gold/05.png"),
    make_image("img/resources/gold/06.png"),
];
GoldMine.prototype.IMAGE_OFFSETS = { x: 12, y: 25 }


export { GoldMine }
