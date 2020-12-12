import * as ex from 'excalibur';
import Config from '../config';
import { EnemyHealthBar } from './healthbar';
import { Ship } from './ship';
import { Sounds } from '../resources';
import { Bullet } from './bullet';
import { HealthStats } from './healthbar';
import { position, Horizontal, Vertical } from '../position';

export interface Phase {
  thresholdPercentage: number;
  action: (self: Enemy) => void;
  [_: string]: any;
}

export class Enemy extends Ship {
  private _health: HealthStats = {
    hp: Config.enemyHealth,
    max: Config.enemyHealth
  };

  private _isMoving: boolean = true;
  private _behaviour: Array<Phase>;
  private _onDefeat: () => void;

  constructor(onDefeat: () => void, behaviour: Array<Phase>) {
    super({
      color: ex.Color.Red,
      body: new ex.Body({
        collider: new ex.Collider({
          shape: ex.Shape.Box(200, 200),
          type: ex.CollisionType.Passive,
        })
      }),
    });
    this._behaviour = behaviour;
    this._onDefeat = onDefeat;
    const [x,y] = position(Vertical.Middle, Horizontal.Right);
    this.pos.x = x + 125;
    this.pos.y = y;
  }

  onInitialize(engine: ex.Engine) {
    engine.add(new EnemyHealthBar(this._health));
    this.actions
      .moveTo(this.pos.x - 300, this.pos.y, 20)
      .callMethod(() => { this._isMoving = false; });
  }

  onPostUpdate(_engine: ex.Engine, _delta: number) {
    if (this._isMoving) return;

    while (this._behaviour.length && this.phaseComplete()) {
      this._behaviour.shift();
    }
    // TODO: this where we take damage
    if (this._behaviour.length == 0) {
      this._onDefeat();
    } else {
      this._behaviour[0].action(this);
    }
  }

  private phaseComplete() {
    return ((this._health.hp / this._health.max) * 100) < this._behaviour[0].thresholdPercentage;
  }

  fireGun(engine: ex.Engine, x: number, y: number) {
    const source = new ex.Vector(this.pos.x - 100, this.pos.y);
    const target = new ex.Vector(x, y);
    const dir = target.sub(source);
    const bullet = new Bullet(source, dir, this);
    Sounds.laserSound.play();
    engine.add(bullet);
  }
}

export const enemy1 = (engine: ex.Engine, onDefeat: () => void) => new Enemy(onDefeat, [
  {
    shots: 4,
    ticks: 0,
    thresholdPercentage: 60,
    action: function(e) {
      if (this.ticks++ < 10) {
        return;
      }
      this.ticks = 0;
      if (this.shots-- > 0) {
        e.fireGun(engine, 0, 0);
      }
    }
  }
]);
