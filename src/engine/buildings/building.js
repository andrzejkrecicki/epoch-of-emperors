import { Entity } from '../entity.js';
import { TERRAIN_TYPES } from '../terrain.js';
import { Sprites } from '../../sprites.js';
import { Flame } from './details.js';


class Building extends Entity {
    constructor(subtile_x, subtile_y, player) {
        super(...arguments);
        this.hp = 1;
        this.max_hp = Math.floor(this.MAX_HP[this.level] * player.attributeBonus[this.TYPE].hp_multiplier);
        this.construction_stage = 0;
        this.isComplete = false;
        this.normalized = true;
        this.attributes.progress = "0%";
        this.state = this.STATE.CONSTRUCTION;
        this.tasks = [];
        this.tasks_counts = {};
        this.player = player;
        this.player.addBuilding(this);

        this.setImage();
        this.createFlames();
        this.resetBoundingBox();
        this.createHealthBar();
    }
    createSelectionRect() {
        this.selectionRect = new Graphics.SelectionRect(this.SUBTILE_WIDTH, 6, 3);
        this.add(this.selectionRect);
    }
    getSprite() {
        return this.IMAGES[this.state][this.player.civ][this.level][this.construction_stage];
    }
    getOffset() {
        return this.IMAGE_OFFSETS[this.state][this.player.civ][this.level];
    }
    setComplete() {
        this.hp = this.max_hp;
        this.state = this.STATE.DONE;
        this.isComplete = true;
        this.construction_stage = 0;
        this.attributes.progress = null;
        this.updateImage();
        this.actions_changed = true;
        this.player.possessions[this.constructor.name] = (this.player.possessions[this.constructor.name] || 0) + 1;
    }
    levelUp() {
        this.setLevel(this.level + 1);
        this.updateImage();
    }
    createFlames() {
        this.flames = [];
        for (let pos of this.FLAME_POSITIONS) {
            let flame = new Flame(pos.x, pos.y, this.flames.length % 2, -1);
            this.flames.push(flame);
            this.add(flame);
        }
    }
    adjustFlames(percentage) {
        for (let flame of this.flames) flame.setPercentage(percentage);
    }
    getInteractionType(object) {
    }
    actions() {
        return null;
    }
    get ACTIONS() {
        let actions = this.actions();
        if (this.tasks.length) {
            if (this.tasks[0].SUPPORTS_QUEUE) return actions.filter((a) => a.prototype.SUPPORTS_QUEUE);
            else return actions.filter((a) => this.tasks[0] instanceof a);
        } else return actions;
    }
    constructionTick() {
        ++this.hp;
        this.attributes.progress = Math.floor(100 * this.hp / this.max_hp) + "%";
        let img_seq = this.IMAGES[Building.prototype.STATE.CONSTRUCTION][this.player.civ][this.player.age];
        if (this.hp == this.max_hp) this.setComplete();
        else if (this.hp % Math.ceil(this.max_hp / img_seq.length) == 0) {
            this.construction_stage = this.hp / Math.ceil(this.max_hp / img_seq.length);
            this.updateImage();
        }
    }
    repairTick() {
        ++this.hp;
        this.adjustFlames((this.max_hp - this.hp) / this.max_hp);
    }
    addTask(task) {
        if (!task.SUPPORTS_QUEUE && this.tasks.length) return;
        this.tasks.push(task);
        if (task.SUPPORTS_QUEUE) this.tasks_counts[task.HASH] = (this.tasks_counts[task.HASH] || 0) + 1;
        this.actions_changed = true;
    }
    process() {
        if (this.tasks.length) this.processTasks();
        this.processInteraction();
    }
    processTasks() {
        let task = this.tasks[0];
        if (this.ticks_waited == 0 && !task.init()) {
            this.attributes.progress = "0%";
            return;
        }
        if (this.ticks_waited < task.time()) {
            this.attributes.progress = Math.floor(100 * ++this.ticks_waited / task.time()) + "%";
        } else if (task.finalize()) {
            this.ticks_waited = 0;
            this.attributes.progress = null;
            if (task.SUPPORTS_QUEUE) --this.tasks_counts[task.HASH];
            this.actions_changed = true;
            this.tasks.shift();
        }
    }
    getAvatar() {
        return this.AVATAR[this.player.civ][this.level];
    }
    takeHit(value, attacker, engine) {
        this.hp -= value;
        if (this.isComplete) this.adjustFlames((this.max_hp - this.hp) / this.max_hp);
        if (this.hp <= 0) {
            this.hp = 0;
            this.destroy(engine);
        }
    }
    destroy(engine) {
        this.state = this.STATE.DESTROYED;
        super.destroy(engine);
    }
    acceptsResource(type) {
        return false;
    }
    canConstructOn(terrain_counts) {
        return terrain_counts.get(TERRAIN_TYPES.WATER) == null;
    }
    normalize() {
    }
    static isResearched(player) {
        return true;
    }
}
Building.prototype.HAS_BITMAP_HITMASK = true;
Building.prototype.INTERACT_WHEN_COMPLETE = false;
Building.prototype.COLORIZE = true;
Building.prototype.TOOLTIP = "Click to select this building.";
Building.prototype.TYPE = "building";
Building.prototype.CONTINUOUS_PREVIEW = false;
Building.prototype.LEVELS_UP_ON_AGE = true;
Building.prototype.LEAVES_LEFTOVERS = true;
Building.prototype.FLAME_POSITIONS = [{ x: 34, y: 0 }, { x: 84, y: 20 }, { x: 136, y: 2 }, { x: 83, y: -26 }];


Building.prototype.STATE = {
    CONSTRUCTION: 0,
    DONE: 1,
    DESTROYED: 2,
    DENIED: 100,
}
Building.prototype.IMAGES = {
    [Building.prototype.STATE.CONSTRUCTION]: [
        [
            Sprites.SpriteSequence("img/buildings/construction_big_", 4),
            Sprites.SpriteSequence("img/buildings/construction_big_", 4),
            Sprites.SpriteSequence("img/buildings/construction_big_", 4),
            Sprites.SpriteSequence("img/buildings/construction_big_", 4)
        ]
    ],
    [Building.prototype.STATE.DESTROYED]: [
        [
            [Sprites.Sprite("img/buildings/rubble_big.png")],
            [Sprites.Sprite("img/buildings/rubble_big.png")],
            [Sprites.Sprite("img/buildings/rubble_big.png")],
            [Sprites.Sprite("img/buildings/rubble_big.png")]
        ]
    ]
}

Building.prototype.IMAGE_OFFSETS = {
    [Building.prototype.STATE.CONSTRUCTION]: [
        [{ x: 5, y: 47 }, { x: 5, y: 47 }, { x: 5, y: 47 }, { x: 5, y: 47 }]
    ],
    [Building.prototype.STATE.DESTROYED]: [
        [{ x: -11, y: 40 }, { x: -11, y: 40 }, { x: -11, y: 40 }, { x: -11, y: 40 }]
    ]
}


export { Building }
