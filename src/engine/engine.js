import { RandomMap } from './map.js';

class Engine {
    constructor(definition) {
        this.definition = Object.assign({}, definition);
        if (this.definition.map.random) {
            this.map = new RandomMap(this.definition.map);
        } else {
            // load existing map
        }
    }
}


export {
    Engine
}