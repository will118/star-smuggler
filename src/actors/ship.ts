import * as ex from 'excalibur';
import Config from '../config';
import { CodeComponent } from '../code';
import { Sounds } from '../resources';
import { Asteroid } from './asteroid';
import { HealthStats } from './healthbar';
import { Shield } from './shield';
import { Bullet, PlayerBullet } from './bullet';
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

  protected gameOver() { return this._stats.hp <= 0 }
}

export const shipCollisionGroup = ex.CollisionGroupManager.create('ship');

export class PlayerShip extends Ship {
  protected _stats: HealthStats = stats;
  private _chipComponents: { [key in CodeComponent]: Chip | null };
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

    this._chipComponents = {
      [CodeComponent.LaserGun]: null,
      [CodeComponent.Shield]: null,
    };
    this._onComponentClick = onComponentClick;

    const [x,y] = position(Vertical.Middle, Horizontal.Left);
    this.pos.x = x + 225;
    this.pos.y = y;
  }

  resetButton(component: CodeComponent) {
    this._chipComponents[component]!.resetButton();
  }

  onInitialize(engine: ex.Engine) {
    super.onInitialize(engine);
    const shieldComponent = new Chip(
      100,
      0,
      ex.Color.fromRGB(50, 160, 168),
      CodeComponent.Shield,
      this._onComponentClick
    );

    engine.add(shieldComponent);

    this._chipComponents[CodeComponent.Shield] = shieldComponent;

    const laserComponent = new Chip(
      225,
      0,
      ex.Color.fromRGB(50, 160, 168),
      CodeComponent.LaserGun,
      this._onComponentClick
    );

    this._chipComponents[CodeComponent.LaserGun] = laserComponent;

    engine.add(laserComponent)
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
    if (!this.gameOver() && this.tryTakeEnergy(Config.energyPerShot)) {
      const source = new ex.Vector(this.pos.x + 200, this.pos.y);
      const target = new ex.Vector(x, y);
      const dir = target.sub(source);
      const bullet = new PlayerBullet(source, dir, this);
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

class Chip extends ex.Actor {
  private _onClick: () => void;
  private _component: CodeComponent;
  private _originalColor: ex.Color;

  constructor(
    x: number,
    y: number,
    color: ex.Color,
    component: CodeComponent,
    onClick: (c: CodeComponent) => void) {
      super({ color, x, y, width: 100, height: 50 });
      this._onClick = () => onClick(component);
      this._component = component;
      this._originalColor = color;
  }

  resetButton() {
    this.color = this._originalColor;
  }

  onInitialize(engine: ex.Engine) {
    this.on('pointerup', () => {
      this.color = ex.Color.Red;
      this._onClick();
    });

    const label = new ex.Label(
      this._component.toUpperCase(),
      this.pos.x - 30,
      this.pos.y + 15,
      'CodeFont'
    );
    label.fontSize = 30;
    engine.add(label);
  }
}
