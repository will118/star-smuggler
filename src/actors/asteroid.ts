import * as ex from 'excalibur';
import { stats } from '../stats'
import { Horizontals, Verticals } from '../position';
import { Images } from '../resources';
import { Shield } from './shield';
import { PlayerBullet } from './bullet';
import { PlayerShip } from './ship';

const random = (min: number, max: number) => Math.random() * (max - min) + min;

export class AsteroidField extends ex.Actor {
  public shouldSpawn: boolean = true;

  constructor() {
    super({
      pos: new ex.Vector(Horizontals.Right, Verticals.Middle),
    });
  }

  onPostUpdate(engine: ex.Engine) {
    if (!this.shouldSpawn) return;
    const spawnChance = 0.02;

    if (Math.random() < spawnChance) {
      engine.add(new Asteroid({
        pos: new ex.Vector(
          this.pos.x,
          random(Verticals.Top, Verticals.Bottom),
        ),
        vel: new ex.Vector(random(-200, -100), random(-50, 50)),
      }));
    }
  }
}

export interface AsteroidArgs extends ex.ActorArgs {
  texture?: ex.Texture;
}

export class Asteroid extends ex.Actor {
  constructor({
    rx,
    collisionType = ex.CollisionType.Active,
    texture = Images.largeAsteroid,
    ...actorArgs
  }: AsteroidArgs) {
    super({
      rx: rx || random(-2, 2),
      rotation: random(0, 2 * Math.PI),
      body: new ex.Body({
        collider: new ex.Collider({
          shape: ex.Shape.Circle(texture.height / 2),
          type: collisionType,
        })
      }),
      ...actorArgs
    });

    stats.score += 1;
    this.body.collider.bounciness = 0.8;
    this.addDrawing(texture);
  }

  onInitialize(engine: ex.Engine) {
    this.on('collisionstart', this.onCollisionStart(engine));
    this.on('exitviewport', () => {
      this.kill()
    });
  }

  onImpact(engine: ex.Engine) {
    const newVelX = (velX: number) => velX > -20
      ? velX - random(50, 100)
      : velX;
    const newVelY = (velY: number) => velY * random(-2, 2);

    engine.add(new Asteroid({
      pos: this.pos,
      collisionType: ex.CollisionType.PreventCollision,
      texture: Images.smallAsteroid1,
      vel: new ex.Vector(newVelX(this.vel.x), newVelY(this.vel.y)),
    }));

    engine.add(new Asteroid({
      pos: this.pos,
      collisionType: ex.CollisionType.PreventCollision,
      texture: Images.smallAsteroid2,
      vel: new ex.Vector(newVelX(this.vel.x), newVelY(this.vel.y)),
    }));

    return this.kill();
  }

  private onCollisionStart(engine: ex.Engine) {
    return (evt: ex.CollisionStartEvent) => {
      if (
        evt.other.body.collider.type !== ex.CollisionType.Passive ||
        evt.other instanceof PlayerShip ||
        evt.other instanceof Shield ||
        evt.other instanceof PlayerBullet
      ) {
        this.onImpact(engine);
      }
    };
  }
}
