import { MainMenu, SinglePlayerMenu, RandomMapMenu } from './menu.js';

class MenuNavigator {
    constructor(stage, layer) {
        this.layer = layer;
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
        this.currentMenu = this.menus[menuName]
        this.currentMenu.setListening(true);
        this.layer.add(this.currentMenu);
        this.layer.draw();
    }
}

export {
    MenuNavigator
}