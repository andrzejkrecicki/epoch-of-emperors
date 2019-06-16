import { leftpad, getCanvasContext } from './utils.js';
import { rgb, palette, color_idx } from './palette.js';


const DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

let _resolve = null;


const Sprites = {
    cache: {},
    hitmaskCache: new Map(),
    colorizedCache: Array(8).fill(null).map(() => new Map),
    ready: new Promise((resolve) => {
        _resolve = resolve;
    }),
    Colorize(img, player) {
        if (!player) return img;
        if (this.colorizedCache[player.color].has(img)) return this.colorizedCache[player.color].get(img);

        let ctx = getCanvasContext(img.width, img.height);
        ctx.drawImage(img, 0, 0);

        let data = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (let i = 0; i < data.data.length; i += 4) {
            let color = rgb(data.data[i], data.data[i + 1], data.data[i + 2]);
            if (color in color_idx) {
                color = palette[player.color][color_idx[color]];
                data.data[i] = color[0];
                data.data[i + 1] = color[1];
                data.data[i + 2] = color[2];
            }
        }
        ctx.putImageData(data, 0, 0);
        this.colorizedCache[player.color].set(img, ctx.canvas);
        return ctx.canvas;
    },
    DirectionSprites(path, count, start=0) {
        let sprites = new Array(8).fill(null).map(() => []);
        for (let dir = 0; dir < 8; ++dir) {
            for (let i = start; i < start + count; ++i) {
                this.ready.then(() => {
                    sprites[dir].push(this.cache[`${path}${DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`]);
                })
            }
        }
        return sprites;
    },
    SpriteSequence(path, count, start=0, mul=0) {
        let sprites = [];
        for (let i = start; i < start + count; ++i) {
            this.ready.then(() => {
                sprites.push(this.cache[`${path}${leftpad(i, 2, "0")}.png`]);
            })
        }
        if (mul == 0) return sprites;
        else return Array(mul).fill(sprites);
    },
    Sprite(path) {
        let canvas = document.createElement("canvas");
        this.ready.then(() => {
            let img = this.cache[path];
            canvas.width = img.width;
            canvas.height = img.height;
            let ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            return canvas;
        });
        return canvas;
    },
    Hitmask(image) {
        if (this.hitmaskCache.has(image)) return this.hitmaskCache.get(image);

        let ctx = getCanvasContext(image.width, image.height);
        ctx.drawImage(image, 0, 0);
        ctx.globalCompositeOperation = "source-in";

        this.hitmaskCache.set(image, ctx);
        return ctx;
    },
    preload() {
        return this.ready = new Promise(async (resolve) => {
            let [bin, json] = await Promise.all([fetch("dist/gfx.bin"), fetch("dist/gfx.json")]);
            [bin, json] = await Promise.all([bin.blob(), json.json()])

            let promises = [];
            let offset = 0;

            for (let [path, size] of json) {
                let p = createImageBitmap(
                    bin.slice(offset, offset + size)
                ).then(
                    (function(path, img) {
                        this.cache[path] = img;
                    }).bind(this, path)
                );
                offset += size;
                promises.push(p);
            }
            await Promise.all(promises);

            _resolve();
            resolve();
        });
    }
}

Sprites.preload();

export { Sprites }
