import * as ex from 'excalibur';
import Config from '../config';
import { bulletSheet } from '../resources';
import { Asteroid } from './asteroid';

export class Bullet extends ex.Actor {
  public owner?: ex.Actor;
  constructor(x: number, y: number, dx: number, dy: number, owner?: ex.Actor) {
    super({
      pos: new ex.Vector(x, y),
      vel: new ex.Vector(dx, dy),
      width: Config.bulletSize,
      height: Config.bulletSize,
    });
    this.body.collider.type = ex.CollisionType.Passive;
    this.owner = owner;
  }

  onInitialize(engine: ex.Engine) {
    this.on('precollision', this.onPreCollision(engine));
    this.on('exitviewport', () => this.kill());

    const anim = bulletSheet.getAnimationByIndices(engine, [3, 4, 5, 6, 7, 8, 7, 6, 5, 4], 100);
    anim.scale = new ex.Vector(2, 2);
    this.addDrawing('default', anim);
  }

  private onPreCollision(engine: ex.Engine) {
    return (evt: ex.PreCollisionEvent) => {
      if (evt.other instanceof Asteroid) {
        evt.other.onImpact(engine);
        this.kill();
      }
    }
  }
}
