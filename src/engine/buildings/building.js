import { Entity } from '../entity.js';
import { make_image } from '../../utils.js';


class Building extends Entity {
    constructor(subtile_x, subtile_y, player) {
        super(...arguments);
        this.hp = 1;
        this.max_hp = this.HP;
        this.construction_stage = 0;
        this.isComplete = false;
        this.state = this.STATE.CONSTRUCTION;
        this.createSelectionRect();
        this.setImage();
        this.resetBoundingBox();
        this.tasks = [];
        this.player = player;
        this.player.addBuilding(this);
    }
    setImage() {
        this.removeChildren();
        this.image = new Graphics.Image({
            x: -this.IMAGE_OFFSETS[this.state].x,
            y: -this.IMAGE_OFFSETS[this.state].y,
            image: this.IMAGES[this.state][this.construction_stage],
            width: this.IMAGES[this.state][this.construction_stage].width,
            height: this.IMAGES[this.state][this.construction_stage].height
        });
        this.add(this.image);
    }
    createSelectionRect() {
        super.createSelectionRect({
            x: Math.round(-this.IMAGE_OFFSETS[this.state].x),
            y: Math.round(-this.IMAGE_OFFSETS[this.state].y),
            width: this.IMAGES[this.state][this.construction_stage].width,
            height: this.IMAGES[this.state][this.construction_stage].height
        });
    }
    resetBoundingBox() {
        this.boundingBox = {
            x: this.x() -this.IMAGE_OFFSETS[this.state].x,
            y: this.y() -this.IMAGE_OFFSETS[this.state].y,
            w: this.IMAGES[this.state][this.construction_stage].width,
            h: this.IMAGES[this.state][this.construction_stage].height
        }
    }
    setComplete() {
        this.hp = this.HP;
        this.state = this.STATE.DONE;
        this.isComplete = true;
        this.construction_stage = 0;
        this.setImage();
    }
    constructionTick() {
        ++this.hp;
        if (this.hp == this.HP) this.setComplete();
        else if (this.hp % Math.ceil(this.HP / this.IMAGES[Building.prototype.STATE.CONSTRUCTION].length) == 0) {
            ++this.construction_stage;
            this.setImage();
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
Building.prototype.HAS_BITMAP_HITMASK = true;

Building.prototype.STATE = {
    CONSTRUCTION: 0,
    DONE: 1,
    DENIED: 100,
}
Building.prototype.IMAGES = {};
Building.prototype.IMAGES[Building.prototype.STATE.CONSTRUCTION] = [
    make_image("img/buildings/construction_big_00.png"),
    make_image("img/buildings/construction_big_01.png"),
    make_image("img/buildings/construction_big_02.png"),
    make_image("img/buildings/construction_big_03.png")
];

Building.prototype.IMAGE_OFFSETS = {};
Building.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION] = { x: 5, y: 47 };

Building.prototype.HITMAP = {};
Building.prototype.HITMAP[Building.prototype.STATE.CONSTRUCTION] = Graphics.Filters.BasicHitmask(
    make_image("img/buildings/base_hit_big.png"),
    Building.prototype.IMAGE_OFFSETS[Building.prototype.STATE.CONSTRUCTION]
);

export { Building }
