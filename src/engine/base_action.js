class Action {
    constructor(viewer) {
        this.viewer = viewer;
        this.entity = this.viewer.engine.selectedEntity;
        this.player = this.entity.player;
        this.failed = false;
        this.progress = null;
    }
    toolTip(player) {
        let chunks = this.toolTipChunks(player);
        if (this.ACTION_KEY) chunks.push(`(${this.ACTION_KEY})`);
        let cost = this.getCost();
        if (cost) chunks.push(`(${this.costToString(cost)})`);
        return chunks.join(" ");
    }
    toolTipChunks() {
        return [this.TOOLTIP];
    }
    getCost() {
        return null;
    }
    checkCost(cost) {
        let deficit = this.player.deficitResource(cost);
        if (deficit != null) {
            this.viewer.setErrorMessage(`Not enough ${deficit}.`);
            return false;
        } else return true;
    }
    costToString(cost) {
        let result = [];
        if (cost.wood) result.push(`Wood: ${cost.wood}`);
        if (cost.food) result.push(`Food: ${cost.food}`);
        if (cost.gold) result.push(`Gold: ${cost.gold}`);
        if (cost.stone) result.push(`Stone: ${cost.stone}`);
        return result.join(" ");
    }
    static isPossible() {
        return true;
    }
    static isVisible() {
        return true;
    }
    static getImage() {
        return this.prototype.IMAGE;
    }
    execute() { }
    reexecute() {
        this.execute();
    }
    init() {
        return true;
    }
    finalize() {
        return true;
    }
}
Action.prototype.SIZE = 54;
Action.prototype.MARGIN = 2;
Action.prototype.ACTIONS_PER_ROW = 5;
Action.prototype.SUPPORTS_QUEUE = false;
Action.prototype.ACTION_KEY = null;


export { Action }
