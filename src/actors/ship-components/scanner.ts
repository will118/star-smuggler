import * as ex from 'excalibur';
import Config from '../../config';
import { Component } from './component';
import { Asteroid } from '../asteroid';
import { EventType, eventStream } from './event-stream';

export class Scanner extends Component {
  private _bogeys: Map<Asteroid, number>;

  constructor() {
    super({
      x: 250,
      y: 450,
      body: new ex.Body({
        collider: new ex.Collider({
          shape: ex.Shape.Circle(900),
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
          eventStream.onEvent([EventType.Scanner, [evt.other.pos.x, evt.other.pos.y]]);
        }
      }
    }
  }
}
