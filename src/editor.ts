import { CodeJar } from 'codejar';
import { GameVm } from './game-vm';
import { code } from './code';
import { Chip, ChipRegister } from './actors/chip';
import { Instruction, EventTypeLookup } from './space-lang/parser';

const ui = document.getElementById('ui');

export class Editor {
  private _onSave: ((shouldExec: boolean) => (() => void)) | null = null;
  private _code: string | null = null;
  private _editorModal: HTMLDivElement;
  private _registersElement: HTMLDivElement;
  private _componentLabel: HTMLParagraphElement;
  private _editor: HTMLDivElement;
  private _jar: CodeJar | null = null;

  constructor() {
    this._editorModal = document.createElement('div');
    this._editorModal.className = 'editor';

    this._editor = document.createElement('div')
    this._editor.className = 'actualEditor';
    this._editorModal.appendChild(this._editor);

    const buttons = document.createElement('div');
    buttons.className = 'buttons';
    this._editorModal.appendChild(buttons);

    const button = document.createElement('button');
    button.innerText = 'EXEC';
    button.addEventListener('click', () => this._onSave!(true)());
    buttons.appendChild(button);

    const cancelButton = document.createElement('button');
    cancelButton.innerText = 'CANCEL';
    cancelButton.addEventListener('click', () => this._onSave!(false)());
    buttons.appendChild(cancelButton);

    this._registersElement = document.createElement('div');
    buttons.appendChild(this._registersElement);

    this._componentLabel = document.createElement('p');
    this._componentLabel.innerText = 'UNKNOWN';
    buttons.appendChild(this._componentLabel);

    this._jar = CodeJar(this._editor, this.highlight, { tab: '  ' });
    this._jar.onUpdate(code => {
      this._code = code;
    });
  }

  private highlight(editor: HTMLElement) {
    // its pretty small and basic so we can just hack together
    const code = (editor.textContent || '');

    editor.innerHTML = code.split('\n').map(line => {
      line = line.trim().toUpperCase();
      let outputLine = '';

      const instructionMatch = line.match(/^([^\s]+)/);
      const instruction = instructionMatch && instructionMatch[0];

      if (instruction && instruction in Instruction) {
        outputLine += `<span class='editor-instruction'>${instruction} </span>`;
        line = line.substring(instruction.length + 1);
      }

      // bit dodgy, just matching last word
      const eventTypeMatch = line.match(/^(\w+)$/);
      const eventType = eventTypeMatch && eventTypeMatch[1];

      if (eventType && eventType in EventTypeLookup) {
        outputLine += `<span class='editor-event-type'>${eventType}</span>`;
        line = '';
      }

      return outputLine + line;
    }).join('\n');
  }

  private setRegisters(registers: Array<ChipRegister>) {
    this._registersElement.innerHTML = '';
    for (const register of registers) {
      const regElem = document.createElement('div');
      regElem.classList.add('register');
      regElem.innerText = register.name;
      this._registersElement.appendChild(regElem);
    }
  }

  open(vm: GameVm, chipComponent: Chip, onComplete: () => void) {
    this._onSave = (shouldExec: boolean) => () => {
      code.updateScript(chipComponent.component, this._code! || '');
      if (shouldExec) {
        vm.exec(code.getParsed(chipComponent.component));
      }
      ui!.removeChild(this._editorModal);
      onComplete();
    }
    this._componentLabel.innerText = chipComponent.component;
    this.setRegisters(chipComponent.registers);
    this._code = code.getScript(chipComponent.component);
    this._jar!.updateCode(this._code);
    ui!.appendChild(this._editorModal);
  }
}
