import * as ex from 'excalibur';
import { CodeJar } from 'codejar';
import { Component, code } from './code';
import { HealthBar } from './actors/healthbar';
import { Background } from './actors/background';

const ui = document.getElementById('ui');

export class Container extends ex.Scene {
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
    button.innerText = 'Save';

    button.addEventListener('click', () => {
      code.updateScript(Component.LaserGun, this._code!);
      ui!.removeChild(this._editorModal);
    });

    buttons.appendChild(button);
  }

  onInitialize(engine: ex.Engine) {
    const background = new Background();
    background.vel.setTo(-20, 0);
    engine.add(background);
    engine.add(new HealthBar());
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
