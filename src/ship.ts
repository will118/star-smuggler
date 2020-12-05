import * as ex from 'excalibur';

export class Ship extends ex.Actor {
  constructor() {
    super({
      x: 150,
      y: 600,
      body: new ex.Body({
        collider: new ex.Collider({
          shape: ex.Shape.Polygon([new ex.Vector(-200, -100), new ex.Vector(-200, 100), new ex.Vector(200, 25), new ex.Vector(200, -25)]),
          type: ex.CollisionType.Fixed,
        })
      }),
    });
  }

  onInitialize() {
    this.color = ex.Color.Chartreuse;
    this.vel.setTo(10, 0);
  }

  onPostDraw(_ctx: CanvasRenderingContext2D, _delta: number) {
    if (this.pos.x > 1920) {
      this.pos.x -= 960;
    }
  }
}
