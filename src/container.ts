import * as ex from 'excalibur';
import { CodeJar } from 'codejar';
import { CodeComponent, code } from './code';
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

const ui = document.getElementById('ui');

export class Container extends ex.Scene {
  private _onComplete: (() => void) | null = null;
  private _gameVm: GameVm | null = null;
  private _editorModal: HTMLDivElement;
  private _editor: HTMLDivElement;
  private _code: string | null = null;

  constructor(engine: ex.Engine) {
    super(engine);

    this._editorModal = document.createElement('div');
    this._editorModal.className = 'editor';

    this._editor = document.createElement('div')
    this._editor.className = 'actualEditor';
    this._editorModal.appendChild(this._editor);

    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    this._editorModal.appendChild(buttons);

    const button = document.createElement('button');
    button.innerText = 'SAVE';

    button.addEventListener('click', () => {
      code.updateScript(CodeComponent.LaserGun, (this._code! || '').toUpperCase());
      this._gameVm!.exec(code.getParsed(CodeComponent.LaserGun));
      ui!.removeChild(this._editorModal);
      this._onComplete!();
    });

    buttons.appendChild(button);
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
    const ship = new PlayerShip((_component: CodeComponent) => {
      this.openEditor(() => {
        engine.remove(grid);
        engine.start();
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

  onActivate() {
    const highlight = (_editor: HTMLElement) => {}
    const jar = CodeJar(this._editor, highlight, { tab: '  ' });
    this._code = code.getScript(CodeComponent.LaserGun);
    jar.updateCode(this._code);

    jar.onUpdate(code => {
      this._code = code;
    });
  }

  openEditor(onComplete: () => void) {
    this._onComplete = onComplete;
    ui!.appendChild(this._editorModal);
  }

  onDeactivate() {
    ui!.innerHTML = ''
  }
}
