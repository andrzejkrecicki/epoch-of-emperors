import { TextButton, MultiStateButton, Header, Label, DropDown, CheckBox, ColorSelect } from './ui.js';
import { Sprites } from './sprites.js';
import { PlayerDefinition, CIVILIZATIONS_NAMES } from './utils.js';

class Menu extends Graphics.Node {
    constructor(stage, nav) {
        super();
        this.stage = stage;
        this.navigator = nav;
        if (this.BACKGROUND_IMAGE) {
            this.add(this.image = new Graphics.Image({
                image: this.BACKGROUND_IMAGE
            }));
        } else this.image = null;
        this.on("refresh", this.refresh)
    }
    refresh(e) {
        if (this.parent) this.parent.draw();
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
            stage_center.y + (TextButton.DEFAULT_RECT_OPTIONS.height + btnMargin) * -1,
            { text: 'Single Player' }
        );
        this.add(this.singlePlayerBtn);
        this.multiPlayerBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_RECT_OPTIONS.width / 2,
            stage_center.y + (TextButton.DEFAULT_RECT_OPTIONS.height + btnMargin) * 0,
            { text: 'Multi Player' }
        );
        this.add(this.multiPlayerBtn);
        this.scenarioBuilderBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_RECT_OPTIONS.width / 2,
            stage_center.y + (TextButton.DEFAULT_RECT_OPTIONS.height + btnMargin) * 1,
            { text: 'Scenario Builder' }
        );
        this.add(this.scenarioBuilderBtn);
        this.helpBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_RECT_OPTIONS.width / 2,
            stage_center.y + (TextButton.DEFAULT_RECT_OPTIONS.height + btnMargin) * 2,
            { text: 'Help' }
        );
        this.add(this.helpBtn);

        this.singlePlayerBtn.on("click", () => {
            this.navigator.navigate("SinglePlayerMenu");
        });
    }
}
MainMenu.prototype.BACKGROUND_IMAGE = Sprites.Sprite("img/interface/menu_main.png");


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
SinglePlayerMenu.prototype.BACKGROUND_IMAGE = Sprites.Sprite("img/interface/menu_single.png");


class RandomMapMenu extends Menu {
    constructor(stage, nav) {
        super(...arguments);
        this.game_definition = this.getDefaultGameDefinition();
        this.initializeWidgets();
    }
    initializeWidgets() {
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

        this.playersSection = new Graphics.Node({
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
                    this.game_definition.players.push(new PlayerDefinition(i, `Computer ${i}`, null, i, null, true));
                }
            }
            this.playersSection.removeChildren();
            this.initialziePlayersSection();
            this.fire("refresh");
        });

        this.initializeMapSettingsSection();

        this.startGameBtn = new TextButton(
            80,
            this.stage.height() - 15 - TextButton.DEFAULT_RECT_OPTIONS.height,
            { text: 'Start Game' },
            { width: 300 }
        );
        this.add(this.startGameBtn);

        this.startGameBtn.on("click", () => {
            this.navigator.startGame(this.game_definition);
        });

        this.cancelBtn = new TextButton(
            this.stage.width() - 80 - 300,
            this.stage.height() - 15 - TextButton.DEFAULT_RECT_OPTIONS.height,
            { text: 'Cancel' },
            { width: 300 }
        );
        this.add(this.cancelBtn);

        this.cancelBtn.on("click", () => {
            this.navigator.navigate("SinglePlayerMenu");
        });
    }
    initializeMapSettingsSection() {
        let offset = {
            x: this.stage.width() - 280, y: 80
        };
        let that = this;
        this.add(new Header({
            text: "Map Settings",
            x: offset.x,
            y: offset.y
        }));
        offset.y += 40;
        this.add(new Label({
            text: "Map Size",
            x: offset.x,
            y: offset.y
        }));
        offset.x += 80;
        this.mapSizeDropDown = new DropDown(
            offset.x, offset.y - 7, 150,
            RandomMapMenu.MAP_SIZES,
            this.game_definition.map.size
        );
        this.mapSizeDropDown.on("update", function() {
            that.game_definition.map.size = this.chosenIndex
        });
        this.add(this.mapSizeDropDown);
        offset.y += 45;
        offset.x = this.stage.width() - 280;

        this.add(new Label({
            text: "Map Type",
            x: offset.x,
            y: offset.y
        }));
        offset.x += 80;
        this.mapTypeDropDown = new DropDown(
            offset.x, offset.y - 7, 150,
            RandomMapMenu.MAP_TYPES,
            this.game_definition.map.type
        );
        this.mapTypeDropDown.on("update", function() {
            that.game_definition.map.type = this.chosenIndex
        });
        this.add(this.mapTypeDropDown);
        offset.y += 45;
        offset.x = this.stage.width() - 280;

        this.add(new Label({
            text: "Age",
            x: offset.x,
            y: offset.y
        }));
        offset.x += 80;
        this.ageDropDown = new DropDown(
            offset.x, offset.y - 7, 150,
            RandomMapMenu.AGES,
            this.game_definition.map.startingAge
        );
        this.ageDropDown.on("update", function() {
            that.game_definition.map.startingAge = this.chosenIndex
        });
        this.add(this.ageDropDown);
        offset.y += 45;
        offset.x = this.stage.width() - 280;

        this.add(new Label({
            text: "Resources",
            x: offset.x,
            y: offset.y
        }));
        offset.x += 80;
        this.resourcesDropDown = new DropDown(
            offset.x, offset.y - 7, 150,
            RandomMapMenu.RESOURCES,
            this.game_definition.map.resources
        );
        this.resourcesDropDown.on("update", function() {
            that.game_definition.map.resources = this.chosenIndex
        });
        this.add(this.resourcesDropDown);
        offset.y += 45;
        offset.x = this.stage.width() - 280;


        this.add(new Label({
            text: "Difficulty",
            x: offset.x,
            y: offset.y
        }));
        offset.x += 80;
        this.difficultyDropDown = new DropDown(
            offset.x, offset.y - 7, 150,
            RandomMapMenu.DIFFICULTY,
            this.game_definition.map.difficulty
        );
        this.difficultyDropDown.on("update", function() {
            that.game_definition.map.difficulty = this.chosenIndex
        });
        this.add(this.difficultyDropDown);
        offset.y += 45;
        offset.x = this.stage.width() - 280;


        this.add(new Label({
            text: "Reveal Map",
            x: offset.x,
            y: offset.y
        }));
        offset.x += 80;
        this.revealMapCheck = new CheckBox(
            offset.x, offset.y - 7, false
        );
        this.revealMapCheck.on("update", function() {
            that.game_definition.map.revealMap = this.checked
        });
        this.add(this.revealMapCheck);
        offset.y += 45;
        offset.x = this.stage.width() - 280;


        this.add(new Label({
            text: "Full Tech",
            x: offset.x,
            y: offset.y
        }));
        offset.x += 80;
        this.fullTechCheck = new CheckBox(
            offset.x, offset.y - 7, false
        );
        this.fullTechCheck.on("update", function() {
            that.game_definition.map.fullTech = this.checked
        });
        this.add(this.fullTechCheck);
        offset.y += 45;

    }
    initialziePlayersSection() {
        let that = this;
        let offset = {
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
            civDropDown.on("update", (function(){
                return function() {
                    that.game_definition.players[i].civ = this.chosenIndex;
                }
            })(i));
            this.playersSection.add(civDropDown);
            offset.x += RandomMapMenu.CIV_SECTION_WIDTH;

            let colorBtn = new ColorSelect(offset.x + 8, offset.y, this.game_definition.players[i].color);
            this.playersSection.add(colorBtn);
            colorBtn.on("update", function() {
                for (let player of that.game_definition.players) {
                    if (player.color == this.oldColour) player.color = this.color;
                    else if (player.color == this.color) player.color = this.oldColour;
                }
                that.playersSection.removeChildren();
                that.initialziePlayersSection();
                that.fire("refresh");
            })

            offset.x += RandomMapMenu.PLAYER_SECTION_WIDTH;

            let teamButton = new MultiStateButton(
                offset.x, offset.y,
                ["-", "1", "2", "3"],
                this.game_definition.players[i].team || 0
            );
            this.playersSection.add(teamButton);
            teamButton.on("update", (function(i) {
                return function() {
                    that.game_definition.players[i].team = this.currentState || null;
                }
            })(i));

            offset.y += 40;
        }
    }
    getDefaultGameDefinition() {
        return {
            players: [
                new PlayerDefinition(0, "You", 0, 0, null),
                new PlayerDefinition(1, "Computer 1", 0, 1, null, true),
                new PlayerDefinition(2, "Computer 2", 0, 2, null, true),
                new PlayerDefinition(3, "Computer 3", 0, 3, null, true)
            ],
            map: {
                size: 0,
                type: 2,
                startingAge: 0,
                resources: 1,
                difficulty: 2,
                revealMap: false,
                fullTech: false,
                random: true
            }
        };
    }
}
RandomMapMenu.prototype.BACKGROUND_IMAGE = Sprites.Sprite("img/interface/menu_single.png");
RandomMapMenu.NAME_SECTION_WIDTH = 130;
RandomMapMenu.CIV_SECTION_WIDTH = 170;
RandomMapMenu.PLAYER_SECTION_WIDTH = 90;
RandomMapMenu.DEFAULT_PLAYERS_NUMBER = 4;
RandomMapMenu.MAP_SIZES = ["Small", "Medium", "Large"];
RandomMapMenu.MAP_TYPES = ["Small Islands", "Large Islands", "Coastal", "Inland"];
RandomMapMenu.AGES = [/*"Nomad", */"Stone Age", "Tool Age", "Bronze Age", "Iron Age"];
RandomMapMenu.RESOURCES = ["Small", "Medium", "High"];
RandomMapMenu.DIFFICULTY = ["Easiest", "Easy", "Moderate", "Hard", "Hardest"];


export {
    MainMenu, SinglePlayerMenu, RandomMapMenu
}
