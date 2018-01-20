class Node {
    constructor(options) {
        this.attrs = {};
        this.children = [];
        this.events = {};
        this.index = 0;
        this.parent = null;
        this.layer = null;

        this.attrs.height = options.height != null ? options.height : this.DEFAULT_ATTRS.height;
        this.attrs.width = options.width != null ? options.width : this.DEFAULT_ATTRS.width;
        this.attrs.x = options.x != null ? options.x : this.DEFAULT_ATTRS.x;
        this.attrs.y = options.y != null ? options.y : this.DEFAULT_ATTRS.y;
        this.attrs.visible = options.visible != null ? options.visible : this.DEFAULT_ATTRS.visible;
    }
    add(node) {
        node.index = this.children.length;
        this.children.push(node);
        node.parent = this;
        node.setLayer(this.layer);
    }
    remove() {
        this.parent.children.splice(this.index, 1);
        this.parent.resetIndices();
        this.parent = null;
    }
    moveToTop() {
        this.parent.children.splice(this.index, 1);
        this.parent.children.push(this);
        this.parent.resetIndices();
    }
    resetIndices() {
        for (let i = 0; i < this.children.length; ++i) this.children[i].index = i;
    }
    removeChildren() {
        for (let child of this.children) {
            child.parent = null;
            child.index = 0;
        }
        this.children = [];
    }
    position(val) {
        if (val != null) return { x: this.x, y: this.y }
        this.x = val.x;
        this.y = val.y;
        return val;
    }
    on(event, callback) {
        if (!(event in this.events)) this.events[event] = [];
        this.events[event].push(callback);
    }
    fire(event) {
        let e = {};
        if (event in this.events) for (let callback of this.events[event]) {
            callback.call(this, e);
        }
        if (!e.cancelBubble && this.parent) this.parent.fire(event);
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
    getLayer() {
        return this.layer || (this.parent && this.parent.getLayer());
    }
    setLayer(layer) {
        this.layer = layer;
        for (let child of this.children) {
            child.setLayer(layer);
        }
    }
    show() {
        this.attrs.visible = true;
    }
    hide() {
        this.attrs.visible = false;
    }
    draw() {
        if (!this.attrs.visible) return;
        for (let child of this.children) child.draw();
    }
}
Node.prototype.DEFAULT_ATTRS = {
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    visible: true,
    fill: "#ffffff",
    strokeWidth: 1,
    stroke: "#000000",
    fill: "#ffffff",
    // stroke: "#000000",
    // strokeWidth: 1,
    align: "left",
    textBaseline: "middle",
    fontFamily: "helvetica",
    fontSize: 14
};
Node.prototype.GETSETERS = [
    "width",
    "height",
    "fill",
    "stroke",
    "strokeWidth",
    "fontSize",
    "fontFamily",
    "align",
    "text",
    "visible",
];
for (let attr of Node.prototype.GETSETERS) {
    Node.prototype[attr] = (function(attr) {
        return function(val) {
            if (val != null) return this.attrs[attr] = val;
            return this.attrs[attr];
        }
    })(attr);

    let cap = attr.charAt(0).toUpperCase() + attr.slice(1);
    Node.prototype["set" + cap] = (function(attr) {
        return function(val) {
            return this.attrs[attr] = val;
        }
    })(attr);
    Node.prototype["get" + cap] = (function(attr) {
        return function(val) {
            return this.attrs[attr];
        }
    })(attr);
}


class Stage extends Node {
    constructor(options) {
        super(options);
        this.container = document.getElementById(options.container);
        this.initEvents();
    }
    add(layer) {
        let canvas = document.createElement("canvas");
        canvas.setAttribute("width", this.attrs.width)
        canvas.setAttribute("height", this.attrs.height)
        layer.canvas = canvas;
        layer.ctx = canvas.getContext('2d');
        this.container.appendChild(canvas);
        layer.stage = this;
        layer.makeHitmap();
        this.children.push(layer);
    }
    initEvents() {
        this.mouse = {
            x: 0, y: 0
        }
        // this.lastHovered = this;
        this.container.addEventListener("click", this.click.bind(this));
        this.container.addEventListener("mousemove", this.mousemove.bind(this));
    }
    click(e) {
        let x = e.offsetX;
        let y = e.offsetY;
        for (let i = this.children.length - 1; i > -1; --i) {
            if (this.children[i].hitmap[x][y] != null) {
                this.children[i].hitmap[x][y].fire(e.type, e);
                break;
            }
        }
    }
    mousemove(e) {
        let x = e.offsetX;
        let y = e.offsetY;
        for (let i = this.children.length - 1; i > -1; --i) {
            let node = this.children[i].hitmap[x][y];
            let lastHovered = this.children[i].hitmap[this.mouse.x][this.mouse.y];
            this.mouse.x = x;
            this.mouse.y = y;
            if (node != null && node != lastHovered) {
                lastHovered.fire("mouseout", e);
                lastHovered = node;
                node.fire("mouseover", e);
                break;
            }
        }
    }
}
class Layer extends Node {
    constructor(options) {
        super(options || {});
        this.stage = null;
        this.canvas = null;
        this.ctx = null;
        this.hitmap = null;
        this.layer = this;
    }
    add(node) {
        if (node.layer == null) {
            node.setLayer(this);
        }
        node.index = this.children.length;
        this.children.push(node);
        node.parent = this;
    }
    draw() {
        this.makeHitmap();
        super.draw(...arguments);
    }
    makeHitmap() {
        this.hitmap = (new Array(this.stage.width())).fill(null).map(
            () => (new Array(this.stage.height())).fill(null)
        );
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

        this.attrs.fill = options.fill != null ? options.fill : this.DEFAULT_ATTRS.fill;
        this.attrs.strokeWidth = options.strokeWidth != null ? options.strokeWidth : this.DEFAULT_ATTRS.strokeWidth;
        this.attrs.stroke = options.stroke != null ? options.stroke : this.DEFAULT_ATTRS.stroke;
    }
    draw() {
        if (!this.attrs.visible) return;
        if (this.layer == null) return;

        this.layer.ctx.fillStyle = this.attrs.fill;
        this.layer.ctx.lineWidth = this.attrs.strokeWidth;
        this.layer.ctx.strokeStyle = this.attrs.stroke;
        this.layer.ctx.fillRect(this.x(), this.y(), this.attrs.width, this.attrs.height);
        this.layer.ctx.strokeRect(this.x(), this.y(), this.attrs.width, this.attrs.height);

        this.setHitmap();
    }
    setHitmap() {
        // TODO - allow events disabling
        for (let y = this.y(); y < this.y() + this.height(); ++y) {
            for (let x = this.x(); x < this.x() + this.width(); ++x) {
                this.layer.hitmap[x][y] = this;
            }
        }
    }
}


class Text extends Node {
    constructor(options) {
        super(options || {});

        this.attrs.fill = options.fill ? options.fill : this.DEFAULT_ATTRS.fill;
        // this.attrs.stroke = options.stroke ? options.stroke : this.DEFAULT_ATTRS.stroke;
        // this.attrs.strokeWidth = options.strokeWidth ? options.strokeWidth : this.DEFAULT_ATTRS.strokeWidth;
        this.attrs.align = options.align ? options.align : this.DEFAULT_ATTRS.align;
        this.attrs.textBaseline = options.textBaseline ? options.textBaseline : this.DEFAULT_ATTRS.textBaseline;
        this.attrs.fontFamily = options.fontFamily ? options.fontFamily : this.DEFAULT_ATTRS.fontFamily;
        this.attrs.fontSize = options.fontSize ? options.fontSize : this.DEFAULT_ATTRS.fontSize;
        this.attrs.text = options.text;
    }
    draw() {
        if (!this.attrs.visible) return;
        this.layer.ctx.fillStyle = this.attrs.fill;
        this.layer.ctx.textAlign = this.attrs.align;
        this.layer.ctx.textBaseline = this.attrs.textBaseline;
        this.layer.ctx.font = "" + this.attrs.fontSize + "px " + this.attrs.fontFamily;
        this.layer.ctx.fillText(this.attrs.text, this.x(), this.y());
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