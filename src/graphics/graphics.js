import { rect_intersection } from '../utils.js';

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
        this.parent.removeChild(this);
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
    removeChild(child) {
        this.children.splice(child.index, 1);
        this.resetIndices();
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
    fontSize: 14,
    fontWeight: "normal"
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
            } else if (node != null) break;
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
        this.hitmap.clearRect(0, 0, this.stage.width(), this.stage.height());
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


// class meant to draw objects which do not need hitmaps e.g. terrain
// getNodeAt is mocked by returning reference to itself
class HitlessLayer extends Layer {
    draw() {
        if (!this.attrs.visible) return;
        this.ctx.clearRect(0, 0, this.stage.width(), this.stage.height());
        for (let child of this.children) child.draw();
    }
    getNodeAt(x, y) {
        return this;
    }
    makeHitmap() {}
    clear() {}
}


class GridPreview extends Layer {
    constructor(stage) {
        super();
        this.stage = stage;
        this.buff = document.createElement("canvas");
        this.buff.setAttribute("width", this.stage.width() + 32);
        this.buff.setAttribute("height", this.stage.height() + 16);
        this.buff_ctx = this.buff.getContext("2d");
        this.attrs.visible = false;
    }
    init(md) {
        // this.attrs.visible = true;
        this.md = md;

        let begin_x = (-this.md.x()) - ((-this.md.x()) % 32);
        let begin_y = (-this.md.y()) - ((-this.md.y()) % 16);

        for (let x = begin_x; x < begin_x + 32 + this.stage.width(); ++x) {
            for (let y = begin_y; y < begin_y + 16 + this.stage.height(); ++y) {
                let point = this.md.screenCoordsToSubtile(x, y);
                let cx = point.x;
                let cy = point.y;

                if (cx % 2 == cy % 2) {
                    this.buff_ctx.fillStyle = "rgba(0, 0, 0, .25)";
                    this.buff_ctx.fillRect(x - begin_x, y - begin_y, 1, 1);
                }

            }
        }

    }
    draw() {
        if (!this.attrs.visible) return;
        this.ctx.clearRect(0, 0, this.stage.width(), this.stage.height());

        this.ctx.drawImage(this.buff, -((-this.md.x()) % 32), -((-this.md.y()) % 16));

    }
    getNodeAt() {}
    makeHitmap() {}
    clear() {}
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
        this.attrs.fontWeight = options.fontWeight ? options.fontWeight : this.DEFAULT_ATTRS.fontWeight;
        this.attrs.text = options.text;
    }
    draw() {
        if (!this.attrs.visible) return;
        this.layer.ctx.fillStyle = this.attrs.fill;
        this.layer.ctx.textAlign = this.attrs.align;
        this.layer.ctx.textBaseline = this.attrs.textBaseline;
        this.layer.ctx.font = `${this.attrs.fontWeight} ${this.attrs.fontSize}px ${this.attrs.fontFamily}`;
        this.layer.ctx.fillText(this.attrs.text, this.absX(), this.absY());
    }
}

class StrokedText extends Text {
    constructor(options) {
        super(options);
        this.attrs.strokeStyle = options.strokeStyle ? options.strokeStyle : this.DEFAULT_ATTRS.strokeStyle;
        this.attrs.lineWidth = options.lineWidth ? options.lineWidth : this.DEFAULT_ATTRS.lineWidth;
    }
    draw() {
        if (!this.attrs.visible) return;
        this.layer.ctx.fillStyle = this.attrs.fill;
        this.layer.ctx.textAlign = this.attrs.align;
        this.layer.ctx.textBaseline = this.attrs.textBaseline;
        this.layer.ctx.strokeStyle = this.attrs.strokeStyle;
        this.layer.ctx.lineWidth = this.attrs.lineWidth;
        this.layer.ctx.font = `${this.attrs.fontWeight} ${this.attrs.fontSize}px ${this.attrs.fontFamily}`;
        this.layer.ctx.strokeText(this.attrs.text, this.absX(), this.absY());
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
        this.attrs.hasHitmap = options.hasHitmap || false;
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
        if (this.attrs.hasHitmap) this.setHitmap();
    }
    setHitmap() {
        this.layer.hitmap.fillStyle = this.hitColor;
        this.layer.hitmap.fillRect(this.absX(), this.absY(), this.width(), this.height());
    }
}

// Class designed for fast retrieval of Nodes needed to be drawn at current viewport.
// Instead of keeping children in array, it stores them in a two dimensional grid of arrays each of
// size by default equal to one fifth of viewport width
class EntitiesHolder extends Node {
    constructor(options, grid_def) {
        super(options);

        this.cellSize = Math.round(grid_def.viewPortWidth / 5);
        this.grid = new Array(Math.ceil(grid_def.width / this.cellSize)).fill(null).map(
            () => new Array(Math.ceil(grid_def.height / this.cellSize)).fill(null).map(() => [])
        );
        this.viewPortWidth = grid_def.viewPortWidth;
        this.viewPortHeight = grid_def.viewPortHeight;
        this.visibleColls = Math.ceil(this.viewPortWidth / this.cellSize);
        this.visibleRows = Math.ceil(this.viewPortHeight / this.cellSize);
        this.mapSize = grid_def.mapSize;
    }
    add(entity) {
        entity.parent = this;
        entity.setLayer(this.layer);
        let x = Math.floor(entity.attrs.x / this.cellSize);
        let y = Math.floor(entity.attrs.y / this.cellSize);
        entity.index = this.grid[x][y].length;
        this.grid[x][y].push(entity);
    }
    removeChild(child) {
        let x = Math.floor(child.attrs.x / this.cellSize);
        let y = Math.floor(child.attrs.y / this.cellSize);

        this.grid[x][y][child.index] = this.grid[x][y][this.grid[x][y].length - 1];
        this.grid[x][y][child.index].index = child.index;
        --this.grid[x][y].length;
    }
    draw() {
        let total = 0;
        let viewPort = {
            x: -this.x(),
            y: -this.y(),
            w: this.viewPortWidth,
            h: this.viewPortHeight
        }

        let lowest_z = Infinity;
        let highest_z = -1;

        // take all buckets which intersect with current viewport
        // calculate z-index of each object in them to designate min/max range
        let first_x = Math.max(Math.floor(viewPort.x / this.cellSize - 1), 0);
        let first_y = Math.max(Math.floor(viewPort.y / this.cellSize - 1), 0);

        let last_x = Math.min(Math.floor((viewPort.x + viewPort.w) / this.cellSize + 1), this.grid.length);
        let last_y = Math.min(Math.floor((viewPort.y + viewPort.h) / this.cellSize + 1), this.grid[0].length);

        for (let x = first_x; x < last_x; ++x) {
            for (let y = first_y; y < last_y; ++y) {
                for (let i = 0; i < this.grid[x][y].length; ++i) {
                    if (rect_intersection(this.grid[x][y][i].getBoundingBox(), viewPort)) {
                        let z = this.mapSize - (this.grid[x][y][i].subtile_x - this.grid[x][y][i].subtile_y);
                        lowest_z = Math.min(z, lowest_z);
                        highest_z = Math.max(z, highest_z);
                    }
                }
            }
        }

        if (highest_z == -1) return;

        // create layers for each z-index in calculated range
        let z_layers = new Array(highest_z - lowest_z + 1).fill(null).map(() => []);

        for (let x = first_x; x < last_x; ++x) {
            for (let y = first_y; y < last_y; ++y) {
                for (let i = 0; i < this.grid[x][y].length; ++i) {
                    if (rect_intersection(this.grid[x][y][i].getBoundingBox(), viewPort)) {
                        let z = this.mapSize - (this.grid[x][y][i].subtile_x - this.grid[x][y][i].subtile_y)
                        z_layers[z - lowest_z].push(this.grid[x][y][i]);
                    }
                }
            }
        }

        for (let i = 0; i < z_layers.length; ++i) for (let j = 0; j < z_layers[i].length; ++j) {
            z_layers[i][j].draw();
        }
    }
    updateBucket(entity, old_pos) {
        let old_bucket = {
            x: Math.floor(old_pos.x / this.cellSize),
            y: Math.floor(old_pos.y / this.cellSize)
        };
        let new_bucket = {
            x: Math.floor(entity.attrs.x / this.cellSize),
            y: Math.floor(entity.attrs.y / this.cellSize)
        };
        if (old_bucket.x != new_bucket.x || old_bucket.y != new_bucket.y) {
            // put bucket's last element at index of element being removed and update its index
            this.grid[old_bucket.x][old_bucket.y][entity.index] = this.grid[old_bucket.x][old_bucket.y][this.grid[old_bucket.x][old_bucket.y].length - 1];
            this.grid[old_bucket.x][old_bucket.y][entity.index].index = entity.index;
            --this.grid[old_bucket.x][old_bucket.y].length;

            // add to new bucket and set new index
            entity.index = this.grid[new_bucket.x][new_bucket.y].length;
            this.grid[new_bucket.x][new_bucket.y].push(entity);
        }
    }
}

function RedFilter(image) {
    let tmp = document.createElement("canvas");
    image.addEventListener("load", function() {
        tmp.setAttribute("width", image.width);
        tmp.setAttribute("height", image.height);
        let ctx = tmp.getContext("2d");
        ctx.drawImage(image, 0, 0);
        let imageData = ctx.getImageData(0, 0, image.width, image.height);
        for (let i = 0; i < imageData.data.length; i += 4) {
            imageData.data[i] = Math.min(imageData.data[i] + 150, 255);
            imageData.data[i + 1] = Math.max(0, imageData.data[i + 1] - 40);
            imageData.data[i + 2] = Math.max(0, imageData.data[i + 2] - 40);
        }
        ctx.putImageData(imageData, 0, 0);
    });
    return tmp;
}


function BasicHitmask(image, offset) {
    let wrap = {
        ctx: null,
        imageData: null,
        offset: offset
    };

    image.addEventListener("load", function() {
        let tmp = document.createElement("canvas");
        tmp.setAttribute("width", image.width);
        tmp.setAttribute("height", image.height);
        let ctx = tmp.getContext("2d");
        ctx.drawImage(image, 0, 0);
        let imageData = ctx.getImageData(0, 0, image.width, image.height);
        wrap.ctx = ctx;
        wrap.imageData = imageData;
    });
    return wrap;
}


function ComposeHitmask(img1, img2, offset1, offset2) {
    let loaded = 0;
    let wrap = {
        ctx: null,
        imageData: null,
        offset: null
    }

    let callback = function() {
        if (++loaded < 2) return;
        let tmp = document.createElement("canvas");
        tmp.setAttribute("width", Math.max(img1.width, img2.width));
        tmp.setAttribute("height", Math.max(img1.height, img2.height));

        let ctx = tmp.getContext("2d");
        ctx.drawImage(img1,
            Math.max(offset1.x, offset2.x) - offset1.x,
            Math.max(offset1.y, offset2.y) - offset1.y
        );
        ctx.drawImage(img2,
            Math.max(offset1.x, offset2.x) - offset2.x,
            Math.max(offset1.y, offset2.y) - offset2.y
        );
        wrap.ctx = ctx;
        wrap.imageData = ctx.getImageData(0, 0, tmp.width, tmp.height);
        wrap.offset = {
            x: Math.max(offset1.x, offset2.x),
            y: Math.max(offset1.y, offset2.y)
        }
    }

    img1.addEventListener("load", callback);
    img2.addEventListener("load", callback);

    return wrap;
}

window.Graphics = {
    Node: Node,
    Stage: Stage,
    Layer: Layer,
    HitlessLayer: HitlessLayer,
    GridPreview: GridPreview,
    Group: Group,
    Rect: Rect,
    Text: Text,
    StrokedText: StrokedText,
    Path: Path,
    Image: Image,
    EntitiesHolder: EntitiesHolder,
    Filters: {
        RedFilter,
        ComposeHitmask,
        BasicHitmask
    }
};

module.export = Graphics;