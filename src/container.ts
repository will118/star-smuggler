import * as ex from 'excalibur';
import { CodeJar } from 'codejar';
import { HealthBar } from './actors/healthbar';
import { Background } from './actors/background';

const ui = document.getElementById('ui');

export class Container extends ex.Scene {
  private _editor: HTMLDivElement;

  constructor(engine: ex.Engine) {
    super(engine);
    this._editor = document.createElement('div')
  }

  onInitialize(engine: ex.Engine) {
    const background = new Background();
    background.vel.setTo(-20, 0);
    engine.add(background);
    engine.add(new HealthBar());
  }

  onActivate() {
    ui!.classList.add('MainMenu')

    this._editor.className = 'code-container';

    const highlight = (_editor: HTMLElement) => {}

    const jar = CodeJar(this._editor, highlight, { tab: '  ' });

    jar.onUpdate(code => {
      console.log(code)
    });
  }

  openEditor() {
    ui!.appendChild(this._editor);
  }

  onDeactivate() {
    ui!.classList.remove('MainMenu')
    ui!.innerHTML = ''
  }
}
