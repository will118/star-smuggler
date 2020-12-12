import * as ex from 'excalibur';
import Config from '../../config';
import { Component } from './component';
import { Asteroid } from '../asteroid';
import { EventType, eventStream } from './event-stream';
import { position, Horizontal, Vertical } from '../../position';

export class Scanner extends Component {
  private _bogeys: Map<Asteroid, number>;

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
    this._bogeys = new Map<Asteroid, number>();
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

  private onPreCollision(_engine: ex.Engine) {
    return (evt: ex.PreCollisionEvent) => {
      if (evt.other instanceof Asteroid) {
        const asteroid: Asteroid = evt.other;
        if (!this._bogeys.has(asteroid)) {
          this._bogeys.set(asteroid, 0);
          eventStream.post([EventType.Scanner, [evt.other.pos.x, evt.other.pos.y]]);
        }
      }
    }
  }
}
