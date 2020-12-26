import * as ex from 'excalibur';
import Config from '../../config';
import { Component } from './component';
import { Asteroid } from '../asteroid';
import { EnemyBullet } from '../bullet';
import { SystemEventType, eventStream } from './event-stream';
import { position, Horizontal, Vertical } from '../../position';

export class Scanner extends Component {
  private _bogeys: Map<ex.Actor, number>;

  constructor() {
    const [x,y] = position(Vertical.Middle, Horizontal.Middle);

    super({
      x: x - (Config.width / 10),
      y: y,
      body: new ex.Body({
        collider: new ex.Collider({
          shape: ex.Shape.Box(Config.width - (Config.width / 10), Config.height / 1.25),
          type: ex.CollisionType.Passive,
        })
      }),
    });
    this._bogeys = new Map<ex.Actor, number>();
  }

  onInitialize(engine: ex.Engine) {
    // this.color = ex.Color.Rose;
    this.on('precollision', this.onPreCollision(engine));
  }

  onPostUpdate(_engine: ex.Engine, _delta: number) {
    this._bogeys.forEach((value, key, _) => {
      if (value < Config.components.scanner.redetectionTickCount) {
        this._bogeys.set(key, value + 1);
      } else {
        this._bogeys.delete(key);
      }
    })
  }

  private scannerBogeyType(actor: ex.Actor) {
    if (actor instanceof Asteroid) {
      return 0;
    } else if (actor instanceof EnemyBullet) {
      return 1;
    }
    throw new Error('Unsupported bogey type');
  }

  private onPreCollision(_engine: ex.Engine) {
    return (evt: ex.PreCollisionEvent) => {
      if (evt.other instanceof Asteroid || evt.other instanceof EnemyBullet) {
        if (!this._bogeys.has(evt.other)) {
          this._bogeys.set(evt.other, 0);
          eventStream.post([
            SystemEventType.Scanner,
            evt.other.pos.x,
            evt.other.pos.y,
            this.scannerBogeyType(evt.other)
          ]);
        }
      }
    }
  }
}
