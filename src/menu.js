import { TextButton, Header, Label, DropDown } from './ui.js';
import { PlayerDefinition, PLAYER_COLOURS, CIVILIZATIONS, CIVILIZATIONS_NAMES } from './utils.js';

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
        this.game_definition = {
            players: this.getDefaultPlayersDefinitions()
        };
        this.initializeWidgets();
    }
    initializeWidgets() {
        this.cancelBtn = new TextButton(
            this.stage.width() - 80 - 300,
            this.stage.height() - 15 - TextButton.DEFAULT_RECT_OPTIONS.height,
            { text: 'Cancel' },
            { width: 300 }
        );
        this.add(this.cancelBtn);

        this.startGameBtn = new TextButton(
            80,
            this.stage.height() - 15 - TextButton.DEFAULT_RECT_OPTIONS.height,
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
            text: 'Colour',
            x: row_offset, y: 80
        }));
        row_offset += RandomMapMenu.PLAYER_SECTION_WIDTH;
        this.add(new Header({
            text: 'Team',
            x: row_offset, y: 80
        }));

        this.playersSection = new Konva.Group({
            x: 30,
            y: 120
        });
        this.add(this.playersSection);
        this.initialziePlayersSection();


        this.add(new Header({
            x: 30, y: this.stage.height() - 220,
            text: 'Number of Players'
        }));
        this.numOfPlayers = new DropDown(
            30, this.stage.height() - 200, 80,
            [2, 3, 4, 5, 6], 2
        );
        this.add(this.numOfPlayers);
        this.numOfPlayers.on("update", () => {
            let old_val = this.game_definition.players.length;
            let new_val = this.numOfPlayers.chosenIndex + 1;
            if (old_val > new_val) {
                this.game_definition.players = this.game_definition.players.slice(
                    0, new_val + 1
                );
            } else {
                for (let i = old_val; i <= new_val; ++i ) {
                    this.game_definition.players.push(new PlayerDefinition(i, `Computer ${i}`, null, PLAYER_COLOURS[i], null, true));
                }
            }
            this.playersSection.removeChildren();
            this.initialziePlayersSection();
            this.fire("refresh");
        });

        this.cancelBtn.on("click", () => {
            this.navigator.navigate("SinglePlayerMenu");
        });
    }
    initialziePlayersSection() {
        var offset = {
            x: 0, y: 0
        }
        for (let i = 0; i < this.game_definition.players.length; ++i) {
            offset.x = 0;

            this.playersSection.add(new Label({
                text: this.game_definition.players[i].name,
                x: offset.x, y: offset.y
            }));

            offset.x += RandomMapMenu.NAME_SECTION_WIDTH;

            let civDropDown = new DropDown(
                offset.x, offset.y , 150, 
                CIVILIZATIONS_NAMES, this.game_definition.players[i].civ
            );
            civDropDown.options.setZIndex(10);
            this.playersSection.add(civDropDown);

            offset.y += 40;
        }
    }
    getDefaultPlayersDefinitions() {
        return [
            new PlayerDefinition(0, "You", null, PLAYER_COLOURS[0], null),
            new PlayerDefinition(1, "Computer 1", null, PLAYER_COLOURS[1], null, true),
            new PlayerDefinition(2, "Computer 2", null, PLAYER_COLOURS[2], null, true),
            new PlayerDefinition(3, "Computer 3", null, PLAYER_COLOURS[3], null, true)
        ];
    }
}
RandomMapMenu.NAME_SECTION_WIDTH = 170;
RandomMapMenu.CIV_SECTION_WIDTH = 170;
RandomMapMenu.PLAYER_SECTION_WIDTH = 90;
RandomMapMenu.DEFAULT_PLAYERS_NUMBER = 4;


export {
    MainMenu, SinglePlayerMenu, RandomMapMenu
}