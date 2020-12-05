import * as ex from 'excalibur';
import { Sounds } from '../resources';
import Config from '../config';
import { Bullet } from './bullet';

// enum Gun {
  // Laser
// }

export class Ship extends ex.Actor {
  // public static Bullets: Bullet[] = [];

  constructor() {
    super({
      x: 150,
      y: 600,
      body: new ex.Body({
        collider: new ex.Collider({
          shape: ex.Shape.Polygon([
            new ex.Vector(-200, -100),
            new ex.Vector(-200, 100),
            new ex.Vector(200, 25),
            new ex.Vector(200, -25)
          ]),
          type: ex.CollisionType.Fixed,
        })
      }),
    });
  }

  onInitialize() {
    this.color = ex.Color.Chartreuse;
    this.vel.setTo(Config.shipSpeed, 0);
  }

  fireGun(engine: ex.Engine) {
    const bullet = new Bullet(
      this.pos.x + 200,
      this.pos.y,
      -Config.playerBulletVelocity - Config.shipSpeed,
      600,
      this);
     Sounds.laserSound.play();
     engine.add(bullet);
  }

  onPostDraw(_ctx: CanvasRenderingContext2D, _delta: number) {
    if (this.pos.x > 1920) {
      this.pos.x -= 960;
    }
  }
}
