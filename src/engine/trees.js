import { Entity } from './entity.js';
import { TreeStump } from './flat_drawables.js';
import { Sprites } from '../sprites.js';

class Tree extends Entity {
    constructor(subtile_x, subtile_y, imgChoice=-1) {
        super(...arguments);
        this.attributes = {
            wood: 75
        };
        this.hp = Tree.prototype.MAX_HP;
        this.max_hp = Tree.prototype.MAX_HP;
        this.state = Tree.prototype.STATE.ALIVE;
        if (imgChoice == -1) this.imgChoice = Math.floor(Math.random() * this.IMAGES[this.state].length);
        else this.imgChoice = imgChoice;

        this.setImage();
        this.resetBoundingBox();
    }
    lumberTick() {
        --this.hp;
        if (this.hp == 0) {
            this.state = Tree.prototype.STATE.CUT;
            this.imgChoice = Math.floor(Math.random() * this.IMAGES[this.state].length);
            this.updateImage();
            this.resetBoundingBox();
        }
    }
    getResource(engine) {
        if (this.attributes.wood > 0) {
            if (--this.attributes.wood == 0) this.destroy(engine);
            return 1;
        }
        return 0;
    }
    getOffset() {
        return this.IMAGE_OFFSETS[this.state][this.imgChoice];
    }
    getSprite() {
        return this.IMAGES[this.state][this.imgChoice];
    }
}
Tree.prototype.MAX_HP = [25];
Tree.prototype.SUBTILE_WIDTH = 1;
Tree.prototype.AVATAR = Sprites.Sprite("img/interface/avatars/tree.png");
Tree.prototype.TOOLTIP = "Chop down trees for wood.";
Tree.prototype.LEFTOVERS = TreeStump;

Tree.prototype.STATE = {
    ALIVE: 0,
    CUT: 1
}

Tree.prototype.IMAGES = {
    [Tree.prototype.STATE.CUT]: Sprites.OldSpriteSequence("img/trees/cut_", 2)
};
Tree.prototype.IMAGE_OFFSETS = {
    [Tree.prototype.STATE.CUT]: [
        { x: 21, y: 13 },
        { x: -2, y: 19 }
    ]
};


class LeafTree extends Tree {
}
LeafTree.prototype.NAME = "Leaf Tree";
LeafTree.prototype.IMAGES = {
    [Tree.prototype.STATE.CUT]: Tree.prototype.IMAGES[Tree.prototype.STATE.CUT],
    [Tree.prototype.STATE.ALIVE]: Sprites.OldSpriteSequence("img/trees/leaf_", 6)
}

LeafTree.prototype.IMAGE_OFFSETS = {
    [Tree.prototype.STATE.CUT]: Tree.prototype.IMAGE_OFFSETS[Tree.prototype.STATE.CUT],
    [Tree.prototype.STATE.ALIVE]: [
        { x: 15, y: 54 },
        { x: 40, y: 68 },
        { x: 19, y: 68 },
        { x: 40, y: 66 },
        { x: 18, y: 64 },
        { x: 15, y: 62 },
    ]
};

class PalmTree extends Tree {
}
PalmTree.prototype.NAME = "Palm";
PalmTree.prototype.IMAGES = {
    [Tree.prototype.STATE.CUT]: Tree.prototype.IMAGES[Tree.prototype.STATE.CUT],
    [Tree.prototype.STATE.ALIVE]: Sprites.OldSpriteSequence("img/trees/palm_", 4)
};

PalmTree.prototype.IMAGE_OFFSETS = {
    [Tree.prototype.STATE.CUT]: Tree.prototype.IMAGE_OFFSETS[Tree.prototype.STATE.CUT],
    [Tree.prototype.STATE.ALIVE]: [
        { x: 6, y: 63 },
        { x: 18, y: 57 },
        { x: 21, y: 48 },
        { x: 14, y: 49 },
    ]
};


class PineTree extends Tree {
}
PineTree.prototype.NAME = "Pine";
PineTree.prototype.IMAGES = {
    [Tree.prototype.STATE.CUT]: Tree.prototype.IMAGES[Tree.prototype.STATE.CUT],
    [Tree.prototype.STATE.ALIVE]: Sprites.OldSpriteSequence("img/trees/pine_", 5)
};

PineTree.prototype.IMAGE_OFFSETS = {
    [Tree.prototype.STATE.CUT]: Tree.prototype.IMAGE_OFFSETS[Tree.prototype.STATE.CUT],
    [Tree.prototype.STATE.ALIVE]: [
        { x: 8, y: 75 },
        { x: 16, y: 62 },
        { x: 8, y: 68 },
        { x: 12, y: 56 },
        { x: 10, y: 78 },
    ]
};


export { Tree, LeafTree, PalmTree, PineTree }
