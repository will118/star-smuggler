import * as ex from 'excalibur';
import { position, Horizontal, Vertical } from '../position';
import { Bullet } from './bullet';
import { EventType, eventStream } from './ship-components/event-stream';

export class Shield extends ex.Actor {
  constructor() {
    const [x,y] = position(Vertical.Middle, Horizontal.Left);

    super({
      x: x + 300,
      y: y,
      color: ex.Color.Red,
      body: new ex.Body({
        collider: new ex.Collider({
          shape: new CircleShield({
            radius: 150
          }),
          type: ex.CollisionType.Passive,
        })
      }),
      anchor: ex.Vector.Zero.clone(),
    });
  }

  onInitialize(_engine: ex.Engine) {
    this.on('collisionstart', this.onCollisionStart);
  }

  // TODO: collisions will still happen with entire circle
  private onCollisionStart(evt: ex.CollisionStartEvent) {
    if (evt.other instanceof Bullet) {
      eventStream.post([EventType.ShieldHit, [evt.other.pos.x, evt.other.pos.y]]);
    }
  }
}

class CircleShield extends ex.Circle {
  public draw(ctx: CanvasRenderingContext2D, _color: ex.Color, pos: ex.Vector) {
    const newPos = pos.add(this.offset);
    ctx.beginPath();
    ctx.lineCap = 'round';
    ctx.lineWidth = 10;
    ctx.shadowBlur = 50;
    ctx.shadowColor = 'cyan';
    const gradient = ctx.createLinearGradient(newPos.x, newPos.y, newPos.x + 250, newPos.y);
    gradient.addColorStop(0, 'green');
    gradient.addColorStop(.5, 'cyan');
    gradient.addColorStop(1, 'green');
    ctx.strokeStyle = gradient;
    const startRadians = (Math.PI/180)*270;
    const endRadians = (Math.PI/180)*450;
    ctx.arc(newPos.x, newPos.y, this.radius, startRadians, endRadians);
    ctx.stroke();
  }
}
