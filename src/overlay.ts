import * as ex from "excalibur";
import { CodeJar } from 'codejar';

const ui = document.getElementById('ui');

export class Overlay extends ex.Scene {
  constructor(engine: ex.Engine) {
    super(engine);
  }

  onActivate() {
    ui!.classList.add('MainMenu')

    const code = document.createElement('div')

    code.className = 'code-container';

    const highlight = (_editor: HTMLElement) => {
      // const code = editor.textContent
      // Do something with code and set html.
      // editor.innerHTML = code
    }

    const jar = CodeJar(code, highlight)

    jar.onUpdate(code => {
      console.log(code)
    });

    ui!.appendChild(code)
  }

  onDeactivate() {
    // Ensure we cleanup the DOM and remove any children when transitioning scenes
    ui!.classList.remove('MainMenu')
    ui!.innerHTML = ''
  }
}
