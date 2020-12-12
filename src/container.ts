import * as ex from 'excalibur';
import { CodeJar } from 'codejar';
import { Component, code } from './code';
import { PlayerHealthBar } from './actors/healthbar';
import { EnergyBar } from './actors/energybar';
import { AsteroidField } from './actors/asteroid';
import { position, Horizontal, Vertical } from './position';
import { Background } from './actors/background';
import { Scanner } from './actors/ship-components/scanner';
import { scoreLabel } from './actors/score';
import { GameVm } from './game-vm';
import { stats } from './stats';
import { enemy1 } from './actors/enemy';
import Config from './config';

const ui = document.getElementById('ui');

export class Container extends ex.Scene {
  private _onComplete: (() => void) | null = null;
  private _gameVm: GameVm;
  private _editorModal: HTMLDivElement;
  private _editor: HTMLDivElement;
  private _code: string | null = null;

  constructor(engine: ex.Engine, gameVm: GameVm) {
    super(engine);

    this._gameVm = gameVm;

    this._editorModal = document.createElement('div');
    this._editorModal.className = 'editor';

    this._editor = document.createElement('div')
    this._editor.className = 'actualEditor';
    this._editorModal.appendChild(this._editor);

    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    this._editorModal.appendChild(buttons);

    const button = document.createElement('button');
    button.innerText = 'Save';

    button.addEventListener('click', () => {
      code.updateScript(Component.LaserGun, (this._code! || '').toUpperCase());
      this._gameVm.exec(code.getParsed(Component.LaserGun));
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
        engine.add(enemy1(engine, () => { asteroidField.shouldSpawn = true }));
      }

      if (!gameOverLabelAdded && stats.gameOver()) {
        const [x,y] = position(Vertical.Middle, Horizontal.Middle);
        const gameOverLabel = new ex.Label("YOU LOSE", x - 300, y - 20);
        gameOverLabel.color = ex.Color.White.clone();
        gameOverLabel.scale = new ex.Vector(12, 12);
        engine.add(gameOverLabel);
        gameOverLabelAdded = true;
      }
    });
  }

  private generateDocs() {
    const docs = document.getElementById('docs');
    docs!.innerHTML = `
    <p>Event data goes into the "DATA" register.</p>

    <p>
      <b>XEQ</b> tests the event type (there is not +/i yet).
    </p>
    <p>
      <b>MOVX</b> posts an event to the bus with the DATA register as payload.
    </p>
    <p>
      <b>SLP</b> sleeps for N ms
    </p>
    <p>
      <b>ADD</b> and <b>SUB</b> do aritmetic again the DATA register at a specified index
    </p>
    <p>
      <b>RGT</b> and <b>RLT</b> compare an index of the DATA register and return early
    </p>

    <br />
    <br />

    <p>Sample:</p>
    <p>
        XEQ SCANNER
        <br />
        RLT 0 300
        <br />
        RGT 0 800
        <br />
        RLT 1 -300
        <br />
        RGT 1 300
        <br />
        MOVX LASER
    </p>
      `;
  }

  onActivate() {
    const highlight = (_editor: HTMLElement) => {}
    const jar = CodeJar(this._editor, highlight, { tab: '  ' });
    jar.updateCode(code.getScript(Component.LaserGun));

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
