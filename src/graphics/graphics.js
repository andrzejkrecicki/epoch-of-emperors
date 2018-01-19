class Node {
    constructor(options) {
        this.attrs = {};
        this.attrs.children = [];
        this.events = {};
        this.index = 0;
        this.parent = null;
        this.layer = null;

        if (options.width != null) this.attrs.width = options.width;
        if (options.height != null) this.attrs.height = options.height;
        this.attrs.x = options.x || 0;
        this.attrs.y = options.y || 0;
    }
    attr(attr) {
        if (this.attrs[attr] != null) return this.attrs[attr];
        console.log(`seeking ${attr} at parent (${this.parent})`);
        if (this.parent == null) return;
        return this.parent.attr(attr);
    }
    add(node) {
        node.index = this.attrs.children.length;
        this.attrs.children.push(node);
        node.parent = this;
        node.layer = this.layer;
    }
    remove() {
        this.parent.attrs.children.splice(this.index, 1);
        this.parent.resetIndices();
    }
    resetIndices() {
        for (let i = 0; i < this.attrs.children.length; ++i) this.attrs.children[i].index = i;
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
    fire(event) {
        let e = {};
        if (event in this.events) for (let callback, i = 0; callback = this.events[event][i]; ++i) {
            callback.call(this, e);
        }
        if (!e.cancelBubble && this.parent) this.parent.fire(event);
    }
    setFill(val) {
        this.attrs.fill = val;
    }
    getWidth() {
        return this.attrs.width;
    }
    getHeight() {
        return this.attrs.height;
    }
    x(val) {
        if (val != null) return this.attrs.x = val;
        return (this.attrs.x || 0) + (this.parent ? this.parent.x() : 0);
    }
    y(val) {
        if (val != null) return this.attrs.y = val;
        return (this.attrs.y || 0) + (this.parent ? this.parent.y() : 0);
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
    setLayer(layer) {
        this.layer = layer;
        for (let child, i = 0; child = this.attrs.children[i]; ++i) {
            child.setLayer(layer);
        }
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
        layer.canvas = canvas;
        layer.ctx = canvas.getContext('2d');
        this.attrs.container.appendChild(canvas);
    }
}
class Layer extends Node {
    constructor(options) {
        super(options || {});
        this.canvas = null;
        this.ctx = null;
        this.layer = this;
    }
    add(node) {
        if (node.layer == null) {
            node.setLayer(this);
        }
        this.attrs.children.push(node);
        node.parent = this;
    }
    x() {
        return 0;
    }
    y() {
        return 0;
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
        this.attrs.fill = options.fill;
        this.attrs.strokeWidth = options.strokeWidth;
        this.attrs.stroke = options.stroke;
    }
    draw() {
        this.layer.ctx.fillStyle = this.attrs.fill;
        this.layer.ctx.lineWidth = this.attrs.strokeWidth;
        this.layer.ctx.strokeStyle = this.attrs.stroke;
        this.layer.ctx.fillRect(this.x(), this.y(), this.attrs.width, this.attrs.height);
        this.layer.ctx.strokeRect(this.x(), this.y(), this.attrs.width, this.attrs.height);
    }
}
class Text extends Node {
    constructor(options) {
        super(options || {});
        this.attrs.align = options.align;
        this.attrs.fill = options.fill;
        this.attrs.fontFamily = options.fontFamily;
        this.attrs.fontSize = options.fontSize;
        this.attrs.strokeWidth = options.strokeWidth;
        this.attrs.text = options.text;
    }
    draw() {
        this.layer.ctx.fillStyle = this.attrs.fill;
        this.layer.ctx.textAlign = this.attrs.align;
        this.layer.ctx.textBaseline = "middle";
        this.layer.ctx.font = "" + this.attrs.fontSize + "px " + this.attrs.fontFamily;
        this.layer.ctx.fillText(this.attrs.text, this.x(), this.y());
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