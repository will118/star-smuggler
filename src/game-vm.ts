import { Listener, EventStream, EventType } from './actors/ship-components/event-stream';
import { Laser } from './actors/ship-components/laser';
import { Chip } from './actors/chip';
import { Shield } from './actors/ship-components/shield';
import { Component } from './actors/ship-components/component';
import { PlainComponent } from './actors/ship-components/plain-component';
import {
  Register,
  ProgramAst,
  Instruction,
  isEvtIndex,
  isIntegerValue,
  isRegister,
  isEventType,
  isEventTypeValue,
  Operand
} from './space-lang/types';

class Environment {
  private _data: Array<number | EventType> = [];

  constructor(payload: Array<number | EventType>) {
    this._data = payload;
  }

  getPayload() {
    return this._data
  }

  setData(idx: number, v: number | EventType) {
    this.boundsCheck(idx)
    this._data[idx] = v;
  }

  getData(idx: number): number | EventType {
    this.boundsCheck(idx)
    return this._data[idx];
  }

  resizeData(size: number) {
    if (size <= this._data.length) {
      this._data.length = size;
    } else {
      this._data = this._data.concat(
        (new Array(size - this._data.length)).fill(0)
      );
    }
  }

  boundsCheck(i: number) {
    if (i >= this._data.length) {
      throw new Error('Index out of range');
    }
  }
}

const sleep = (ms: number) => new Promise<void>(resolve => {
  setTimeout(() => resolve(), ms);
});

export class GameVm {
  private _components: Array<PlainComponent | Component> = [];
  private _eventStream: EventStream;
  private _removeListenerMap: Map<Chip, () => {}> = new Map();

  constructor(
    eventStream: EventStream,
    fireLaser: (x: number, y: number) => void,
    toggleShield: (on: boolean) => void) {
    this._eventStream = eventStream;
    this.addComponents(eventStream, fireLaser, toggleShield);
  }

  private updateListener(chip: Chip, f: Listener) {
    this._removeListenerMap.get(chip)?.();
    this._removeListenerMap.set(chip, this._eventStream.addListener(f));
  }

  private addComponents(
    eventStream: EventStream,
    fireLaser: (x: number, y: number) => void,
    toggleShield: (on: boolean) => void) {
    this._components.push(new Laser(eventStream, fireLaser));
    this._components.push(new Shield(eventStream, toggleShield));
  }

  public exec(chip: Chip, program: ProgramAst) {
    this.updateListener(chip, async (payload) => {
      const env = new Environment(payload);

      const registerOrVal = (operand: Operand, updateFn: ((n: number | EventType) => number | EventType) | null) => {
        if (isEvtIndex(operand)) {
          const idx = operand.index;
          const value = env.getData(idx);
          if (updateFn !== null) {
            const newVal = updateFn(value);
            env.setData(idx, newVal);
          }
          return env.getData(idx);
        } else if (isIntegerValue(operand)) {
           if (updateFn !== null) throw new Error('Cannot update a value');
           return operand.value;
        } else if (isRegister(operand)) {
          if (operand === Register.EVT) {
            throw new Error('Addressing EVT register directly forbidden');
          }
          const r = chip.registers.find(r => r.name === operand);

          if (!r) {
            throw new Error('Unable to locate register');
          }
          if (updateFn !== null) {
            const newVal = updateFn(r.value)
            if (isEventType(newVal)) {
              throw new Error('Register only supports numeric values');
            }
            r.value = newVal;
          }
          return r.value;
        } else if (isEventTypeValue(operand)) {
          if (updateFn !== null) throw new Error('Cannot update a value');
          return operand.value;
        } else {
          throw new Error('Unknown operand: ' + JSON.stringify(operand));
        }
      }

      const lines = [...program];
      let line = null;
      while (line = lines.shift()) {
        const [instruction, operands] = line;
        switch (instruction) {
          case Instruction.SLP: {
            const [ms] = operands;
            if (!isIntegerValue(ms)) {
              throw new Error('SLP only supports immediate values');
            }
            await sleep(ms.value);
            break;
          }
          case Instruction.POST: {
            const [count] = operands;
            let n = 1;
            if (count) {
              if (!isIntegerValue(count)) {
                throw new Error('POST only supports immediate integer value');
              }
              if (count.value < 0) {
                throw new Error('POST optional count operand must be greater than 0');
              }
              n = count.value;
            }

            while (n-- > 0) {
              this._eventStream.post(env.getPayload());
            }

            break;
          }
          case Instruction.MOV: {
            const [dst, src] = operands;
            const newVal = registerOrVal(src, null);
            registerOrVal(dst, _ => newVal);
            break;
          }
          case Instruction.ADD: {
            const [dst, src] = operands;
            const newVal = registerOrVal(src, null);
            registerOrVal(dst, v => {
              if (isEventType(v) || isEventType(newVal)) {
                throw new Error('Cannot add event type');
              }
              return v + newVal;
            });
            break;
          }
          case Instruction.SUB: {
            const [dst, src] = operands;
            const newVal = registerOrVal(src, null);
            registerOrVal(dst, v => {
              if (isEventType(v) || isEventType(newVal)) {
                throw new Error('Cannot subtract event type');
              }
              return v - newVal;
            });
            break;
          }
          case Instruction.RNE: {
            const [lhs, rhs] = operands;
            if (registerOrVal(lhs, null) !== registerOrVal(rhs, null)) {
              return;
            }
            break;
          }
          case Instruction.RLT: {
            const [lhs, rhs] = operands;
            if (registerOrVal(lhs, null) < registerOrVal(rhs, null)) {
              return;
            }
            break;
          }
          case Instruction.RGT: {
            const [lhs, rhs] = operands;
            if (registerOrVal(lhs, null) > registerOrVal(rhs, null)) {
              return;
            }
            break;
          }
          case Instruction.LEN: {
            const [len] = operands;
            const l = registerOrVal(len, null);
            if (isEventType(l)) {
              throw new Error('Cannot set length with event type');
            }
            env.resizeData(l);
            break;
          }
          default:
            const exhaustiveCheck: never = instruction;
            throw new Error(`Unhandled instruction: ${exhaustiveCheck}`);
        }
      }
    });
  }
}
