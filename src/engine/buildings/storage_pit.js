import { Building } from './building.js';
import { RESOURCE_TYPES } from '../../utils.js';
import { Technologies } from '../technologies.js';
import { Sprites } from '../../sprites.js';

class StoragePit extends Building {
    acceptsResource(type) {
        return this.isComplete && (
            type == RESOURCE_TYPES.WOOD ||
            type == RESOURCE_TYPES.STONE ||
            type == RESOURCE_TYPES.GOLD
        );
    }
    actions() {
        if (this.isComplete) return [
            Technologies.Toolworking,
            Technologies.LeatherArmorInfantry,
            Technologies.LeatherArmorArcher,
            Technologies.LeatherArmorCavalry,

            Technologies.Metalworking,
            Technologies.ScaleArmorInfantry,
            Technologies.ScaleArmorArcher,
            Technologies.ScaleArmorCavalry,
            Technologies.BronzeShield,
        ]; else return null;
    }
}
StoragePit.prototype.NAME = "Storage Pit";
StoragePit.prototype.AVATAR = [
    [
        Sprites.Sprite("img/interface/avatars/storage_pit_01_all.png"),
        Sprites.Sprite("img/interface/avatars/storage_pit_01_all.png"),
        Sprites.Sprite("img/interface/avatars/storage_pit_03_greek.png"),
        Sprites.Sprite("img/interface/avatars/storage_pit_04_greek.png")
    ]
];
StoragePit.prototype.MAX_HP = 350;
StoragePit.prototype.SUBTILE_WIDTH = 5;

StoragePit.prototype.ACTION_KEY = "S";
StoragePit.prototype.COST = {
    food: 0, wood: 120, stone: 0, gold: 0
}

StoragePit.prototype.IMAGES = {
    ...Building.prototype.IMAGES,
    [Building.prototype.STATE.DONE]: [
        [
            [Sprites.Sprite("img/buildings/storage_pit/01_all.png")],
            [Sprites.Sprite("img/buildings/storage_pit/01_all.png")],
            [Sprites.Sprite("img/buildings/storage_pit/03_greek.png")],
            [Sprites.Sprite("img/buildings/storage_pit/04_greek.png")]
        ]
    ]
}

StoragePit.prototype.IMAGE_OFFSETS = {
    ...Building.prototype.IMAGE_OFFSETS,
    [Building.prototype.STATE.DONE]: [
        [{ x: 1, y: 64 }, { x: 1, y: 64 }, { x: 2, y: 59 }, { x: 3, y: 53 }]
    ]
}


export { StoragePit }
