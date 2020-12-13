import * as ex from 'excalibur';
import Config from '../config';
import { EnemyHealthBar } from './healthbar';
import { Ship } from './ship';
import { Sounds } from '../resources';
import { EnemyBullet } from './bullet';
import { HealthStats } from './healthbar';
import { position, Horizontal, Vertical } from '../position';

export interface Phase {
  thresholdPercentage: number;
  action: (self: Enemy) => void;
  phaseComplete: () => void;
  [_: string]: any;
}

export class Enemy extends Ship {
  protected _stats: HealthStats = {
    hp: Config.enemyHealth,
    max: Config.enemyHealth
  };
  protected _shouldTakeAsteroidDamage: boolean = false;

  private _isMoving: boolean = true;
  private _behaviour: Array<Phase>;
  private _onDefeat: () => void;
  private _healthBar: EnemyHealthBar;

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
    this._healthBar = new EnemyHealthBar(this._stats)
  }

  onInitialize(engine: ex.Engine) {
    super.onInitialize(engine);
    engine.add(this._healthBar);
    this.actions
      .moveTo(this.pos.x - 300, this.pos.y, 100)
      .callMethod(() => { this._isMoving = false; });
  }

  onPostUpdate(_engine: ex.Engine, _delta: number) {
    if (this._isMoving) return;

    while (this._behaviour.length && this.phaseComplete()) {
      this._behaviour[0].phaseComplete();
      this._behaviour.shift();
    }
    // TODO: this where we take damage
    if (this._behaviour.length == 0) {
      this._onDefeat();
      this._healthBar.kill();
      this.kill();
    } else {
      this._behaviour[0].action(this);
    }
  }

  private phaseComplete() {
    return ((this._stats.hp / this._stats.max) * 100) <= this._behaviour[0].thresholdPercentage;
  }

  fireGun(engine: ex.Engine, x: number, y: number) {
    const source = new ex.Vector(this.pos.x - 100, this.pos.y);
    const target = new ex.Vector(x, y);
    const dir = target.sub(source);
    const bullet = new EnemyBullet(source, dir, this);
    Sounds.laserSound.play();
    engine.add(bullet);
  }
}

export const enemy1 = (engine: ex.Engine, onDefeat: () => void) => new Enemy(onDefeat, [
  {
    shots: 4,
    thresholdPercentage: 60,
    phaseComplete: function() {
      this.timer.cancel();
    },
    action: function(e) {
      if (this.timer) return;
      this.timer = new ex.Timer({
        fcn: () => {
          e.fireGun(engine, 0, 0);
        },
        interval: 1200,
        repeats: true,
      });
      engine.add(this.timer);
    }
  },
  {
    shots: 4,
    thresholdPercentage: 0,
    phaseComplete: function() {
      this.timer.cancel();
    },
    action: function(e) {
      if (this.timer) return;
      this.timer = new ex.Timer({
        fcn: () => {
          e.fireGun(engine, 0, 0);
        },
        interval: 100,
        repeats: true,
      });
      engine.add(this.timer);
    }
  }
]);
