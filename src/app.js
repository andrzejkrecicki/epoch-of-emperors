import { Sprites } from './sprites.js';
import './graphics/graphics.js';
import { MenuNavigator } from './navigator.js';

class Game {
    constructor(container) {
        this.stage_width = Game.STAGE_WIDTH;
        this.stage_height = Game.STAGE_HEIGHT;


        this.stage = new Graphics.Stage({
            container: container,
            width: this.stage_width,
            height: this.stage_height
        });

        this.layers = {
            terrain: new Graphics.HitlessLayer(),
            entities: new Graphics.Layer(),
            // grid: new Graphics.GridPreview(this.stage),
            interface: new Graphics.Layer()
        };

        this.stage.add(this.layers.terrain);
        this.stage.add(this.layers.entities);
        // this.stage.add(this.layers.grid);
        this.stage.add(this.layers.interface);

        this.navigator = new MenuNavigator(this.stage, this.layers);
    }
    draw() {
        this.stage.draw();
    }
}
Game.STAGE_WIDTH = 800;
Game.STAGE_HEIGHT = 600;
Game.CURSORS = [
    ["arrow", Sprites.Sprite("img/interface/cursors/arrow.png")],
    ["pointer", Sprites.Sprite("img/interface/cursors/pointer.png")],
    ["attack", Sprites.Sprite("img/interface/cursors/attack.png")],
    ["affect", Sprites.Sprite("img/interface/cursors/affect.png")],
];

document.oncontextmenu = function() { return false; };

Sprites.ready.then(function() {

    const offset_x = 40;
    const offset_y = 20;

    let sheet = document.head.querySelector("style").sheet;
    for (let [className, sprite] of Game.CURSORS) {
        sheet.addRule(
            `#container.${className}`,
            `cursor: url("${sprite.toDataURL()}") ${offset_x} ${offset_y}, auto`
        );
    }

    let game = new Game('container');
    game.draw();
})

