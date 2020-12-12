import * as ex from 'excalibur';
import Config from '../config';
import { Sounds } from '../resources';
import { Asteroid } from './asteroid';
import { Bullet } from './bullet';
import { stats } from '../stats';
import { position, Horizontal, Vertical } from '../position';

export class Ship extends ex.Actor {
  onInitialize(engine: ex.Engine) {
    this.on('collisionstart', this.onCollisionStart(engine));
  }

  private onCollisionStart(engine: ex.Engine) {
    return (evt: ex.CollisionStartEvent) => {
      if (evt.other instanceof Asteroid) {
        engine.currentScene.camera.shake(8, 8, 100);
        stats.hp -= 10;
      }
      if (evt.other instanceof Bullet) {
        engine.currentScene.camera.shake(4, 4, 100);
        stats.hp -= 25;
      }
    };
  }
}

export const shipCollisionGroup = ex.CollisionGroupManager.create('ship');

export class PlayerShip extends Ship {
  constructor() {
    const [x,y] = position(Vertical.Middle, Horizontal.Left);
    super({
      x: x + 225,
      y,
      color: ex.Color.Chartreuse,
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
