import * as ex from 'excalibur';
import Config from '../config';
import { Sounds } from '../resources';
import { Bullet } from './bullet';
import { stats } from '../stats';

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

  fireGun(engine: ex.Engine, x: number, y: number) {
    if (stats.energy - Config.energyPerShot > 0) {
      stats.energy -= Config.energyPerShot;
      const source = new ex.Vector(this.pos.x + 200, this.pos.y);
      const target = new ex.Vector(x, y);
      const dir = target.sub(source);
      const bullet = new Bullet(source, dir, this);
      Sounds.laserSound.play();
      engine.add(bullet);
    }
  }
}
