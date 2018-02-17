import { MainMenu, SinglePlayerMenu, RandomMapMenu } from './menu.js';
import { GameViewer } from './viewer.js';


class MenuNavigator {
    constructor(stage, layers) {
        this.stage = stage;
        this.layers = layers;
        this.layers.interface.add(new Graphics.Rect({
            x: 0, y: 0,
            width: stage.width(),
            height: stage.height(),
            fill: "#923d0e"
        }));
        this.menus = {
            MainMenu: new MainMenu(stage, this),
            SinglePlayerMenu: new SinglePlayerMenu(stage, this),
            RandomMapMenu: new RandomMapMenu(stage, this)
        };
        this.navigate("MainMenu");
    }
    navigate(menuName) {
        if (this.currentMenu) {
            this.currentMenu.remove();
            this.currentMenu.setListening(false);
        }
        this.currentMenu = this.menus[menuName];
        this.currentMenu.setListening(true);
        this.layers.interface.add(this.currentMenu);
        this.layers.interface.draw();
    }
    startGame(gameDefinition) {
        this.currentMenu.remove();
        this.currentMenu.setListening(false);
        this.layers.interface.removeChildren();
        this.layers.interface.clear();
        this.gameViewer = new GameViewer(gameDefinition, this, this.layers);
    }
}

export {
    MenuNavigator
}