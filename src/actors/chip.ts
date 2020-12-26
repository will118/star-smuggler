import * as ex from 'excalibur';
import { CodeComponent } from '../code';
import { Register } from '../space-lang/types';

export class ChipRegister {
  public name: Register;
  public value: number;

  constructor(name: Register) {
    this.name = name;
    this.value = 0;
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
