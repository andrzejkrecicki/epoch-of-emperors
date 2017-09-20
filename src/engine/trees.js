import { Entity } from './entity.js';
import { make_image, rand_choice } from '../utils.js';
import { MapDrawable } from '../viewer.js';

class Tree extends Entity {
    constructor(x, y) {
        super(...arguments);
        this.resources = {
            wood: 75
        };
        this.hp = Tree.HP;
        this.max_hp = Tree.HP;
        this.setImage();
    }
    setImage() {
        let choice = Math.floor(Math.random() * this.constructor.IMAGES.length);
        window.TREE_OFFSETS = this.constructor.IMAGE_OFFSETS;
        this.image = new Konva.Image({
            x: -this.constructor.IMAGE_OFFSETS[choice].x + MapDrawable.TILE_SIZE.width / 2,
            y: -this.constructor.IMAGE_OFFSETS[choice].y + MapDrawable.TILE_SIZE.height / 2,
            image: this.constructor.IMAGES[choice],
            width: this.constructor.IMAGES[choice].width,
            height: this.constructor.IMAGES[choice].height
        });
        this.add(this.image);
    }
    height() {
        return this.image.height();
    }
    width() {
        return this.image.width();
    }
}
Tree.HP = 25;


class LeafTree extends Tree {
    constructor(x, y) {
        super(...arguments);
    }
}
LeafTree.NAME = "Deciduous";
LeafTree.IMAGES = [
    make_image("img/trees/leaf_00.png"),
    make_image("img/trees/leaf_01.png"),
    make_image("img/trees/leaf_02.png"),
    make_image("img/trees/leaf_03.png"),
    make_image("img/trees/leaf_04.png"),
    make_image("img/trees/leaf_05.png"),
];
LeafTree.IMAGE_OFFSETS = [
    { x: 31, y: 54 },
    { x: 22, y: 60 },
    { x: 35, y: 68 },
    { x: 56, y: 66 },
    { x: 34, y: 64 },
    { x: 31, y: 62 }
];


export { Tree, LeafTree }