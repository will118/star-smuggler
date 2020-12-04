import * as ex from 'excalibur';

export class Ship extends ex.Actor {
  constructor() {
    super({
      x: 150,
      y: 600,
      width: 200,
      height: 200
    });
  }

  onInitialize() {
    this.color = ex.Color.Chartreuse;
    this.body.collider.type = ex.CollisionType.Fixed;
    this.vel.setTo(60, 0);
  }

  onPostDraw(_ctx: CanvasRenderingContext2D, _delta: number) {
    if (this.pos.x > 1920) {
      this.pos.x -= 960;
    }
  }
}
