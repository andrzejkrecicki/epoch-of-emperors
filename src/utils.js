class PlayerDefinition {
    constructor(index, name, civ, colour, team=null, is_cpu=true) {
        this.index = index;
        this.name = name;
        if (civ === null) {
            this.civ = Math.floor(Math.random() * CIVILIZATIONS.length);
        } else {
            this.civ = civ;
        }
        this.colour = colour;
        this.team = team;
        this.is_cpu = is_cpu;
    }
}

let PLAYER_COLOURS = [
    "blue",
    "red",
    "yellow",
    "brown",
    "orange",
    "green",
    "gray",
    "navy"
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


var make_image = function(src) {
    let img = new Image;
    img.src = src;
    return img;
}

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

var rect_intersection = function(r1, r2) {
    return !(
        r1.x + r1.w < r2.x || r1.x > r2.x + r2.w ||
        r1.y + r1.h < r2.y || r1.y > r2.y + r2.h
    );
}

export {
    PlayerDefinition, PLAYER_COLOURS, CIVILIZATIONS, CIVILIZATIONS_NAMES,
    make_image, to_binary, leftpad, rand_choice, rect_intersection, distance
}