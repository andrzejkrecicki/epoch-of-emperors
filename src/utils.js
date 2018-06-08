class PlayerDefinition {
    constructor(index, name, civ, colour, team=null, is_cpu=true) {
        this.index = index;
        this.name = name;
        if (civ === null) {
            this.civ = Math.floor(Math.random() * CIVILIZATIONS.length);
        } else {
            this.civ = civ;
        }
        this.resources = {
            wood: 400,
            food: 400,
            stone: 400,
            gold: 400
        };
        this.colour = colour;
        this.team = team;
        this.is_cpu = is_cpu;
    }
}

let RESOURCE_TYPES = {
    NONE: 0,
    FOOD: 1,
    WOOD: 2,
    STONE: 3,
    GOLD: 4
};

let RESOURCE_NAME = [null, "food", "wood", "stone", "gold"]

let PLAYER_COLOURS = [
    'rgb(39, 63, 143)',
    'rgb(227, 11, 0)',
    'rgb(255, 255, 0)',
    'rgb(115, 71, 39)',
    'rgb(243, 119, 15)',
    'rgb(55, 95, 39)',
    'rgb(179, 179, 179)',
    'rgb(43, 191, 147)'
];


let CIVILIZATIONS = {
    EGYPTIAN: {
        index: 0,
        name: "Egyptian"
    },
    BABYLONIAN: {
        index: 1,
        name: "Babylonian"
    },
    GREEK: {
        index: 2,
        name: "Greek"
    },
    ASIATIC: {
        index: 3,
        name: "Asiatic"
    },
    0: "Egyptian",
    1: "Babylonian",
    2: "Greek",
    3: "Asiatic",
    length: 4
}
let CIVILIZATIONS_NAMES = [
    "Egyptian",
    "Babylonian",
    "Greek",
    "Asiatic"
]

var to_binary = function(num) {
    let bin = (+num).toString(2);
    return "00000000".substr(bin.length) + bin;
}

var leftpad = function(val, width, pad) {
    let str = val.toString();
    return Array(width + 1).join(pad).substr(str.length) + val;
}

var rand_choice = function(choices) {
    return choices[Math.floor(Math.random() * choices.length)];
}

var distance = function(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

var manhatan_subtile_distance = function(p1, p2) {
    return Math.abs(p1.subtile_x - p2.subtile_x) + Math.abs(p1.subtile_y - p2.subtile_y);
}

var rect_intersection = function(r1, r2) {
    return !(
        r1.x + r1.w < r2.x || r1.x > r2.x + r2.w ||
        r1.y + r1.h < r2.y || r1.y > r2.y + r2.h
    );
}

export {
    PlayerDefinition, PLAYER_COLOURS, CIVILIZATIONS, CIVILIZATIONS_NAMES,
    to_binary, leftpad, rand_choice, rect_intersection, distance,
    manhatan_subtile_distance, RESOURCE_TYPES, RESOURCE_NAME
}