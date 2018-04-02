import { Entity } from '../entity.js';
import { make_image } from '../../utils.js';


class Building extends Entity {
    constructor(subtile_x, subtile_y, player) {
        super(...arguments);
        this.hp = 1;
        this.max_hp = this.MAX_HP;
        this.construction_stage = 0;
        this.isComplete = false;
        this.attributes.progress = "0%";
        this.state = this.STATE.CONSTRUCTION;
        this.createSelectionRect();
        this.setImage();
        this.resetBoundingBox();
        this.tasks = [];
        this.tasks_counts = {};
        this.player = player;
        this.player.addBuilding(this);
    }
    setImage() {
        this.image = new Graphics.Image({
            x: -this.IMAGE_OFFSETS[this.state].x,
            y: -this.IMAGE_OFFSETS[this.state].y,
            image: this.IMAGES[this.state][this.construction_stage],
        });
        this.add(this.image);
    }
    updateImage() {
        this.image.image(this.IMAGES[this.state][this.construction_stage]);
        this.image.x(-this.IMAGE_OFFSETS[this.state].x);
        this.image.y(-this.IMAGE_OFFSETS[this.state].y);
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
        this.hp = this.MAX_HP;
        this.state = this.STATE.DONE;
        this.isComplete = true;
        this.construction_stage = 0;
        this.attributes.progress = null;
        this.updateImage();
        this.actions_changed = true;
    }
    constructionTick() {
        ++this.hp;
        this.attributes.progress = Math.floor(100 * this.hp / this.MAX_HP) + "%";
        if (this.hp == this.MAX_HP) this.setComplete();
        else if (this.hp % Math.ceil(this.MAX_HP / this.IMAGES[Building.prototype.STATE.CONSTRUCTION].length) == 0) {
            ++this.construction_stage;
            this.updateImage();
        }
    }
    addTask(task) {
        this.tasks.push(task);
        if (task.SUPPORTS_QUEUE) this.tasks_counts[task.HASH] = (this.tasks_counts[task.HASH] || 0) + 1;
        this.actions_changed = true;
    }
    processTasks() {
        let task = this.tasks[0];
        if (this.ticks_waited == 0 && !task.init()) {
            this.attributes.progress = "0%";
            return;
        }
        if (this.ticks_waited < task.time()) {
            this.attributes.progress = Math.floor(100 * ++this.ticks_waited / task.time()) + "%";
        } else {
            if (task.finalize()) {
                this.ticks_waited = 0;
                this.attributes.progress = null;
                if (task.SUPPORTS_QUEUE) --this.tasks_counts[task.HASH];
                this.actions_changed = true;
                this.tasks.shift();
            }
        }
    }
    acceptsResource(type) {
        return false;
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
Building.prototype.INTERACT_WHEN_COMPLETE = false;
Building.prototype.TOOLTIP = "Click to select this building.";

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
