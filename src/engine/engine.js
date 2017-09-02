import { MapFactory } from './map.js';

class Engine {
    constructor(definition) {
        this.definition = Object.assign({}, definition);
        
        this.map = MapFactory(this.definition.map);
    }
}


export {
    Engine
}