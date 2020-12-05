import * as ex from 'excalibur';
import { Sounds } from '../resources';
import Config from '../config';
import { Bullet } from './bullet';

export class Ship extends ex.Actor {
  constructor() {
    super({
      x: 250,
      y: 450,
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
  }

  fireGun(engine: ex.Engine) {
    const bullet = new Bullet(
      this.pos.x + 200,
      this.pos.y,
      -Config.playerBulletVelocity,
      600,
      this);
     Sounds.laserSound.play();
     engine.add(bullet);
  }
}
