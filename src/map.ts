import * as ex from "excalibur";

const bg = new ex.Texture('/assets/sprites/space/BlueNebulae.png');
const map = new ex.TileMap(0, 0, 960, 540, 2, 3);
const sheet = new ex.SpriteSheet(bg, 1, 1, 960, 540);
map.registerSpriteSheet('sheet5000', sheet);

const ts = new ex.TileSprite('sheet5000', 0);
map.getCell(0, 0).pushSprite(ts);
map.getCell(0, 1).pushSprite(ts);
map.getCell(1, 1).pushSprite(ts);
map.getCell(1, 0).pushSprite(ts);
map.getCell(2, 1).pushSprite(ts);
map.getCell(2, 0).pushSprite(ts);

export { bg, map };