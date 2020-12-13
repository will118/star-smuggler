import * as ex from 'excalibur';
import Config from '../config';
import { CodeComponent } from '../code';
import { Sounds } from '../resources';
import { Asteroid } from './asteroid';
import { HealthStats } from './healthbar';
import { Shield } from './shield';
import { Bullet } from './bullet';
import { stats } from '../stats';
import { position, Horizontal, Vertical } from '../position';

export abstract class Ship extends ex.Actor {
  protected _shieldActive: boolean = false;
  protected _shield: ex.Actor = new Shield()
  protected _shouldTakeAsteroidDamage = true;
  protected abstract _stats: HealthStats;

  onInitialize(engine: ex.Engine) {
    this.on('collisionstart', this.onCollisionStart(engine));
  }

  private onCollisionStart(engine: ex.Engine) {
    return (evt: ex.CollisionStartEvent) => {
      if (this._shouldTakeAsteroidDamage && evt.other instanceof Asteroid) {
        engine.currentScene.camera.shake(8, 8, 100);
        this._stats.hp -= 10;
      }
      if (evt.other instanceof Bullet) {
        engine.currentScene.camera.shake(4, 4, 100);
        this._stats.hp -= 25;
      }
    };
  }
}

export const shipCollisionGroup = ex.CollisionGroupManager.create('ship');

export class PlayerShip extends Ship {
  protected _stats: HealthStats = stats;
  private _onComponentClick: (component: CodeComponent) => void;

  constructor(onComponentClick: (component: CodeComponent) => void) {
    super({
      color: ex.Color.Chartreuse,
      body: new ex.Body({
        collider: new ex.Collider({
          shape: ex.Shape.Polygon([
            new ex.Vector(-200, -100),
            new ex.Vector(-200, 100),
            new ex.Vector(200, 25),
            new ex.Vector(200, -25)
          ]),
          type: ex.CollisionType.Passive,
          group: shipCollisionGroup,
        })
      }),
    });

    this._onComponentClick = onComponentClick;

    const [x,y] = position(Vertical.Middle, Horizontal.Left);
    this.pos.x = x + 225;
    this.pos.y = y;
  }

  onInitialize(engine: ex.Engine) {
    super.onInitialize(engine);
    this.on('pointerup', () => { this._onComponentClick(CodeComponent.LaserGun) });
  }

  private tryTakeEnergy(amount: number) {
    if (stats.energy - amount > 0) {
      stats.energy -= amount;
      return true;
    }
    return false;
  }

  toggleShield(engine: ex.Engine) {
    if (this._shieldActive) {
      engine.remove(this._shield);
      this._shieldActive = false;
    } else if (this.tryTakeEnergy(Config.shieldEnergyPerTick)) {
      engine.add(this._shield);
      this._shieldActive = true;
    }
  }

  fireGun(engine: ex.Engine, x: number, y: number) {
    if (this.tryTakeEnergy(Config.energyPerShot)) {
      const source = new ex.Vector(this.pos.x + 200, this.pos.y);
      const target = new ex.Vector(x, y);
      const dir = target.sub(source);
      const bullet = new Bullet(source, dir, this);
      Sounds.laserSound.play();
      engine.add(bullet);
    }
  }

  onPreUpdate(engine: ex.Engine, _delta: number) {
    if (this._shieldActive && !this.tryTakeEnergy(Config.shieldEnergyPerTick)) {
      this.toggleShield(engine);
    }
  }
}
