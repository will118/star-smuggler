import * as ex from "excalibur";

const game = new ex.Engine({
  height: 768,
  width: 1024
});

const bg = new ex.Texture('/assets/sprites/space/BlueNebulae.png');
const loader = new ex.Loader([bg]);

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

class Ship extends ex.Actor {
  constructor() {
    super({
      x: 150,
      y: game.drawHeight / 2,
      width: 200,
      height: 200
    });
  }

  onInitialize() {
    this.color = ex.Color.Chartreuse;
    this.body.collider.type = ex.CollisionType.Fixed;
    this.vel.setTo(100, 0);
  }


  onPostDraw(_ctx: CanvasRenderingContext2D, _delta: number) {
    if (this.pos.x > 1920) {
      this.pos.x -= 960;
    }
  }
}

const ship = new Ship();

game.start(loader).then(() => {
  game.addTileMap(map);
  game.add(ship);
  game.currentScene.camera.strategy.lockToActor(ship);
})
