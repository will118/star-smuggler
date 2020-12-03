import * as ex from "excalibur";

const game = new ex.Engine({
  height: 768,
  width: 1024
});

const bg = new ex.Texture('/assets/sprites/space/BlueNebulae.png');
const loader = new ex.Loader([bg]);

const map = new ex.TileMap(0, 0, 960, 480, 20, 20);
const sheet = new ex.SpriteSheet(bg, 1, 1, 960, 540);
map.registerSpriteSheet('sheet5000', sheet);

const ts = new ex.TileSprite('sheet5000', 0);
map.getCell(0, 0).pushSprite(ts);
map.getCell(0, 1).pushSprite(ts);
map.getCell(1, 1).pushSprite(ts);
map.getCell(1, 0).pushSprite(ts);

class Ship extends ex.Actor {
  constructor() {
    super({
      x: 150,
      y: game.drawHeight / 2,
      width: 200,
      height: 200
    });

    this.color = ex.Color.Chartreuse;
    this.body.collider.type = ex.CollisionType.Fixed;
  }

  onPostUpdate(_engine: ex.Engine, _delta: number) {
    if (this.pos.x > 1000) {
      this.pos.setTo(500, this.pos.y);
    }
  }
}

const ship2 = new Ship();

game.start(loader).then(() => {
  game.addTileMap(map);
  game.add(ship2);
  ship2.vel.setTo(100, 0);
  game.currentScene.camera.strategy.lockToActor(ship2);
})
