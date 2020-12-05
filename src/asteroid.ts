import * as ex from 'excalibur';
import { Images } from './resources';
import { Ship } from './ship';

const random = (min: number, max: number) => Math.random() * (max - min) + min;

export class AsteroidField extends ex.Actor {
  public spawnChance = 0.02;
  public ySpread = 500;

  constructor() {
    super({
      // tracking ahead of ship off screen
      pos: new ex.Vector(1920, 600),
      vel: new ex.Vector(10, 0),
    });
  }

  onPostUpdate(engine: ex.Engine) {
    if (Math.random() < this.spawnChance) {
      engine.add(new Asteroid({
        pos: new ex.Vector(
          this.pos.x,
          this.pos.y + random(-this.ySpread / 2, this.ySpread / 2),
        ),
        vel: new ex.Vector(random(-200, -100), random(-100, 100)),
      }));
    }
  }
}

export interface AsteroidArgs extends ex.ActorArgs {
  texture?: ex.Texture;
}

export class Asteroid extends ex.Actor {
  public collision?: ex.GameEvent<ex.Actor, ex.Actor>;

  constructor({
    rx,
    collisionType = ex.CollisionType.Active,
    texture = Images.largeAsteroid,
    ...actorArgs
  }: AsteroidArgs) {
    super({
      rx: rx || random(-2, 2),
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
    this.on('collisionstart', (c) => this.collision = c);
  }

  onPostUpdate(engine: ex.Engine) {
    if (this.collision) {
      if (this.collision.other instanceof Ship) {
        engine.currentScene.camera.shake(8, 8, 100);
      }

      const newVelX = (velX: number) => velX > -20 ? // head on dead stop
        velX - random(50, 100) : velX;
      const newVelY = (velY: number) => velY * random(-1.5, 3);

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

    if (
      this.pos.x < 0 || this.pos.x > 5000 ||
      this.pos.y < 0 || this.pos.y > 1200 ||
      (Math.abs(this.vel.x) < 1 && Math.abs(this.vel.y) < 1)
    ) {
      return this.kill(); // remove if out of bounds or stalled
    }
  }
}
