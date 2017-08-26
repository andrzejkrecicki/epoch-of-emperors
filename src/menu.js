import { TextButton } from './ui.js';

class Menu extends Konva.Group {
    constructor(stage, nav) {
        super();
        this.navigator = nav;
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
            stage_center.x - TextButton.DEFAULT_OPTIONS.width / 2,
            stage_center.y - (TextButton.DEFAULT_OPTIONS.height + btnMargin) * 2,
            { text: 'Single Player' }
        );
        this.add(this.singlePlayerBtn);
        this.multiPlayerBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_OPTIONS.width / 2,
            stage_center.y - (TextButton.DEFAULT_OPTIONS.height + btnMargin) * 1,
            { text: 'Multi Player' }
        );
        this.add(this.multiPlayerBtn);
        this.scenarioBuilderBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_OPTIONS.width / 2,
            stage_center.y - (TextButton.DEFAULT_OPTIONS.height + btnMargin) * 0,
            { text: 'Scenario Builder' }
        );
        this.add(this.scenarioBuilderBtn);
        this.helpBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_OPTIONS.width / 2,
            stage_center.y + (TextButton.DEFAULT_OPTIONS.height + btnMargin) * 1,
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
            stage_center.x - TextButton.DEFAULT_OPTIONS.width / 2,
            stage_center.y - (TextButton.DEFAULT_OPTIONS.height + btnMargin) * 2,
            { text: 'Random Map' }
        );
        this.add(this.randomMapBtn);
        this.campaignBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_OPTIONS.width / 2,
            stage_center.y - (TextButton.DEFAULT_OPTIONS.height + btnMargin) * 1,
            { text: 'Campaign' }
        );
        this.add(this.campaignBtn);
        this.scenarioBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_OPTIONS.width / 2,
            stage_center.y - (TextButton.DEFAULT_OPTIONS.height + btnMargin) * 0,
            { text: 'Scenario' }
        );
        this.add(this.scenarioBtn);
        this.savedGameBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_OPTIONS.width / 2,
            stage_center.y + (TextButton.DEFAULT_OPTIONS.height + btnMargin) * 1,
            { text: 'Saved Game' }
        );
        this.add(this.savedGameBtn);
        this.cancelBtn = new TextButton(
            stage_center.x - TextButton.DEFAULT_OPTIONS.width / 2,
            stage_center.y + (TextButton.DEFAULT_OPTIONS.height + btnMargin) * 2,
            { text: 'Cancel' }
        );
        this.add(this.cancelBtn);

        this.cancelBtn.on("click", () => {
            this.navigator.navigate("MainMenu");
        });
    }
}


export {
    MainMenu, SinglePlayerMenu
}