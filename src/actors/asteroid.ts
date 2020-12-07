import * as ex from 'excalibur';
import { Images } from '../resources';
import { Ship } from './ship';

const random = (min: number, range: number) => {
  const randomInRange = Math.floor(Math.random() * range);
  return min + randomInRange;
}

export class AsteroidField extends ex.Actor {
  public spawnChance = 0.02;
  constructor() {
    super({
      pos: new ex.Vector(1600, 450),
    });
  }

  onPostUpdate(engine: ex.Engine) {
    if (Math.random() < this.spawnChance) {
      engine.add(new Asteroid({
        pos: new ex.Vector(
          this.pos.x,
          this.pos.y + random(-450, 900),
        ),
        vel: new ex.Vector(random(-200, 100), random(-50, 100)),
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
      rx: rx || random(-2, 4),
      rotation: random(0, 2 * Math.PI),
      body: new ex.Body({
        collider: new ex.Collider({
          shape: ex.Shape.Circle(texture.height / 2),
          type: collisionType,
        })
      }),
      ...actorArgs
    });

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
      ? velX - random(50, 50)
      : velX;
    const newVelY = (velY: number) => velY * random(-1.5, 4.5);

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
        evt.other instanceof Ship
      ) {
        this.onImpact(engine);
      }
    };
  }
}
