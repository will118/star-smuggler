import * as ex from 'excalibur';
import { Images } from '../resources';
import Config from '../config';

const BG_HEIGHT = 540;
const BG_WIDTH = 960;

class BackgroundCell extends ex.Actor {
  constructor(x: number, y: number) {
    super({
      x: x,
      y: y,
      height: BG_HEIGHT,
      width: BG_WIDTH,
    });

    this.body.collider.type = ex.CollisionType.PreventCollision;
  }

  onInitialize(_engine: ex.Engine) {
    const cell = new ex.Sprite(
      Images.background,
      0,
      0,
      Images.background.width,
      Images.background.height);

    this.addDrawing('default', cell);
  }
}

export class Background extends ex.Actor {
  constructor() {
    super({
      x: 0,
      y: 0,
      height: Config.height * 2, // why x2..
      width: Config.width * 2,
    });

    this.body.collider.type = ex.CollisionType.PreventCollision;
  }

  onInitialize(_engine: ex.Engine) {
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        // using actors for tiles is a bit gross
        this.add(new BackgroundCell(
          BG_WIDTH * row,
          BG_HEIGHT * col
        ));
      }
    }
  }

  onPostDraw(_ctx: CanvasRenderingContext2D, _delta: number) {
    if (this.pos.x < -BG_WIDTH) {
      console.log('repeating');
      this.pos.x += BG_WIDTH;
    }
  }
}
