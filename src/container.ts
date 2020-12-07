import * as ex from 'excalibur';
import { CodeJar } from 'codejar';
import { Component, code } from './code';
import { HealthBar } from './actors/healthbar';
import { EnergyBar } from './actors/energybar';
import { AsteroidField } from './actors/asteroid';
import { Background } from './actors/background';
import { Scanner } from './actors/ship-components/scanner';
import { GameVm } from './game-vm';

const ui = document.getElementById('ui');

export class Container extends ex.Scene {
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
      code.updateScript(Component.LaserGun, this._code!.toUpperCase());
      this._gameVm.exec(code.getParsed(Component.LaserGun));
      ui!.removeChild(this._editorModal);
    });

    buttons.appendChild(button);
  }

  onInitialize(engine: ex.Engine) {
    const background = new Background();
    background.vel.setTo(-20, 0);
    engine.add(background);
    engine.add(new AsteroidField());
    engine.add(new HealthBar());
    engine.add(new EnergyBar());
    engine.add(new Scanner());
    this.generateDocs();
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

    <br />
    <br />

    <p>Sample:</p>
    <p>
        XEQ SCANNER
        <br />
        MOVX LASER
        <br />
        SLP 40
        <br />
        MOVX LASER
        <br />
        ADD 0 200
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

  openEditor() {
    ui!.appendChild(this._editorModal);
  }

  onDeactivate() {
    ui!.innerHTML = ''
  }
}
