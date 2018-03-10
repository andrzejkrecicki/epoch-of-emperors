import { Entity } from './entity.js';
import { make_image, rand_choice } from '../utils.js';

class Tree extends Entity {
    constructor(subtile_x, subtile_y) {
        super(...arguments);
        this.attributes = {
            wood: 75
        };
        this.hp = Tree.prototype.MAX_HP;
        this.max_hp = Tree.prototype.MAX_HP;
        this.state = Tree.prototype.STATE.ALIVE;
        this.imgChoice = Math.floor(Math.random() * this.IMAGES[this.state].length);

        this.createSelectionRect();
        this.setImage();
        this.resetBoundingBox();
    }
    lumberTick() {
        --this.hp;
        if (this.hp == 0) {
            this.state = Tree.prototype.STATE.CUT;
            this.imgChoice = Math.floor(Math.random() * this.IMAGES[this.state].length);
            this.image.remove();
            this.selectionRect.remove();
            this.createSelectionRect();
            this.setImage();
            this.resetBoundingBox();
        }
    }
    getWood() {
        if (this.attributes.wood == 0) {
            this.destroyed = true;
            return 0;
        } else {
            --this.attributes.wood;
            return 1;
        }
    }
    setImage() {
        this.image = new Graphics.Image({
            x: -this.IMAGE_OFFSETS[this.state][this.imgChoice].x,
            y: -this.IMAGE_OFFSETS[this.state][this.imgChoice].y,
            image: this.IMAGES[this.state][this.imgChoice],
            width: this.IMAGES[this.state][this.imgChoice].width,
            height: this.IMAGES[this.state][this.imgChoice].height,
            hasHitmap: true
        });
        this.add(this.image);
    }
    createSelectionRect() {
        let referenceSprite = this.IMAGES[this.state][this.imgChoice];
        super.createSelectionRect({
            x: Math.round(-this.IMAGE_OFFSETS[this.state][this.imgChoice].x),
            y: Math.round(-this.IMAGE_OFFSETS[this.state][this.imgChoice].y),
            width: referenceSprite.width,
            height: referenceSprite.height
        })
    }
    resetBoundingBox() {
        this.boundingBox = {
            x: this.x() - this.IMAGE_OFFSETS[this.state][this.imgChoice].x,
            y: this.y() - this.IMAGE_OFFSETS[this.state][this.imgChoice].y,
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
Tree.prototype.MAX_HP = 25;
Tree.prototype.SUBTILE_WIDTH = 1;
Tree.prototype.AVATAR = make_image("img/interface/avatars/tree.png");
Tree.prototype.TOOLTIP = "Chop down trees for wood.";

Tree.prototype.STATE = {
    ALIVE: 0,
    CUT: 1
}

Tree.prototype.IMAGES = {};
Tree.prototype.IMAGES[Tree.prototype.STATE.CUT] = [
    make_image("img/trees/cut_00.png"),
    make_image("img/trees/cut_01.png")
];
Tree.prototype.IMAGE_OFFSETS = {};
Tree.prototype.IMAGE_OFFSETS[Tree.prototype.STATE.CUT] = [
    { x: 21, y: 13 },
    { x: -2, y: 19 }
];


class LeafTree extends Tree {
    constructor(x, y) {
        super(...arguments);
    }
}
LeafTree.prototype.NAME = "Leaf Tree";
LeafTree.prototype.IMAGES = {};
LeafTree.prototype.IMAGES[Tree.prototype.STATE.CUT] = Tree.prototype.IMAGES[Tree.prototype.STATE.CUT];
LeafTree.prototype.IMAGES[Tree.prototype.STATE.ALIVE] = [
    make_image("img/trees/leaf_00.png"),
    make_image("img/trees/leaf_01.png"),
    make_image("img/trees/leaf_02.png"),
    make_image("img/trees/leaf_03.png"),
    make_image("img/trees/leaf_04.png"),
    make_image("img/trees/leaf_05.png"),
];
LeafTree.prototype.IMAGE_OFFSETS = {};
LeafTree.prototype.IMAGE_OFFSETS[Tree.prototype.STATE.CUT] = Tree.prototype.IMAGE_OFFSETS[Tree.prototype.STATE.CUT];
LeafTree.prototype.IMAGE_OFFSETS[Tree.prototype.STATE.ALIVE] = [
    { x: 15, y: 54 },
    { x: 6, y: 60 },
    { x: 19, y: 68 },
    { x: 40, y: 66 },
    { x: 18, y: 64 },
    { x: 15, y: 62 },
];


class PalmTree extends Tree {
    constructor(x, y) {
        super(...arguments);
    }
}
PalmTree.prototype.NAME = "Palm";
PalmTree.prototype.IMAGES = {};
PalmTree.prototype.IMAGES[Tree.prototype.STATE.CUT] = Tree.prototype.IMAGES[Tree.prototype.STATE.CUT];
PalmTree.prototype.IMAGES[Tree.prototype.STATE.ALIVE] = [
    make_image("img/trees/palm_00.png"),
    make_image("img/trees/palm_01.png"),
    make_image("img/trees/palm_02.png"),
    make_image("img/trees/palm_03.png"),
];
PalmTree.prototype.IMAGE_OFFSETS = {};
PalmTree.prototype.IMAGE_OFFSETS[Tree.prototype.STATE.CUT] = Tree.prototype.IMAGE_OFFSETS[Tree.prototype.STATE.CUT];
PalmTree.prototype.IMAGE_OFFSETS[Tree.prototype.STATE.ALIVE] = [
    { x: 6, y: 63 },
    { x: 18, y: 57 },
    { x: 21, y: 48 },
    { x: 14, y: 49 },
];


class PineTree extends Tree {
    constructor(x, y) {
        super(...arguments);
    }
}
PineTree.prototype.NAME = "Pine";
PineTree.prototype.IMAGES = {};
PineTree.prototype.IMAGES[Tree.prototype.STATE.CUT] = Tree.prototype.IMAGES[Tree.prototype.STATE.CUT];
PineTree.prototype.IMAGES[Tree.prototype.STATE.ALIVE] = [
    make_image("img/trees/pine_00.png"),
    make_image("img/trees/pine_01.png"),
    make_image("img/trees/pine_02.png"),
    make_image("img/trees/pine_03.png"),
    make_image("img/trees/pine_04.png"),
];
PineTree.prototype.IMAGE_OFFSETS = {};
PineTree.prototype.IMAGE_OFFSETS[Tree.prototype.STATE.CUT] = Tree.prototype.IMAGE_OFFSETS[Tree.prototype.STATE.CUT];
PineTree.prototype.IMAGE_OFFSETS[Tree.prototype.STATE.ALIVE] = [
    { x: 8, y: 75 },
    { x: 16, y: 62 },
    { x: 8, y: 68 },
    { x: 12, y: 56 },
    { x: 10, y: 78 },
];


export { Tree, LeafTree, PalmTree, PineTree }