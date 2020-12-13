import * as ex from 'excalibur';
import Config from '../config';
import { Ship } from './ship';
import { Shield } from './shield';
import { bulletSheet } from '../resources';

export class Bullet extends ex.Actor {
  public owner?: ex.Actor;
  constructor(source: ex.Vector, dir: ex.Vector, owner?: ex.Actor) {
    super({
      pos: source,
      vel: dir.normalize().scale(Config.bulletSpeed),
      width: Config.bulletSize,
      height: Config.bulletSize,
    });

    this.body.collider.type = ex.CollisionType.Passive;

    if (owner?.body.collider.group) {
      this.body.collider.group = owner.body.collider.group;
    }

    this.owner = owner;
  }

  onInitialize(engine: ex.Engine) {
    this.on('collisionstart', this.onCollisionStart);
    this.on('exitviewport', () => this.kill());

    const anim = bulletSheet.getAnimationByIndices(engine, [3, 4, 5, 6, 7, 8, 7, 6, 5, 4], 100);
    anim.scale = new ex.Vector(2, 2);
    this.addDrawing('default', anim);
  }

  private onCollisionStart(evt: ex.CollisionStartEvent) {
    if (evt.other instanceof Bullet) {
      return;
    }

    if (evt.other instanceof Ship || evt.other instanceof Shield) {
      this.kill();
    } else if (evt.other.body.collider.type !== ex.CollisionType.Passive) {
      this.kill();
    }
  }
}

export class EnemyBullet extends Bullet {}
export class PlayerBullet extends Bullet {}
