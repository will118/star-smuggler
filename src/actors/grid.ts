import * as ex from 'excalibur';
import Config from '../config';
import { position, Horizontal, Vertical } from '../position';

export class Grid extends ex.Actor {
  constructor() {
    const [x,y] = position(Vertical.Top, Horizontal.Left);
    super({
      x,
      y,
      width: 0,
      height: 0,
      anchor: ex.Vector.Zero.clone(),
    });

    this.body.collider.type = ex.CollisionType.PreventCollision;
  }

  onPostDraw(ctx: CanvasRenderingContext2D) {
    const bw = Config.width;
    const bh = Config.height;

    const step = 100;

    const originY = bh / 2;

    for (let y = 0; y <= originY; y += step) {
      for (const isUp of [true, false]) {
        const lineY = isUp ? originY - y : originY + y;
        ctx.moveTo(0, lineY);
        ctx.lineTo(bw, lineY);

        if (y < originY) {
          ctx.fillStyle = "orange";
          ctx.font = "20px CodeFont";
          ctx.fillText(`${isUp ? '-' : ''}${y}`, 5, lineY - 10);
        }
      }
    }

    const originX = 0;

    for (let x = 0; x <= bw; x += step) {
      const lineX = originX + x;
      ctx.moveTo(lineX, 0);
      ctx.lineTo(lineX, bh);

      if (x > 0 && x < bw) {
        ctx.fillStyle = "orange";
        ctx.font = "20px CodeFont";
        ctx.fillText(`${x}`, lineX + 5, 15);
      }
    }

    ctx.strokeStyle = 'rgba(255, 165, 0, 0.3)'
    ctx.stroke();
  }
}
