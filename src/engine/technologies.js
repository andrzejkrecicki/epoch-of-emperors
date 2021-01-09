import { Action } from './base_action.js';
import { Sprites } from '../sprites.js';
import { ClubMan } from './units/clubman.js';
import { SwordsMan } from './units/swordsman.js';
import { ImprovedBowMan } from './units/improved_bowman.js';
import { FishingBoat } from './units/fishing_boat.js';
import { TradeBoat } from './units/trade_boat.js';
import { ScoutShip } from './units/scout_ship.js';
import { Wall } from './buildings/wall.js';
import { Tower } from './buildings/tower.js';
import { UNIT_TYPES, FPS } from '../utils.js';


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


class Age extends Technology {
    finalize() {
        ++this.player.age;
        for (let building of this.player.buildings) {
            if (!building.wasConverted && building.LEVELS_UP_ON_AGE) building.levelUp();
        }
        super.finalize();
        return true;
    }
}
Age.prototype.POS = {
    x: Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}


class ToolAge extends Age {
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
}
ToolAge.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/tool_age.png");
ToolAge.prototype.TOOLTIP = "Advance to Tool Age. Requires two buildings from Stone Age";
ToolAge.prototype.TIME = 120 * FPS;
ToolAge.prototype.COST = {
    food: 500, wood: 0, stone: 0, gold: 0
}


class BattleAxe extends Technology {
    static isVisible(entity) {
        return entity.player.possessions.ToolAge && !entity.player.possessions.BattleAxe;
    }
    finalize() {
        for (let unit of this.player.units) {
            if (!unit.wasConverted && unit instanceof ClubMan) unit.levelUp();
        }
        this.player.defaultEntityLevel.ClubMan = 1;
        super.finalize();
        return true;
    }
}
BattleAxe.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/battle_axe.png");
BattleAxe.prototype.TOOLTIP = "Upgrade to Battle Axe";
BattleAxe.prototype.TIME = 40 * FPS;
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
Toolworking.prototype.TIME = 40 * FPS;
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
LeatherArmorInfantry.prototype.TIME = 30 * FPS;
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
LeatherArmorArcher.prototype.TIME = 30 * FPS;
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
LeatherArmorCavalry.prototype.TIME = 30 * FPS;
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
Domestication.prototype.TIME = 40 * FPS;
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
Woodworking.prototype.TIME = 60 * FPS;
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
StoneMining.prototype.TIME = 30 * FPS;
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
GoldMining.prototype.TIME = 50 * FPS;
GoldMining.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 2 + Action.prototype.MARGIN,
    y: Action.prototype.MARGIN
}
GoldMining.prototype.COST = {
    food: 120, wood: 100, stone: 0, gold: 0
}


class SmallWall extends Technology {
    static isVisible(entity) {
        return entity.player.possessions.ToolAge && !entity.player.possessions.SmallWall;
    }
}
SmallWall.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/small_wall.png");
SmallWall.prototype.TOOLTIP = "Research Small Wall.";
SmallWall.prototype.TIME = 10 * FPS;
SmallWall.prototype.POS = {
    x: Action.prototype.MARGIN,
    y: Action.prototype.MARGIN
}
SmallWall.prototype.COST = {
    food: 50, wood: 0, stone: 0, gold: 0
}


class WatchTower extends Technology {
    static isVisible(entity) {
        return entity.player.possessions.ToolAge && !entity.player.possessions.WatchTower;
    }
}
WatchTower.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/watch_tower.png");
WatchTower.prototype.TOOLTIP = "Research Watch Tower.";
WatchTower.prototype.TIME = 10 * FPS;
WatchTower.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 1 + Action.prototype.MARGIN,
    y: Action.prototype.MARGIN
}
WatchTower.prototype.COST = {
    food: 50, wood: 0, stone: 0, gold: 0
}



class BronzeAge extends Age {
    static isVisible(entity) {
        return !entity.player.possessions.BronzeAge && entity.player.possessions.ToolAge;
    }
    static isPossible(entity) {
        return (
            +!!entity.player.possessions.ArcheryRange +
            +!!entity.player.possessions.Stable +
            +!!entity.player.possessions.Market
        ) >= 2;
    }
}
BronzeAge.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/bronze_age.png");
BronzeAge.prototype.TOOLTIP = "Advance to Bronze Age. Requires two buildings from Tool Age";
BronzeAge.prototype.TIME = 140 * FPS;
BronzeAge.prototype.COST = {
    food: 800, wood: 0, stone: 0, gold: 0
}


class Artisanship extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            entity.player.possessions.Woodworking &&
            !entity.player.possessions.Artisanship
        );
    }
    finalize() {
        this.player.interactionBonus.ChopInteraction += 12;
        this.player.attributeBonus.villager.capacity.wood += 2;

        super.finalize();
        return true;
    }
}
Artisanship.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/artisanship.png");
Artisanship.prototype.TOOLTIP = "Research Artisanship: +1 missile weapon range; +2 woodcutting";
Artisanship.prototype.TIME = 80 * FPS;
Artisanship.prototype.POS = {
    x: Action.prototype.MARGIN,
    y: Action.prototype.MARGIN
}
Artisanship.prototype.COST = {
    food: 170, wood: 150, stone: 0, gold: 0
}


class Plow extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            entity.player.possessions.Domestication &&
            !entity.player.possessions.Plow
        );
    }
    finalize() {
        this.player.attributeBonus.farm.food += 75;

        super.finalize();
        return true;
    }
}
Plow.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/plow.png");
Plow.prototype.TOOLTIP = "Research Plow: +75 food production for farms.";
Plow.prototype.TIME = 75 * FPS;
Plow.prototype.POS = {
    x: Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}
Plow.prototype.COST = {
    food: 250, wood: 75, stone: 0, gold: 0
}


class Wheel extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            !entity.player.possessions.Wheel
        );
    }
    finalize() {
        this.player.attributeBonus.villager.speed += .3;

        super.finalize();
        return true;
    }
}
Wheel.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/wheel.png");
Wheel.prototype.TOOLTIP = "Research Wheel: Villagers 30% faster. Required for chariots.";
Wheel.prototype.TIME = 75 * FPS;
Wheel.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 3 + Action.prototype.MARGIN,
    y: Action.prototype.MARGIN,
}
Wheel.prototype.COST = {
    food: 175, wood: 75, stone: 0, gold: 0
}



class ImprovedBow extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            !entity.player.possessions.ImprovedBow
        );
    }
}
ImprovedBow.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/improved_bow.png");
ImprovedBow.prototype.TOOLTIP = "Research Improved Bow.";
ImprovedBow.prototype.TIME = 60 * FPS;
ImprovedBow.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 1 + Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2,
}
ImprovedBow.prototype.COST = {
    food: 140, wood: 80, stone: 0, gold: 0
}


class CompositeBow extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            entity.player.possessions.ImprovedBow &&
            !entity.player.possessions.CompositeBow
        );
    }
    finalize() {
        for (let unit of this.player.units) {
            if (!unit.wasConverted && unit instanceof ImprovedBowMan) unit.levelUp();
        }
        this.player.defaultEntityLevel.ImprovedBowMan = 1;
        super.finalize();
        return true;
    }
}
CompositeBow.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/composite_bow.png");
CompositeBow.prototype.TOOLTIP = "Upgrade to Composite Bow.";
CompositeBow.prototype.TIME = 100 * FPS;
CompositeBow.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 1 + Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2,
}
CompositeBow.prototype.COST = {
    food: 180, wood: 100, stone: 0, gold: 0
}



class ShortSword extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            entity.player.possessions.BattleAxe &&
            !entity.player.possessions.ShortSword
        );
    }
}
ShortSword.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/short_sword.png");
ShortSword.prototype.TOOLTIP = "Research Short Sword";
ShortSword.prototype.TIME = 50 * FPS;
ShortSword.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 1 + Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}
ShortSword.prototype.COST = {
    food: 120, wood: 0, stone: 0, gold: 50
}


class BroadSword extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            entity.player.possessions.ShortSword &&
            !entity.player.possessions.BroadSword
        );
    }
    finalize() {
        for (let unit of this.player.units) {
            if (!unit.wasConverted && unit instanceof SwordsMan) unit.levelUp();
        }
        this.player.defaultEntityLevel.SwordsMan = 1;
        super.finalize();
        return true;
    }
}
BroadSword.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/broad_sword.png");
BroadSword.prototype.TOOLTIP = "Upgrade to Broad Sword";
BroadSword.prototype.TIME = 80 * FPS;
BroadSword.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 1 + Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}
BroadSword.prototype.COST = {
    food: 140, wood: 0, stone: 0, gold: 50
}



class Metalworking extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            entity.player.possessions.Toolworking &&
            !entity.player.possessions.Metalworking
        );
    }
    finalize() {
        this.player.attributeBonus.infantry.attack += 2;
        this.player.attributeBonus.cavalry.attack += 2;

        super.finalize();
        return true;
    }
}
Metalworking.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/metalworking.png");
Metalworking.prototype.TOOLTIP = "Research Metalworking: +2 hand-to-hand unit attack.";
Metalworking.prototype.TIME = 75 * FPS;
Metalworking.prototype.POS = {
    x: Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}
Metalworking.prototype.COST = {
    food: 200, wood: 0, stone: 0, gold: 120
}


class ScaleArmorInfantry extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            entity.player.possessions.LeatherArmorInfantry &&
            !entity.player.possessions.ScaleArmorInfantry
        );
    }
    finalize() {
        this.player.attributeBonus.infantry.armor += 2;

        super.finalize();
        return true;
    }
}
ScaleArmorInfantry.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/scale_armor_infantry.png");
ScaleArmorInfantry.prototype.TOOLTIP = "Research Scale Armor: +2 infantry armor.";
ScaleArmorInfantry.prototype.TIME = 60 * FPS;
ScaleArmorInfantry.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 1 + Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}
ScaleArmorInfantry.prototype.COST = {
    food: 100, wood: 0, stone: 0, gold: 50
}



class ScaleArmorArcher extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            entity.player.possessions.LeatherArmorArcher &&
            !entity.player.possessions.ScaleArmorArcher
        );
    }
    finalize() {
        this.player.attributeBonus.archer.armor += 2;

        super.finalize();
        return true;
    }
}
ScaleArmorArcher.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/scale_armor_archer.png");
ScaleArmorArcher.prototype.TOOLTIP = "Research Scale Armor: +2 archer armor.";
ScaleArmorArcher.prototype.TIME = 60 * FPS;
ScaleArmorArcher.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 2 + Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}
ScaleArmorArcher.prototype.COST = {
    food: 125, wood: 0, stone: 0, gold: 50
}


class ScaleArmorCavalry extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            entity.player.possessions.LeatherArmorCavalry &&
            !entity.player.possessions.ScaleArmorCavalry
        );
    }
    finalize() {
        this.player.attributeBonus.cavalry.armor += 2;

        super.finalize();
        return true;
    }
}
ScaleArmorCavalry.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/scale_armor_cavalry.png");
ScaleArmorCavalry.prototype.TOOLTIP = "Research Scale Armor: +2 cavalry armor.";
ScaleArmorCavalry.prototype.TIME = 60 * FPS;
ScaleArmorCavalry.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 3 + Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}
ScaleArmorCavalry.prototype.COST = {
    food: 150, wood: 0, stone: 0, gold: 50
}


class BronzeShield extends Technology {
    static isVisible(entity) {
        return entity.player.possessions.BronzeAge && !entity.player.possessions.BronzeShield;
    }
    finalize() {
        this.player.attributeBonus.infantry.missile_armor += 1;

        super.finalize();
        return true;
    }
}
BronzeShield.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/bronze_shield.png");
BronzeShield.prototype.TOOLTIP = "Research Bronze Shield: +1 infantry armor vs. missile weapons.";
BronzeShield.prototype.TIME = 50 * FPS;
BronzeShield.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 4 + Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}
BronzeShield.prototype.COST = {
    food: 150, wood: 0, stone: 0, gold: 180
}


class MediumWall extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            entity.player.possessions.SmallWall &&
            !entity.player.possessions.MediumWall
        );
    }
    finalize() {
        for (let building of this.player.buildings) {
            if (!building.wasConverted && building instanceof Wall) building.levelUp();
        }
        this.player.defaultEntityLevel.Wall = 1;
        super.finalize();
        return true;
    }
}
MediumWall.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/medium_wall.png");
MediumWall.prototype.TOOLTIP = "Upgrade to Medium Wall.";
MediumWall.prototype.TIME = 60 * FPS;
MediumWall.prototype.POS = {
    x: Action.prototype.MARGIN,
    y: Action.prototype.MARGIN
}
MediumWall.prototype.COST = {
    food: 180, wood: 0, stone: 100, gold: 0
}


class SentryTower extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            entity.player.possessions.WatchTower &&
            !entity.player.possessions.SentryTower
        );
    }
    finalize() {
        for (let building of this.player.buildings) {
            if (!building.wasConverted && building instanceof Tower) building.levelUp();
        }
        this.player.defaultEntityLevel.Tower = 1;
        super.finalize();
        return true;
    }
}
SentryTower.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/sentry_tower.png");
SentryTower.prototype.TOOLTIP = "Upgrade to Sentry Tower.";
SentryTower.prototype.TIME = 30 * FPS;
SentryTower.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 1 + Action.prototype.MARGIN,
    y: Action.prototype.MARGIN
}
SentryTower.prototype.COST = {
    food: 120, wood: 0, stone: 50, gold: 0
}


class FishingShip extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            !entity.player.possessions.FishingShip
        );
    }
    finalize() {
        for (let unit of this.player.units) {
            if (!unit.wasConverted && unit instanceof FishingBoat) {
                unit.levelUp();
                this.player.attributeBonus.fishing_boat.capacity.food += 5;
            }
        }
        this.player.defaultEntityLevel.FishingBoat = 1;
        super.finalize();
        return true;
    }
}
FishingShip.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/fishing_ship.png");
FishingShip.prototype.TOOLTIP = "Upgrade to Fishing Ship";
FishingShip.prototype.TIME = 15 * FPS;
FishingShip.prototype.POS = {
    x: Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}
FishingShip.prototype.COST = {
    food: 50, wood: 100, stone: 0, gold: 0
}


class MerchantShip extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            !entity.player.possessions.MerchantShip
        );
    }
    finalize() {
        for (let unit of this.player.units) {
            if (!unit.wasConverted && unit instanceof TradeBoat) unit.levelUp();
        }
        this.player.defaultEntityLevel.TradeBoat = 1;
        super.finalize();
        return true;
    }
}
MerchantShip.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/merchant_ship.png");
MerchantShip.prototype.TOOLTIP = "Upgrade to Merchant Ship";
MerchantShip.prototype.TIME = 30 * FPS;
MerchantShip.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 1 + Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}
MerchantShip.prototype.COST = {
    food: 200, wood: 75, stone: 0, gold: 0
}


class WarGallery extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            !entity.player.possessions.WarGallery
        );
    }
    finalize() {
        for (let unit of this.player.units) {
            if (!unit.wasConverted && unit instanceof ScoutShip) unit.levelUp();
        }
        this.player.defaultEntityLevel.ScoutShip = 1;
        super.finalize();
        return true;
    }
}
WarGallery.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/war_gallery.png");
WarGallery.prototype.TOOLTIP = "Upgrade to War Gallery";
WarGallery.prototype.TIME = 38 * FPS;
WarGallery.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 3 + Action.prototype.MARGIN,
    y: Action.prototype.SIZE + Action.prototype.MARGIN * 2
}
WarGallery.prototype.COST = {
    food: 150, wood: 75, stone: 0, gold: 0
}


class Nobility extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            !entity.player.possessions.Nobility
        );
    }
    finalize() {
        for (let unit of this.player.units) {
            if (!unit.wasConverted && unit.TYPE == UNIT_TYPES.CAVALRY) {
                let delta = Math.floor(unit.max_hp * 0.15);
                unit.max_hp += delta;
                unit.hp += delta;
            }
        }
        this.player.attributeBonus.cavalry.hp_multiplier = 1.15;
        super.finalize();
        return true;
    }
}
Nobility.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/nobility.png");
Nobility.prototype.TOOLTIP = "Research Nobility: +15% Cavalry, Chariot, Horse Archer hit points.";
Nobility.prototype.TIME = 70 * FPS;
Nobility.prototype.POS = {
    x: Action.prototype.MARGIN,
    y: Action.prototype.MARGIN
}
Nobility.prototype.COST = {
    food: 175, wood: 0, stone: 0, gold: 120
}


class Writing extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            !entity.player.possessions.Writing
        );
    }
}
Writing.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/writing.png");
Writing.prototype.TOOLTIP = "Research Writing: Shared exploration with allies.";
Writing.prototype.TIME = 60 * FPS;
Writing.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 1 + Action.prototype.MARGIN,
    y: Action.prototype.MARGIN
}
Writing.prototype.COST = {
    food: 200, wood: 0, stone: 0, gold: 75
}


class Architecture extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            !entity.player.possessions.Architecture
        );
    }
    finalize() {
        for (let building of this.player.buildings) {
            if (!building.wasConverted) {
                let delta = Math.floor(building.max_hp * 0.2);
                building.max_hp += delta;
                if (building.isComplete) building.hp += delta;
            }
        }
        this.player.interactionBonus.BuilderInteraction += 1;
        this.player.attributeBonus.building.hp_multiplier += 0.2;
        super.finalize();
        return true;
    }
}
Architecture.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/architecture.png");
Architecture.prototype.TOOLTIP = "Research Architecture: -33% build time; +20% building/wall HPs";
Architecture.prototype.TIME = 50 * FPS;
Architecture.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 2 + Action.prototype.MARGIN,
    y: Action.prototype.MARGIN
}
Architecture.prototype.COST = {
    food: 175, wood: 0, stone: 0, gold: 150
}


class Astrology extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            !entity.player.possessions.Astrology
        );
    }
    finalize() {
        this.player.interactionBonus.ConversionInteraction += 0.3;
        super.finalize();
        return true;
    }
}
Astrology.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/astrology.png");
Astrology.prototype.TOOLTIP = "Research Astrology: Conversion 30% more effective";
Astrology.prototype.TIME = 50 * FPS;
Astrology.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 1 + Action.prototype.MARGIN,
    y: Action.prototype.MARGIN
}
Astrology.prototype.COST = {
    food: 0, wood: 0, stone: 0, gold: 150
}


class Mysticism extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            !entity.player.possessions.Mysticism
        );
    }
    finalize() {
        for (let unit of this.player.units) {
            if (!unit.wasConverted && unit.TYPE == UNIT_TYPES.PRIEST) {
                let delta = Math.floor(unit.max_hp * 1);
                unit.max_hp += delta;
                unit.hp += delta;
            }
        }
        this.player.attributeBonus.priest.hp_multiplier = 2;
        super.finalize();
        return true;
    }
}
Mysticism.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/mysticism.png");
Mysticism.prototype.TOOLTIP = "Research Mysticism: Double Priest hit points";
Mysticism.prototype.TIME = 50 * FPS;
Mysticism.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 2 + Action.prototype.MARGIN,
    y: Action.prototype.MARGIN
}
Mysticism.prototype.COST = {
    food: 0, wood: 0, stone: 0, gold: 120
}


class Polytheism extends Technology {
    static isVisible(entity) {
        return (
            entity.player.possessions.BronzeAge &&
            !entity.player.possessions.Polytheism
        );
    }
    finalize() {
        this.player.attributeBonus.priest.speed += .3;
        super.finalize();
        return true;
    }
}
Polytheism.prototype.IMAGE = Sprites.Sprite("img/interface/technologies/polytheism.png");
Polytheism.prototype.TOOLTIP = "Research Polytheism: Priest moves 40% faster";
Polytheism.prototype.TIME = 50 * FPS;
Polytheism.prototype.POS = {
    x: (Action.prototype.SIZE + Action.prototype.MARGIN * 2) * 3 + Action.prototype.MARGIN,
    y: Action.prototype.MARGIN
}
Polytheism.prototype.COST = {
    food: 0, wood: 0, stone: 0, gold: 120
}




const Technologies = {
    Technology,

    ToolAge,
    BattleAxe,
    Toolworking,
    LeatherArmorInfantry,
    LeatherArmorArcher,
    LeatherArmorCavalry,
    Domestication,
    Woodworking,
    StoneMining,
    GoldMining,
    SmallWall,
    WatchTower,

    BronzeAge,
    Artisanship,
    Plow,
    Wheel,
    ImprovedBow,
    CompositeBow,
    ShortSword,
    BroadSword,
    Metalworking,
    ScaleArmorInfantry,
    ScaleArmorArcher,
    ScaleArmorCavalry,
    BronzeShield,
    MediumWall,
    SentryTower,
    FishingShip,
    MerchantShip,
    WarGallery,
    Nobility,
    Writing,
    Architecture,
    Astrology,
    Mysticism,
    Polytheism
}

export { Technologies };
