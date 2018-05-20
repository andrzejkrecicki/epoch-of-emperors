import { make_image, leftpad } from '../utils.js';

const DIRECTIONS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

const Sprites = {
    DirectionSprites(path, count, start=0) {
        let sprites = new Array(8).fill(null).map(() => []);
        for (let dir = 0; dir < 8; ++dir) {
            for (let i = start; i < start + count; ++i) {
                sprites[dir].push(make_image(path + `${DIRECTIONS[dir]}_${leftpad(i, 2, "0")}.png`));
            }
        }
        return sprites;
    }
}


export { Sprites }