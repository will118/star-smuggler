import * as ex from 'excalibur';
import Config from '../config';
import { Sounds } from '../resources';
import { Asteroid } from './asteroid';
import { Bullet } from './bullet';
import { stats } from '../stats';

export const shipCollisionGroup = ex.CollisionGroupManager.create('ship');

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
          type: ex.CollisionType.Passive,
          group: shipCollisionGroup,
        })
      }),
    });
  }

  onInitialize(engine: ex.Engine) {
    this.color = ex.Color.Chartreuse;
    this.on('collisionstart', this.onCollisionStart(engine));
  }

  fireGun(engine: ex.Engine, x: number, y: number) {
    if (stats.energy - Config.energyPerShot > 0) {
      stats.energy -= Config.energyPerShot;
      const source = new ex.Vector(this.pos.x + 200, this.pos.y);
      const target = new ex.Vector(x, y);
      const dir = target.sub(source);
      const distance = dir.magnitude();
      const bullet = new Bullet(source, dir.scale(Config.bulletSpeed/distance), this);
      Sounds.laserSound.play();
      engine.add(bullet);
    }
  }

  private onCollisionStart(engine: ex.Engine) {
    return (evt: ex.CollisionStartEvent) => {
      if (evt.other instanceof Asteroid) {
        engine.currentScene.camera.shake(8, 8, 100);
        stats.hp -= 10;
      }
    };
  }
}
