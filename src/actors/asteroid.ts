import * as ex from 'excalibur';
import { stats } from '../stats'
import { position, Horizontal, Vertical } from '../position';
import { Images } from '../resources';
import { PlayerShip } from './ship';

const random = (max: number) => Math.random() * max;

const randomNegOrPos = (range: number) => {
  return random(range) * (Math.round(Math.random()) ? 1 : -1)
}

export class AsteroidField extends ex.Actor {
  public shouldSpawn: boolean = true;

  constructor() {
    super();
    const [x,y] = position(Vertical.Middle, Horizontal.Right)
    this.pos.setTo(x, y);
  }

  onPostUpdate(engine: ex.Engine) {
    if (!this.shouldSpawn) return;
    const spawnChance = 0.02;

    if (Math.random() < spawnChance) {
      engine.add(new Asteroid({
        pos: new ex.Vector(
          this.pos.x,
          this.pos.y + randomNegOrPos(450),
        ),
        vel: new ex.Vector(random(-200), randomNegOrPos(50)),
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
      rx: rx || randomNegOrPos(2),
      rotation: random(2 * Math.PI),
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
      ? velX - (random(50) + 50)
      : velX;
    const newVelY = (velY: number) => velY * randomNegOrPos(1.5);

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
        evt.other instanceof PlayerShip
      ) {
        this.onImpact(engine);
      }
    };
  }
}
