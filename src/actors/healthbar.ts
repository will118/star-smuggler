import * as ex from 'excalibur';
import Config from '../config';
import { position, Horizontal, Vertical } from '../position';
import { stats } from '../stats';

export type HealthStats = {
  hp: number;
  max: number;
}

class HealthBar extends ex.Actor {
  private _stats: HealthStats;

  constructor(
    stats: HealthStats,
    vertical: Vertical,
    horizontal: Horizontal,
    color: ex.Color,
    xOffset: number,
    yOffset: number) {
    super({
      color: color,
      width: 0,
      height: 0,
      anchor: ex.Vector.Zero.clone(),
    });

    const [x,y] = position(vertical, horizontal);
    this.pos = new ex.Vector(
      x + xOffset,
      y + yOffset);
    this.body.collider.type = ex.CollisionType.PreventCollision;
    this._stats = stats;
  }

  onInitialize(_engine: ex.Engine) {
    this.width = Config.healthBarWidth;
    this.height = Config.healthBarHeight;
  }

  onPreUpdate() {
    this.width = Config.healthBarWidth * (this._stats.hp / this._stats.max);
  }

  onPostDraw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.color.toString();
    ctx.fillStyle = this.color.toString();
    ctx.lineWidth = 3;
    ctx.strokeRect(-5, -5, Config.healthBarWidth + 10, this.height + 10);
  }
}

export class PlayerHealthBar extends HealthBar {
  constructor() {
    super(
      stats,
      Vertical.Bottom,
      Horizontal.Left,
      ex.Color.Chartreuse,
      20,
      -((Config.healthBarHeight * 2) + 40)
    );
  }
}
export class EnemyHealthBar extends HealthBar {
  constructor(healthStats: HealthStats) {
    super(
      healthStats,
      Vertical.Bottom,
      Horizontal.Right,
      ex.Color.Rose,
      -(Config.healthBarWidth + 20),
      -((Config.healthBarHeight * 2) + 40)
    );
  }
}

