import { Entity } from '../entity.js';
import { rand_choice } from '../../utils.js';
import { Sprites } from '../../sprites.js';

class StoneMine extends Entity {
    constructor(subtile_x, subtile_y, imgChoice=-1) {
        super(...arguments);
        this.attributes = {
            stone: 400
        };
        if (imgChoice == -1) this.imgChoice = Math.floor(Math.random() * this.IMAGES.length);
        this.imgChoice = imgChoice;

        this.hp = this.MAX_HP;
        this.max_hp = this.MAX_HP;

        this.createSelectionRect();
        this.setImage();
        this.resetBoundingBox();
    }
    getResource(engine) {
        if (this.attributes.stone > 0) {
            if (--this.attributes.stone == 0) this.destroy(engine);
            return 1;
        }
        return 0;
    }
    setImage() {
        this.image = new Graphics.Image({
            x: -this.IMAGE_OFFSETS.x,
            y: -this.IMAGE_OFFSETS.y,
            image: this.IMAGES[this.imgChoice],
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
StoneMine.prototype.NAME = "Stone Mine";
StoneMine.prototype.AVATAR = Sprites.Sprite("img/interface/avatars/stone.png");
StoneMine.prototype.MAX_HP = 25;
StoneMine.prototype.TOOLTIP = "Mine here for stone.";


StoneMine.prototype.IMAGES = Sprites.SpriteSequence("img/resources/stone/", 7);
StoneMine.prototype.IMAGE_OFFSETS = { x: 12, y: 25 }


export { StoneMine }
