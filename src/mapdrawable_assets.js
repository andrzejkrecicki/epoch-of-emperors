import { Map } from './engine/map.js';
import { Sprites } from './sprites.js';

const TERRAIN_IMAGES = {
    [Map.TERRAIN_TYPES.WATER]: [
        Sprites.SpriteSequence("img/tiles/water_0/", 44),
        Sprites.SpriteSequence("img/tiles/water_1/", 44),
        Sprites.SpriteSequence("img/tiles/water_2/", 44),
        Sprites.SpriteSequence("img/tiles/water_3/", 44)
    ],

    [Map.TERRAIN_TYPES.GRASS]: Sprites.SpriteSequence("img/tiles/grass/", 9),
    [Map.TERRAIN_TYPES.SAND]: Sprites.SpriteSequence("img/tiles/sand/", 9),

    [Map.TERRAIN_TYPES.SANDWATER_4]: [Sprites.Sprite("img/tiles/sandwater_4.png")],
    [Map.TERRAIN_TYPES.SANDWATER_6]: [Sprites.Sprite("img/tiles/sandwater_6.png")],
    [Map.TERRAIN_TYPES.SANDWATER_8]: [Sprites.Sprite("img/tiles/sandwater_8.png")],
    [Map.TERRAIN_TYPES.SANDWATER_3]: [Sprites.Sprite("img/tiles/sandwater_3.png")],
    [Map.TERRAIN_TYPES.SANDWATER_2]: [Sprites.Sprite("img/tiles/sandwater_2.png")],
    [Map.TERRAIN_TYPES.SANDWATER_9]: [Sprites.Sprite("img/tiles/sandwater_9.png")],
    [Map.TERRAIN_TYPES.SANDWATER_1]: [Sprites.Sprite("img/tiles/sandwater_1.png")],
    [Map.TERRAIN_TYPES.SANDWATER_7]: [Sprites.Sprite("img/tiles/sandwater_7.png")],
    [Map.TERRAIN_TYPES.WATERSAND_7]: [Sprites.Sprite("img/tiles/watersand_7.png")],
    [Map.TERRAIN_TYPES.WATERSAND_1]: [Sprites.Sprite("img/tiles/watersand_1.png")],
    [Map.TERRAIN_TYPES.WATERSAND_3]: [Sprites.Sprite("img/tiles/watersand_3.png")],
    [Map.TERRAIN_TYPES.WATERSAND_9]: [Sprites.Sprite("img/tiles/watersand_9.png")],


    [Map.TERRAIN_TYPES.GRASSSAND_1]: [Sprites.Sprite("img/tiles/grasssand_1.png")],
    [Map.TERRAIN_TYPES.GRASSSAND_2]: [Sprites.Sprite("img/tiles/grasssand_2.png")],
    [Map.TERRAIN_TYPES.GRASSSAND_3]: [Sprites.Sprite("img/tiles/grasssand_3.png")],
    [Map.TERRAIN_TYPES.GRASSSAND_4]: [Sprites.Sprite("img/tiles/grasssand_4.png")],
    [Map.TERRAIN_TYPES.GRASSSAND_6]: [Sprites.Sprite("img/tiles/grasssand_6.png")],
    [Map.TERRAIN_TYPES.GRASSSAND_7]: [Sprites.Sprite("img/tiles/grasssand_7.png")],
    [Map.TERRAIN_TYPES.GRASSSAND_8]: [Sprites.Sprite("img/tiles/grasssand_8.png")],
    [Map.TERRAIN_TYPES.GRASSSAND_9]: [Sprites.Sprite("img/tiles/grasssand_9.png")],


    [Map.TERRAIN_TYPES.SANDGRASS_0]: [Sprites.Sprite("img/tiles/sandgrass_0.png")],
    [Map.TERRAIN_TYPES.SANDGRASS_2]: [Sprites.Sprite("img/tiles/sandgrass_2.png")],
    [Map.TERRAIN_TYPES.SANDGRASS_2_8]: [Sprites.Sprite("img/tiles/sandgrass_2_8.png")],
    [Map.TERRAIN_TYPES.SANDGRASS_4]: [Sprites.Sprite("img/tiles/sandgrass_4.png")],
    [Map.TERRAIN_TYPES.SANDGRASS_4_6]: [Sprites.Sprite("img/tiles/sandgrass_4_6.png")],
    [Map.TERRAIN_TYPES.SANDGRASS_6]: [Sprites.Sprite("img/tiles/sandgrass_6.png")],
    [Map.TERRAIN_TYPES.SANDGRASS_8]: [Sprites.Sprite("img/tiles/sandgrass_8.png")]
}


const MINIMAP_PIXEL_COLORS = {
    [Map.TERRAIN_TYPES.WATER]: '#3f5f9f',
    [Map.TERRAIN_TYPES.GRASS]: '#637b2f',
    [Map.TERRAIN_TYPES.SAND]: '#cfa343',
    [Map.TERRAIN_TYPES.SANDWATER_4]: '#cfa343',
    [Map.TERRAIN_TYPES.SANDWATER_6]: '#cfa343',
    [Map.TERRAIN_TYPES.SANDWATER_8]: '#cfa343',
    [Map.TERRAIN_TYPES.SANDWATER_3]: '#cfa343',
    [Map.TERRAIN_TYPES.SANDWATER_2]: '#cfa343',
    [Map.TERRAIN_TYPES.SANDWATER_9]: '#cfa343',
    [Map.TERRAIN_TYPES.SANDWATER_1]: '#cfa343',
    [Map.TERRAIN_TYPES.SANDWATER_7]: '#cfa343',
    [Map.TERRAIN_TYPES.WATERSAND_7]: '#3f5f9f',
    [Map.TERRAIN_TYPES.WATERSAND_1]: '#3f5f9f',
    [Map.TERRAIN_TYPES.WATERSAND_3]: '#3f5f9f',
    [Map.TERRAIN_TYPES.WATERSAND_9]: '#3f5f9f',
    TREE: '#003c00'
}

export {
    TERRAIN_IMAGES, MINIMAP_PIXEL_COLORS
}
