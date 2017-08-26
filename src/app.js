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
        this.interface_layer = new Konva.Layer();
        this.stage.add(this.interface_layer);

        this.navigator = new MenuNavigator(this.stage, this.interface_layer);
    }
    draw() {
        this.stage.draw();
    }
}
Game.STAGE_WIDTH = 800;
Game.STAGE_HEIGHT = 600;

let game = new Game('container');
game.draw();
