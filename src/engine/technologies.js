import { Action } from './base_action.js';
import { Sprites } from '../sprites.js';
import { ClubMan } from './units/clubman.js';

class Technology extends Action {
    getCost() {
        return this.COST;
    }
    execute() {
        if (this.checkCost(this.COST) == false) return;
        this.entity.addTask(this);
    }
    time() {
        return this.TIME;
    }
    finalize() {
        this.player.possessions[this.constructor.name] = (this.player.possessions[this.constructor.name] || 0) + 1;
        return true;
    }
}

class ToolAge extends Technology {
    static isVisible(entity) {
        return !entity.player.possessions.ToolAge;
    }
    static isPossible(entity) {
        return (
            +!!entity.player.possessions.Barracks +
            +!!entity.player.possessions.StoragePit +
            +!!entity.player.possessions.Granary +
            +!!entity.player.possessions.Dock
        ) >= 2;
    }
    finalize() {
        ++this.player.age;
        for (let building of this.player.buildings) {
            if (!building.wasConverted) building.levelUp();
        }
        super.finalize();
        return true;
    }
}
ToolAge.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/tool_age.png");
ToolAge.prototype.TOOLTIP = "Advance to Tool Age. Requires two buildings from Stone Age";
ToolAge.prototype.TIME = 200;
ToolAge.prototype.POS = {
    x: Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}
ToolAge.prototype.COST = {
    food: 500, wood: 0, stone: 0, gold: 0
}


class BattleAxe extends Technology {
    static isVisible(entity) {
        return entity.player.possessions.ToolAge && !entity.player.possessions.BattleAxe;
    }
    finalize() {
        for (let unit of this.player.units) {
            if (!unit.wasConverted && unit instanceof ClubMan) {
                unit.levelUp();
                unit.max_hp += 10;
                unit.hp += 10;
                unit.attributes.attack += 2;
            }
        }
        this.player.defaultEntityLevel.ClubMan = 1;
        super.finalize();
        return true;
    }
}
BattleAxe.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/battle_axe.png");
BattleAxe.prototype.TOOLTIP = "Upgrade to Battle Axe";
BattleAxe.prototype.TIME = 200;
BattleAxe.prototype.POS = {
    x: Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}
BattleAxe.prototype.COST = {
    food: 100, wood: 0, stone: 0, gold: 0
}


class Toolworking extends Technology {
    static isVisible(entity) {
        return entity.player.possessions.ToolAge && !entity.player.possessions.Toolworking;
    }
    finalize() {
        this.player.attributeBonus.infantry.attack += 2;
        this.player.attributeBonus.cavalry.attack += 2;

        super.finalize();
        return true;
    }
}
Toolworking.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/toolworking.png");
Toolworking.prototype.TOOLTIP = "Research Toolworking: +2 hand-to-hand unit attack.";
Toolworking.prototype.TIME = 40 * 35;
Toolworking.prototype.POS = {
    x: Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}
Toolworking.prototype.COST = {
    food: 100, wood: 0, stone: 0, gold: 0
}


class LeatherArmorInfantry extends Technology {
    static isVisible(entity) {
        return entity.player.possessions.ToolAge && !entity.player.possessions.LeatherArmorInfantry;
    }
    finalize() {
        this.player.attributeBonus.infantry.armor += 2;

        super.finalize();
        return true;
    }
}
LeatherArmorInfantry.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/leather_armor_infantry.png");
LeatherArmorInfantry.prototype.TOOLTIP = "Research Leather Armor: +2 infantry armor.";
LeatherArmorInfantry.prototype.TIME = 30 * 35;
LeatherArmorInfantry.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 1 + Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}
LeatherArmorInfantry.prototype.COST = {
    food: 75, wood: 0, stone: 0, gold: 0
}


class LeatherArmorArcher extends Technology {
    static isVisible(entity) {
        return entity.player.possessions.ToolAge && !entity.player.possessions.LeatherArmorArcher;
    }
    finalize() {
        this.player.attributeBonus.archer.armor += 2;

        super.finalize();
        return true;
    }
}
LeatherArmorArcher.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/leather_armor_archer.png");
LeatherArmorArcher.prototype.TOOLTIP = "Research Leather Armor: +2 archer armor.";
LeatherArmorArcher.prototype.TIME = 30 * 35;
LeatherArmorArcher.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 2 + Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}
LeatherArmorArcher.prototype.COST = {
    food: 100, wood: 0, stone: 0, gold: 0
}


class LeatherArmorCavalry extends Technology {
    static isVisible(entity) {
        return entity.player.possessions.ToolAge && !entity.player.possessions.LeatherArmorCavalry;
    }
    finalize() {
        this.player.attributeBonus.cavalry.armor += 2;

        super.finalize();
        return true;
    }
}
LeatherArmorCavalry.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/leather_armor_cavalry.png");
LeatherArmorCavalry.prototype.TOOLTIP = "Research Leather Armor: +2 cavalry armor.";
LeatherArmorCavalry.prototype.TIME = 30 * 35;
LeatherArmorCavalry.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 3 + Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}
LeatherArmorCavalry.prototype.COST = {
    food: 125, wood: 0, stone: 0, gold: 0
}


class Domestication extends Technology {
    static isVisible(entity) {
        return entity.player.possessions.ToolAge && !entity.player.possessions.Domestication;
    }
    finalize() {
        this.player.attributeBonus.farm.food += 75;

        super.finalize();
        return true;
    }
}
Domestication.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/domestication.png");
Domestication.prototype.TOOLTIP = "Research Domestication: +75 food production for farms.";
Domestication.prototype.TIME = 40 * 35;
Domestication.prototype.POS = {
    x: Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}
Domestication.prototype.COST = {
    food: 200, wood: 50, stone: 0, gold: 0
}


class Woodworking extends Technology {
    static isVisible(entity) {
        return entity.player.possessions.ToolAge && !entity.player.possessions.Woodworking;
    }
    finalize() {
        this.player.interactionBonus.ChopInteraction += 16;
        this.player.attributeBonus.villager.capacity.wood += 2;

        super.finalize();
        return true;
    }
}
Woodworking.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/woodworking.png");
Woodworking.prototype.TOOLTIP = "Research Woodworking: +1 missile weapon range; +2 woodcutting";
Woodworking.prototype.TIME = 60 * 35;
Woodworking.prototype.POS = {
    x: Action.prototype.MARGIN,
    y: Action.prototype.MARGIN
}
Woodworking.prototype.COST = {
    food: 120, wood: 75, stone: 0, gold: 0
}


class StoneMining extends Technology {
    static isVisible(entity) {
        return entity.player.possessions.ToolAge && !entity.player.possessions.StoneMining;
    }
    finalize() {
        this.player.interactionBonus.StoneMineInteraction += 31;
        this.player.attributeBonus.villager.capacity.stone += 3;

        super.finalize();
        return true;
    }
}
StoneMining.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/stone_mining.png");
StoneMining.prototype.TOOLTIP = "Research Stone Mining: +3 stone mining; +1 Slinger attack range.";
StoneMining.prototype.TIME = 60 * 35;
StoneMining.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 1 + Action.prototype.MARGIN,
    y: Action.prototype.MARGIN
}
StoneMining.prototype.COST = {
    food: 100, wood: 0, stone: 50, gold: 0
}


class GoldMining extends Technology {
    static isVisible(entity) {
        return entity.player.possessions.ToolAge && !entity.player.possessions.GoldMining;
    }
    finalize() {
        this.player.interactionBonus.GoldMineInteraction += 31;
        this.player.attributeBonus.villager.capacity.gold += 3;

        super.finalize();
        return true;
    }
}
GoldMining.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/gold_mining.png");
GoldMining.prototype.TOOLTIP = "Research Gold Mining: +3 gold mining.";
GoldMining.prototype.TIME = 60 * 35;
GoldMining.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 2 + Action.prototype.MARGIN,
    y: Action.prototype.MARGIN
}
GoldMining.prototype.COST = {
    food: 120, wood: 100, stone: 0, gold: 0
}




const Technologies = {
    ToolAge,
    BattleAxe,
    Toolworking,
    LeatherArmorInfantry,
    LeatherArmorArcher,
    LeatherArmorCavalry,
    Domestication,
    Woodworking,
    StoneMining,
    GoldMining
}

export { Technologies };
