import { TextButton, Header, Label, DropDown } from './ui.js';

class Menu extends Konva.Group {
    constructor(stage, nav) {
        super();
        this.stage = stage;
        this.navigator = nav;
        this.on("refresh", this.refresh)
    }
    refresh(e) {
        this.parent.draw();
        e.cancelBubble = true;
    }
}

class MainMenu extends Menu {
    constructor(stage, nav) {
        super(...arguments);
        let stage_center = {
            x: stage.width() / 2,
            y: stage.height() / 2
        };
        let btnMargin = 20;
        this.singlePlayerBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_RECT_OPTIONS.width / 2,
            stage_center.y - (TextButton.DEFAULT_RECT_OPTIONS.height + btnMargin) * 2,
            { text: 'Single Player' }
        );
        this.add(this.singlePlayerBtn);
        this.multiPlayerBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_RECT_OPTIONS.width / 2,
            stage_center.y - (TextButton.DEFAULT_RECT_OPTIONS.height + btnMargin) * 1,
            { text: 'Multi Player' }
        );
        this.add(this.multiPlayerBtn);
        this.scenarioBuilderBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_RECT_OPTIONS.width / 2,
            stage_center.y - (TextButton.DEFAULT_RECT_OPTIONS.height + btnMargin) * 0,
            { text: 'Scenario Builder' }
        );
        this.add(this.scenarioBuilderBtn);
        this.helpBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_RECT_OPTIONS.width / 2,
            stage_center.y + (TextButton.DEFAULT_RECT_OPTIONS.height + btnMargin) * 1,
            { text: 'Help' }
        );
        this.add(this.helpBtn);

        this.singlePlayerBtn.on("click", () => {
            this.navigator.navigate("SinglePlayerMenu");
        });
    }
}

class SinglePlayerMenu extends Menu {
    constructor(stage, nav) {
        super(...arguments);
        let stage_center = {
            x: stage.width() / 2,
            y: stage.height() / 2
        };
        let btnMargin = 20;
        this.randomMapBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_RECT_OPTIONS.width / 2,
            stage_center.y - (TextButton.DEFAULT_RECT_OPTIONS.height + btnMargin) * 2,
            { text: 'Random Map' }
        );
        this.add(this.randomMapBtn);
        this.campaignBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_RECT_OPTIONS.width / 2,
            stage_center.y - (TextButton.DEFAULT_RECT_OPTIONS.height + btnMargin) * 1,
            { text: 'Campaign' }
        );
        this.add(this.campaignBtn);
        this.scenarioBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_RECT_OPTIONS.width / 2,
            stage_center.y - (TextButton.DEFAULT_RECT_OPTIONS.height + btnMargin) * 0,
            { text: 'Scenario' }
        );
        this.add(this.scenarioBtn);
        this.savedGameBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_RECT_OPTIONS.width / 2,
            stage_center.y + (TextButton.DEFAULT_RECT_OPTIONS.height + btnMargin) * 1,
            { text: 'Saved Game' }
        );
        this.add(this.savedGameBtn);
        this.cancelBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_RECT_OPTIONS.width / 2,
            stage_center.y + (TextButton.DEFAULT_RECT_OPTIONS.height + btnMargin) * 2,
            { text: 'Cancel' }
        );
        this.add(this.cancelBtn);

        this.randomMapBtn.on("click", () => {
            this.navigator.navigate("RandomMapMenu");
        });
        this.cancelBtn.on("click", () => {
            this.navigator.navigate("MainMenu");
        });
    }
}

class RandomMapMenu extends Menu {
    constructor(stage, nav) {
        super(...arguments);

        this.cancelBtn = new TextButton(
            stage.width() - 80 - 300,
            stage.height() - 15 - TextButton.DEFAULT_RECT_OPTIONS.height,
            { text: 'Cancel' },
            { width: 300 }
        );
        this.add(this.cancelBtn);

        this.startGameBtn = new TextButton(
            80,
            stage.height() - 15 - TextButton.DEFAULT_RECT_OPTIONS.height,
            { text: 'Start Game' },
            { width: 300 }
        );
        this.add(this.startGameBtn);

        let row_offset = 30;
        this.add(new Header({
            text: 'Name',
            x: row_offset, y: 80
        }));
        row_offset += RandomMapMenu.NAME_SECTION_WIDTH;
        this.add(new Header({
            text: 'Civilization',
            x: row_offset, y: 80
        }));
        row_offset += RandomMapMenu.CIV_SECTION_WIDTH;
        this.add(new Header({
            text: 'Player',
            x: row_offset, y: 80
        }));
        row_offset += RandomMapMenu.PLAYER_SECTION_WIDTH;
        this.add(new Header({
            text: 'Team',
            x: row_offset, y: 80
        }));


        this.add(new Header({
            x: 30, y: stage.height() - 220,
            text: 'Number of Players'
        }));
        this.numOfPlayers = new DropDown(
            30, stage.height() - 200, 80,
            [2, 3, 4, 5, 6], 2
        );
        this.add(this.numOfPlayers);



        this.cancelBtn.on("click", () => {
            this.navigator.navigate("SinglePlayerMenu");
        });
    }
}
RandomMapMenu.NAME_SECTION_WIDTH = 170;
RandomMapMenu.CIV_SECTION_WIDTH = 170;
RandomMapMenu.PLAYER_SECTION_WIDTH = 90;


export {
    MainMenu, SinglePlayerMenu, RandomMapMenu
}