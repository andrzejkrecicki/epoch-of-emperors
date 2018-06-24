import { Action } from './base_action.js';
import { Sprites } from '../sprites.js';

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
    static isVisible(viewer) {
        return !viewer.engine.selectedEntity.player.possessions.ToolAge;
    }
    static isPossible(viewer) {
        return (
            +!!viewer.engine.selectedEntity.player.possessions.Barracks +
            +!!viewer.engine.selectedEntity.player.possessions.StoragePit +
            +!!viewer.engine.selectedEntity.player.possessions.Granary +
            +!!viewer.engine.selectedEntity.player.possessions.Dock
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

let Technologies = {
    ToolAge
}

export { Technologies };
