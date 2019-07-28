import { leftpad, getCanvasContext } from './utils.js';
import { rgb, palette, color_idx } from './palette.js';


const DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];



const Sprites = {
    cache: {},
    hitmaskCache: new Map(),
    colorizedCache: Array(8).fill(null).map(() => new Map),
    ready: null,
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
        this.ready.then(() => {
            for (let dir = 0; dir < 8; ++dir) {
                for (let i = start; i < start + count; ++i) {
                    sprites[dir].push(this.cache[`${path}${DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`]);
                }
            }
        })
        return sprites;
    },
    SpriteSequence(path, count, start=0, mul=0) {
        let sprites = [];
        this.ready.then(() => {
            for (let i = start; i < start + count; ++i) {
                sprites.push(this.cache[`${path}${leftpad(i, 2, "0")}.png`]);
            }
        })
        if (mul == 0) return sprites;
        else return Array(mul).fill(sprites);
    },
    CarrySprites(state, path, frames, idle_offset=12) {
        return {
            [state.IDLE]: [Sprites.DirectionSprites(path, 1, idle_offset)],
            [state.MOVING]: [Sprites.DirectionSprites(path, frames)],
        };
    },
    InteractionSprites(state, path, ...frames) {
        return {
            [state.BASE]: [Sprites.DirectionSprites(`${path}/`, frames[0])],
            [state.IDLE]: [Sprites.DirectionSprites(`${path}_idle/`, frames[1])],
            [state.MOVING]: [Sprites.DirectionSprites(`${path}_moving/`, frames[2])],
            [state.DYING]: [Sprites.DirectionSprites(`${path}_dying/`, frames[3])],
            [state.DEAD]: [Sprites.DirectionSprites(`${path}_dead/`, frames[4])],
        };
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

            let offset = 0;
            let finished = 0;

            let i = 0;
            for (let [path, size] of json) setTimeout(() => {
                let p = createImageBitmap(
                    bin.slice(offset, offset + size)
                ).then(
                    (function(path, img) {
                        this.cache[path] = img;
                        if (++finished == json.length) {
                            window.debugInfo.innerHTML = '';
                            resolve();
                        }
                        if (finished % 100 == 0) window.debugInfo.innerHTML = Math.floor(100 * finished / json.length);
                    }).bind(this, path)
                );
                offset += size;
            }, ++i / 2);
        });
    }
}

Sprites.preload();

export { Sprites }
