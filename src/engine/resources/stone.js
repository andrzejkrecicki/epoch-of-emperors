import { Entity } from '../entity.js';
import { make_image, rand_choice } from '../../utils.js';

class StoneMine extends Entity {
    constructor(subtile_x, subtile_y) {
        super(...arguments);
        this.attributes = {
            stone: 400
        };
        this.imgChoice = Math.floor(Math.random() * this.IMAGES.length);

        this.createSelectionRect();
        this.setImage();
        this.resetBoundingBox();
    }
    getStone() {
        if (this.attributes.stone == 0) {
            this.destroyed = true;
            return 0;
        } else {
            --this.attributes.stone;
            return 1;
        }
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
StoneMine.prototype.SUBTILE_WIDTH = 2;

StoneMine.prototype.NAME = "Stone mine";
StoneMine.prototype.IMAGES = [
    make_image("img/resources/stone/00.png"),
    make_image("img/resources/stone/01.png"),
    make_image("img/resources/stone/02.png"),
    make_image("img/resources/stone/03.png"),
    make_image("img/resources/stone/04.png"),
    make_image("img/resources/stone/05.png"),
    make_image("img/resources/stone/06.png"),
];
StoneMine.prototype.IMAGE_OFFSETS = { x: 12, y: 25 }


export { StoneMine }
