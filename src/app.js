import Konva from 'konva';
import { MenuNavigator } from './navigator.js';

class Game {
    constructor(container) {
        this.stage_width = Game.STAGE_WIDTH;
        this.stage_height = Game.STAGE_HEIGHT;


        this.stage = new Konva.Stage({
            container: container,
            width: this.stage_width,
            height: this.stage_height
        });

        this.layers = {
            terrain: new Konva.Layer(),
            entities: new Konva.Layer(),
            interface: new Konva.Layer()
        };
        // this.layers.terrain.hitGraphEnabled(false);

        this.stage.add(this.layers.terrain);
        this.stage.add(this.layers.entities);

        this.stage.add(this.layers.interface);

        this.navigator = new MenuNavigator(this.stage, this.layers);
    }
    draw() {
        this.stage.draw();
    }
}
Game.STAGE_WIDTH = 800;
Game.STAGE_HEIGHT = 600;

document.body.oncontextmenu = function() { return false; };
let game = new Game('container');
game.draw();
