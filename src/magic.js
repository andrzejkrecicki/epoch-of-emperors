import { Actions } from './engine/actions.js';
import { Player } from './engine/player.js';
import { Building } from './engine/buildings/building.js';
import { Technologies } from './engine/technologies.js';
import { PlayerDefinition } from './utils.js';
import { GameViewer } from './viewer.js';

if (document.location.search == '?dev') {

    const RecruitUnitFactory = Actions.RecruitUnitFactory;
    Actions.RecruitUnitFactory = function(UNIT) {
        const result = RecruitUnitFactory(UNIT);
        result.prototype.time = function() {
            return 35;
        }
        return result;
    }


    Player.prototype.DEFAULT_POPULATION = 1000;


    const constructionTick = Building.prototype.constructionTick;
    Building.prototype.constructionTick = function() {
        this.hp = this.max_hp - 1;
        constructionTick.call(this);
    }

    Technologies.Technology.prototype.time = function() {
        return 35;
    }

    PlayerDefinition.prototype.RESOURCES = {
        wood: 4000,
        food: 4000,
        stone: 4000,
        gold: 4000
    }

    const process = GameViewer.prototype.process;
    GameViewer.prototype.process = function() {
        window.engine = this.engine;
        GameViewer.prototype.process = process;
        this.process();
    }

    const handleLeftClick = GameViewer.prototype.handleLeftClick;
    GameViewer.prototype.handleLeftClick = function(e) {
        let entity = e.target.parent || this.hoveredEntity;
        window.entity = entity;
        let sx = (e.evt.layerX - this.mapDrawable.x());
        let sy = (e.evt.layerY - this.mapDrawable.y());

        if (entity) console.dir(entity);
        else console.log(this.mapDrawable.screenCoordsToSubtile(sx, sy));

        handleLeftClick.call(this, e);
    }
}