import * as ex from 'excalibur';
import { CodeComponent } from '../code';

export enum RegisterName {
  R1 = 'R1',
  R2 = 'R2',
}

export class ChipRegister {
  public name: RegisterName;

  constructor(name: RegisterName) {
    this.name = name;
  }
}

export class Chip extends ex.Actor {
  public component: CodeComponent;
  public registers: Array<ChipRegister>;
  private _onClick: () => void;
  private _originalColor: ex.Color;

  constructor(
    x: number,
    y: number,
    color: ex.Color,
    component: CodeComponent,
    registers: Array<ChipRegister>,
    onClick: (c: Chip) => void) {
      super({ color, x, y, width: 100, height: 50 });
      this._onClick = () => onClick(this);
      this.component = component;
      this._originalColor = color;
      this.registers = registers;
  }

  tryGetRegister(name: RegisterName) {
    return this.registers.find(register => register.name === name);
  }

  resetButton() {
    this.color = this._originalColor;
  }

  onInitialize(engine: ex.Engine) {
    this.on('pointerup', () => {
      this.color = ex.Color.Red;
      this._onClick();
    });

    const label = new ex.Label(
      this.component.toUpperCase(),
      this.pos.x - 30,
      this.pos.y + 15,
      'CodeFont'
    );
    label.fontSize = 30;
    engine.add(label);
  }
}
