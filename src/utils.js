class PlayerDefinition {
    constructor(index, name, civ, color, team=null, is_cpu=true) {
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

        // TODO - remove the bellow line in production build
        this.resources = {
            wood: 40000,
            food: 40000,
            stone: 40000,
            gold: 40000
        };



        this.color = color;
        this.team = team;
        this.is_cpu = is_cpu;
    }
}

const RESOURCE_TYPES = {
    NONE: 0,
    FOOD: 1,
    WOOD: 2,
    STONE: 3,
    GOLD: 4
};

const RESOURCE_NAME = [null, "food", "wood", "stone", "gold"]

const PLAYER_COLORS = [
    'rgb(39, 63, 143)',
    'rgb(227, 11, 0)',
    'rgb(255, 255, 0)',
    'rgb(115, 71, 39)',
    'rgb(243, 119, 15)',
    'rgb(55, 95, 39)',
    'rgb(179, 179, 179)',
    'rgb(43, 191, 147)'
];


const CIVILIZATIONS = {
    GREEK: 0,
    EGYPTIAN: 1,
    BABYLONIAN: 2,
    ASIATIC: 3,
    0: "Greek",
    1: "Egyptian",
    2: "Babylonian",
    3: "Asiatic",
    length: 4
}
const CIVILIZATIONS_NAMES = [
    "Greek",
    "Egyptian",
    "Babylonian",
    "Asiatic"
];

const AGES = {
    STONE_AGE: 0,
    TOOL_AGE: 1,
    BRONZE_AGE: 2,
    IRON_AGE: 3,
}

function to_binary(num) {
    let bin = (+num).toString(2);
    return "00000000".substr(bin.length) + bin;
}

function leftpad(val, width, pad) {
    let str = val.toString();
    return Array(width + 1).join(pad).substr(str.length) + val;
}

function rand_choice(choices) {
    return choices[Math.floor(Math.random() * choices.length)];
}

function distance(p1, p2) {
    return Math.sqrt(((p1.x - p2.x) ** 2) + ((p1.y - p2.y) ** 2));
}

function manhatan_subtile_distance(p1, p2) {
    return Math.abs(p1.subtile_x - p2.subtile_x) + Math.abs(p1.subtile_y - p2.subtile_y);
}

function rect_intersection(r1, r2) {
    return !(
        r1.x + r1.w < r2.x || r1.x > r2.x + r2.w ||
        r1.y + r1.h < r2.y || r1.y > r2.y + r2.h
    );
}

export {
    PlayerDefinition, PLAYER_COLORS, CIVILIZATIONS, CIVILIZATIONS_NAMES,
    to_binary, leftpad, rand_choice, rect_intersection, distance,
    manhatan_subtile_distance, RESOURCE_TYPES, RESOURCE_NAME, AGES
}
