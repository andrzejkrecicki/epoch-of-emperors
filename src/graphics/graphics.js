class Node {
    constructor(options) {
        this.attrs = {};
        this.children = [];
        this.events = {};
        this.index = 0;
        this.parent = null;
        this.layer = null;
        this.UUID = Node.TOTAL_NODES++;
        this.hitColor = `#${this.UUID.toString(16).padStart(6, "0")}`;
        Node.UUID_TO_NODE[this.UUID] = this;

        this.attrs.height = options.height != null ? options.height : this.DEFAULT_ATTRS.height;
        this.attrs.width = options.width != null ? options.width : this.DEFAULT_ATTRS.width;
        this.attrs.x = options.x != null ? options.x : this.DEFAULT_ATTRS.x;
        this.attrs.y = options.y != null ? options.y : this.DEFAULT_ATTRS.y;
        this.attrs.visible = options.visible != null ? options.visible : this.DEFAULT_ATTRS.visible;
        this.attrs.opacity = this.attrs.opacity || this.DEFAULT_ATTRS.opacity;
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
        if (val == null) return { x: this.attrs.x, y: this.attrs.y }
        this.attrs.x = val.x;
        this.attrs.y = val.y;
        return val;
    }
    on(event, callback) {
        if (!(event in this.events)) this.events[event] = [];
        this.events[event].push(callback);
    }
    fire(event, e) {
        e = e || {};
        if (event in this.events) for (let callback of this.events[event]) {
            callback.call(this, e);
        }
        if (!e.cancelBubble && this.parent) this.parent.fire(event, e);
    }
    absX() {
        return (this.attrs.x || 0) + (this.parent ? this.parent.absX() : 0);
    }
    absY() {
        return (this.attrs.y || 0) + (this.parent ? this.parent.absY() : 0);
    }
    setListening() {
        // TODO - remove or implement
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
        let oldAlpha = this.layer.ctx.globalAlpha;
        this.layer.ctx.globalAlpha *= this.attrs.opacity;
        for (let child of this.children) child.draw();
        this.layer.ctx.globalAlpha = oldAlpha;
    }
    static getByUUID(id) {
        return Node.UUID_TO_NODE[id];
    }
}
Node.TOTAL_NODES = 0;
Node.UUID_TO_NODE = {};
Node.prototype.DEFAULT_ATTRS = {
    height: 0,
    width: 0,
    x: 0,
    y: 0,
    visible: true,
    opacity: 1,
    fill: "#ffffff",
    strokeWidth: 1,
    stroke: "#000000",
    fill: null,
    // stroke: "#000000",
    // strokeWidth: 1,
    align: "left",
    textBaseline: "middle",
    fontFamily: "helvetica",
    fontSize: 14
};
Node.prototype.GETSETERS = [
    "x",
    "y",
    "width",
    "height",
    "fill",
    "stroke",
    "strokeWidth",
    "fontSize",
    "fontFamily",
    "align",
    "text",
    "opacity",
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
        this.container.style.width = this.attrs.width + "px";
        this.container.style.height = this.attrs.height + "px";
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
    on(event, callback) {
        this.container.addEventListener(event, (e) => callback({ target: this, evt: e }));
    }
    draw() {
        if (!this.attrs.visible) return;
        for (let child of this.children) child.draw();
    }
    initEvents() {
        this.mouse = {
            x: 0, y: 0
        }
        this.lastHovered = null;
        this.container.addEventListener("mousedown", this.mousedown.bind(this));
        this.container.addEventListener("mouseup", this.mouseup.bind(this));
        this.container.addEventListener("mousemove", this.mousemove.bind(this));
    }
    mousedown(e) {
        this.dispatch("mousedown", e);
    }
    mouseup(e) {
        this.dispatch("mouseup", e);
        this.dispatch("click", e);
    }
    dispatch(type, e) {
        let x = e.offsetX;
        let y = e.offsetY;
        for (let i = this.children.length - 1; i > -1; --i) {
            let node = this.children[i].getNodeAt(x, y);
            if (node) {
                node.fire(type, { target: node, evt: e });
                break;
            }
        }
    }
    mousemove(e) {
        let x = e.offsetX;
        let y = e.offsetY;
        for (let i = this.children.length - 1; i > -1; --i) {
            let node = this.children[i].getNodeAt(x, y);
            this.mouse.x = x;
            this.mouse.y = y;
            if (node != null && node != this.lastHovered) {
                if (this.lastHovered) this.lastHovered.fire("mouseout", e);
                this.lastHovered = node;
                node.fire("mouseover", { target: node, evt: e });
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
        this.hitmap.clearRect(0, 0, this.stage.width(), this.stage.height());
        this.ctx.clearRect(0, 0, this.stage.width(), this.stage.height());
        super.draw(...arguments);
    }
    clear() {
        this.ctx.clearRect(0, 0, this.stage.width(), this.stage.height());
    }
    makeHitmap() {
        let canvas = document.createElement("canvas");
        canvas.setAttribute("width", this.stage.width());
        canvas.setAttribute("height", this.stage.height());
        this.hitmap = canvas.getContext('2d');

        this.hitmap.clearRect(0, 0, this.stage.width(), this.stage.height());
    }
    getNodeAt(x, y) {
        let hit_pixel = this.hitmap.getImageData(x, y, 1, 1).data;
        if (hit_pixel[3] != 0) {
            let UUID = (hit_pixel[0] << 16) | (hit_pixel[1] << 8) | (hit_pixel[2]);
            return Node.getByUUID(UUID);
        }
    }
    absX() {
        return 0;
    }
    absY() {
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
        if (this.attrs.fill) this.layer.ctx.fillRect(this.absX(), this.absY(), this.attrs.width, this.attrs.height);
        if (this.attrs.stroke) this.layer.ctx.strokeRect(Math.floor(this.absX()), Math.floor(this.absY()), this.attrs.width, this.attrs.height);

        this.setHitmap();
    }
    setHitmap() {
        this.layer.hitmap.fillStyle = this.hitColor;
        this.layer.hitmap.fillRect(this.absX(), this.absY(), this.width(), this.height());
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
        this.layer.ctx.fillText(this.attrs.text, this.absX(), this.absY());
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
        this.image(options.image || null);
    }
    image(image) {
        if (image != null) {
            this.attrs.image = image;
            this.attrs.width = this.attrs.image.width;
            this.attrs.height = this.attrs.image.height;
        }
        return this.attrs.image;
    }
    draw() {
        if (!this.attrs.visible) return;
        this.layer.ctx.drawImage(this.attrs.image, this.absX(), this.absY());
        this.setHitmap();
    }
    setHitmap() {
        this.layer.hitmap.fillStyle = this.hitColor;
        this.layer.hitmap.fillRect(this.absX(), this.absY(), this.width(), this.height());
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