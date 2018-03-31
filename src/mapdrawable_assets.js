import { Map } from './engine/map.js';
import { make_image, leftpad } from './utils.js';

let TERRAIN_IMAGES = {};
TERRAIN_IMAGES[Map.TERRAIN_TYPES.WATER] = [];
for(let i = 0; i < 4; ++i) TERRAIN_IMAGES[Map.TERRAIN_TYPES.WATER].push(
    make_image("img/tiles/water_" + leftpad(i, 2, "0") + ".png")
)
TERRAIN_IMAGES[Map.TERRAIN_TYPES.GRASS] = [];
for (let i = 0; i < 9; ++i) TERRAIN_IMAGES[Map.TERRAIN_TYPES.GRASS].push(
    make_image("img/tiles/grass_" + leftpad(i, 2, "0") + ".png")
)
TERRAIN_IMAGES[Map.TERRAIN_TYPES.SAND] = [];
for (let i = 0; i < 9; ++i) TERRAIN_IMAGES[Map.TERRAIN_TYPES.SAND].push(
    make_image("img/tiles/sand_" + leftpad(i, 2, "0") + ".png")
)

TERRAIN_IMAGES[Map.TERRAIN_TYPES.SANDWATER_4] = [make_image("img/tiles/sandwater_4.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.SANDWATER_6] = [make_image("img/tiles/sandwater_6.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.SANDWATER_8] = [make_image("img/tiles/sandwater_8.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.SANDWATER_3] = [make_image("img/tiles/sandwater_3.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.SANDWATER_2] = [make_image("img/tiles/sandwater_2.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.SANDWATER_9] = [make_image("img/tiles/sandwater_9.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.SANDWATER_1] = [make_image("img/tiles/sandwater_1.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.SANDWATER_7] = [make_image("img/tiles/sandwater_7.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.WATERSAND_7] = [make_image("img/tiles/watersand_7.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.WATERSAND_1] = [make_image("img/tiles/watersand_1.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.WATERSAND_3] = [make_image("img/tiles/watersand_3.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.WATERSAND_9] = [make_image("img/tiles/watersand_9.png")];


TERRAIN_IMAGES[Map.TERRAIN_TYPES.GRASSSAND_1] = [make_image("img/tiles/grasssand_1.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.GRASSSAND_2] = [make_image("img/tiles/grasssand_2.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.GRASSSAND_3] = [make_image("img/tiles/grasssand_3.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.GRASSSAND_4] = [make_image("img/tiles/grasssand_4.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.GRASSSAND_6] = [make_image("img/tiles/grasssand_6.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.GRASSSAND_7] = [make_image("img/tiles/grasssand_7.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.GRASSSAND_8] = [make_image("img/tiles/grasssand_8.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.GRASSSAND_9] = [make_image("img/tiles/grasssand_9.png")];


TERRAIN_IMAGES[Map.TERRAIN_TYPES.SANDGRASS_0] = [make_image("img/tiles/sandgrass_0.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.SANDGRASS_2] = [make_image("img/tiles/sandgrass_2.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.SANDGRASS_2_8] = [make_image("img/tiles/sandgrass_2_8.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.SANDGRASS_4] = [make_image("img/tiles/sandgrass_4.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.SANDGRASS_4_6] = [make_image("img/tiles/sandgrass_4_6.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.SANDGRASS_6] = [make_image("img/tiles/sandgrass_6.png")];
TERRAIN_IMAGES[Map.TERRAIN_TYPES.SANDGRASS_8] = [make_image("img/tiles/sandgrass_8.png")];



let MINIMAP_PIXEL_COLORS = {};
MINIMAP_PIXEL_COLORS[Map.TERRAIN_TYPES.WATER] = '#3f5f9f';
MINIMAP_PIXEL_COLORS[Map.TERRAIN_TYPES.GRASS] = '#637b2f';
MINIMAP_PIXEL_COLORS[Map.TERRAIN_TYPES.SAND] = '#cfa343';
MINIMAP_PIXEL_COLORS[Map.TERRAIN_TYPES.SANDWATER_4] = '#cfa343';
MINIMAP_PIXEL_COLORS[Map.TERRAIN_TYPES.SANDWATER_6] = '#cfa343';
MINIMAP_PIXEL_COLORS[Map.TERRAIN_TYPES.SANDWATER_8] = '#cfa343';
MINIMAP_PIXEL_COLORS[Map.TERRAIN_TYPES.SANDWATER_3] = '#cfa343';
MINIMAP_PIXEL_COLORS[Map.TERRAIN_TYPES.SANDWATER_2] = '#cfa343';
MINIMAP_PIXEL_COLORS[Map.TERRAIN_TYPES.SANDWATER_9] = '#cfa343';
MINIMAP_PIXEL_COLORS[Map.TERRAIN_TYPES.SANDWATER_1] = '#cfa343';
MINIMAP_PIXEL_COLORS[Map.TERRAIN_TYPES.SANDWATER_7] = '#cfa343';
MINIMAP_PIXEL_COLORS[Map.TERRAIN_TYPES.WATERSAND_7] = '#3f5f9f';
MINIMAP_PIXEL_COLORS[Map.TERRAIN_TYPES.WATERSAND_1] = '#3f5f9f';
MINIMAP_PIXEL_COLORS[Map.TERRAIN_TYPES.WATERSAND_3] = '#3f5f9f';
MINIMAP_PIXEL_COLORS[Map.TERRAIN_TYPES.WATERSAND_9] = '#3f5f9f';
MINIMAP_PIXEL_COLORS.TREE = '#003c00';


export {
    TERRAIN_IMAGES, MINIMAP_PIXEL_COLORS
}