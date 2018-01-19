class Node {
    constructor(options) {
        this.attrs = {};
        this.attrs.children = [];
        this.events = {};
        this.parent = null;

        if (options.width != null) this.attrs.width = options.width;
        if (options.height != null) this.attrs.height = options.height;
        if (options.x != null) this.attrs.x = options.x;
        if (options.y != null) this.attrs.y = options.y;
    }
    add(node) {
        this.attrs.children.push(node);
        node.parent = this;
    }
    width(val) {
        if (val == null) return this.attrs.width;
        return this.attrs.width = val;
    }
    height(val) {
        if (val == null) return this.attrs.height;
        return this.attrs.height = val;
    }
    on(event, callback) {
        if (!(event in this.events)) this.events[event] = [];
        this.events[event].push(callback);
    }
    getWidth() {
        return this.attrs.width;
    }
    getHeight() {
        return this.attrs.height;
    }
    setX(val) {
        this.attrs.x = val;
    }
    setY(val) {
        this.attrs.y = val;
    }
    setListening() {
        // TODO - remove
    }
    draw() {
        console.log(`Drawing ${this.constructor.name}`);
        for (let child, i = 0; child = this.attrs.children[i]; ++i) {
            child.draw();
        }

    }
}

class Stage extends Node {
    constructor(options) {
        super(options);
        this.attrs.container = document.getElementById(options.container);
    }
    add(layer) {
        let canvas = document.createElement("canvas");
        canvas.setAttribute("width", this.attrs.width)
        canvas.setAttribute("height", this.attrs.height)
        layer.attrs.canvas = canvas;
        this.attrs.container.appendChild(canvas);
    }
}
class Layer extends Node {
    constructor(options) {
        super(options || {});
    }
}
class Group extends Node {
    constructor(options) {
        super(options || {});
    }
}
class Rect extends Node {
    constructor(options) {
        super(options || {});
    }
}
class Text extends Node {
    constructor(options) {
        super(options || {});
    }
    getFontSize() {
        return this.attrs.fontSize;
    }
    fontSize(val) {
        if (val == null) return this.attrs.fontSize;
        return this.attrs.fontSize = val;
    }
}
class Path extends Node {
    constructor(options) {
        super(options || {});
    }
}
class Image extends Node {
    constructor(options) {
        super(options || {});
    }
}

window.Graphics = {
    Node: Node,
    Stage: Stage,
    Layer: Layer,
    Group: Group,
    Rect: Rect,
    Text: Text,
    Path: Path,
    Image: Image,
};

module.export = Graphics;