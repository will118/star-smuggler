import * as ex from 'excalibur';
import { Editor } from './editor';
import { PlayerHealthBar } from './actors/healthbar';
import { EnergyBar } from './actors/energybar';
import { AsteroidField } from './actors/asteroid';
import { position, Horizontal, Vertical } from './position';
import { eventStream } from './actors/ship-components/event-stream';
import { Background } from './actors/background';
import { Scanner } from './actors/ship-components/scanner';
import { scoreLabel } from './actors/score';
import { GameVm } from './game-vm';
import { stats } from './stats';
import { enemy1 } from './actors/enemy';
import { generateDocs } from './docs';
import { PlayerShip } from './actors/ship';
import { Grid } from './actors/grid';
import Config from './config';

export class Container extends ex.Scene {
  private _gameVm: GameVm | null = null;
  private _editor: Editor;

  constructor(engine: ex.Engine) {
    super(engine);
    this._editor = new Editor();
  }

  onInitialize(engine: ex.Engine) {
    const [x,y] = position(Vertical.Middle, Horizontal.Middle);
    engine.currentScene.camera.x = x;
    engine.currentScene.camera.y = y;

    const background = new Background();
    background.vel.setTo(-20, 0);
    engine.add(background);
    const asteroidField = new AsteroidField();
    engine.add(asteroidField);
    engine.add(new PlayerHealthBar());
    engine.add(new EnergyBar());
    engine.add(new Scanner());
    engine.add(scoreLabel());
    this.generateDocs();

    let gameOverLabelAdded = false;
    let enemy1Added = false;

    engine.on('preupdate', () => {
      if (!enemy1Added && stats.score > Config.enemyTrigger) {
        enemy1Added = true;
        asteroidField.shouldSpawn = false;
        engine.add(enemy1(engine, () => {
          asteroidField.shouldSpawn = true;
        }));
      }

      if (!gameOverLabelAdded && stats.gameOver()) {
        const [x,y] = position(Vertical.Middle, Horizontal.Middle);
        const gameOverLabel = new ex.Label("YOU LOSE", x - 200, y - 20);
        gameOverLabel.color = ex.Color.White.clone();
        gameOverLabel.scale = new ex.Vector(8, 8);
        engine.add(gameOverLabel);
        gameOverLabelAdded = true;
      }
    });

    const grid = new Grid();
    const ship = new PlayerShip(component => {
      this._editor.open(this._gameVm!, component, () => {
        engine.remove(grid);
        engine.start();
        ship.resetButton(component);
      });
      engine.add(grid);
      engine.stop();
    });

    engine.add(ship);

    this._gameVm = new GameVm(
      eventStream,
      (x, y) => ship.fireGun(engine, x, y),
      () => ship.toggleShield(engine));

    console.log('Game VM started: ', this._gameVm);
  }

  private generateDocs() {
    const docs = document.getElementById('docs');
    docs!.innerHTML = generateDocs();
  }
}
