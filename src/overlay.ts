import * as ex from 'excalibur';
import { CodeJar } from 'codejar';
import { HealthBar } from './actors/healthbar';

const ui = document.getElementById('ui');

export class Overlay extends ex.Scene {
  private _editor: HTMLDivElement;

  constructor(engine: ex.Engine) {
    super(engine);
    this._editor = document.createElement('div')
  }

  onInitialize(engine: ex.Engine) {
    const healthBar = new HealthBar();
    engine.add(healthBar);
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
    // Ensure we cleanup the DOM and remove any children when transitioning scenes
    ui!.classList.remove('MainMenu')
    ui!.innerHTML = ''
  }
}
