import * as ex from 'excalibur';
import Config from '../config';
import { position, Horizontal, Vertical } from '../position';
import { stats } from '../stats';

export class EnergyBar extends ex.Actor {
  constructor() {
    super({
      color: ex.Color.Cyan,
      pos: new ex.Vector(20, 0),
      width: 0,
      height: 0,
      anchor: ex.Vector.Zero.clone(),
    });

    this.body.collider.type = ex.CollisionType.PreventCollision;
  }

  onInitialize(_engine: ex.Engine) {
    const [x,y] = position(Vertical.Bottom, Horizontal.Middle);
    this.pos = new ex.Vector(
      x + Config.healthBarWidth - 20,
      y - Config.healthBarHeight - 20);
    this.width = Config.healthBarWidth;
    this.height = Config.healthBarHeight;
  }

  onPreUpdate() {
    // regen enery per tick
    if (stats.energy + Config.energyPerTick < Config.totalEnergy) {
      stats.energy += Config.energyPerTick;
    } else {
      stats.energy = Config.totalEnergy;
    }
    this.width = Config.healthBarWidth * (stats.energy / Config.totalEnergy);
  }

  onPostDraw(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = this.color.toString();
    ctx.fillStyle = this.color.toString();
    ctx.lineWidth = 3;
    ctx.font = 'normal 30px sans-serif'
    ctx.fillText("ENERGY:", -5, - this.height);
    ctx.strokeRect(-5, -5, Config.healthBarWidth + 10, this.height + 10);
  }
}
