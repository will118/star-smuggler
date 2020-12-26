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
  Operand
} from './space-lang/types';

class Environment {
  private _data: Array<number> = [];
  private _eventType: EventType;

  constructor(eventType: EventType, data: Array<number>) {
    this._eventType = eventType;
    this._data = data;
  }

  getPayload() {
    return this._data;
  }

  setData(idx: number, v: number) {
    if (idx === 0) {
      throw new Error('Setting EVT[0] is prohibited');
    } else {
      const adjustedIdx = idx - 1;
      this.boundsCheck(adjustedIdx)
      this._data[adjustedIdx] = v;
    }
  }

  getData(idx: number): number | EventType {
    if (idx === 0) {
      return this._eventType;
    } else {
      const adjustedIdx = idx - 1;
      this.boundsCheck(adjustedIdx)
      return this._data[adjustedIdx];
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
  private _removeListener: (() => void) | null = null;

  constructor(
    eventStream: EventStream,
    fireLaser: (x: number, y: number) => void,
    toggleShield: () => void) {
    this._eventStream = eventStream;
    this.addComponents(eventStream, fireLaser, toggleShield);
  }

  private updateListener(f: Listener) {
    if (this._removeListener) this._removeListener();
    this._removeListener = this._eventStream.addListener(f);
  }

  private addComponents(
    eventStream: EventStream,
    fireLaser: (x: number, y: number) => void,
    toggleShield: () => void) {
    this._components.push(new Laser(eventStream, fireLaser));
    this._components.push(new Shield(eventStream, toggleShield));
  }

  public exec(chip: Chip, program: ProgramAst) {
    this.updateListener(async ([eventType, data]) => {
      const env = new Environment(eventType, data);

      const registerOrVal = (operand: Operand, updateFn: ((n: number) => number) | null) => {
        if (isEvtIndex(operand)) {
          const idx = operand.index;
          const value = env.getData(idx);
          if (updateFn !== null) {
            if (isEventType(value)) {
              throw new Error('Updating the event type is not permitted, use OUTD');
            }
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
            r.value = updateFn(r.value);
          }
          return r.value;
        } else if (isEventType(operand)) {
          if (updateFn !== null) throw new Error('Cannot update a value');
          return operand;
        } else {
          throw new Error('Unknown operand');
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
          case Instruction.OUTD: {
            const [evtType] = operands;
            if (!isEventType(evtType)) {
              // Maybe we should allow any string?
              throw new Error('Operand must be valid event type');
            }
            this._eventStream.post([evtType, env.getPayload()]);
            break;
          }
          case Instruction.MOV: {
            const [dst, src] = operands;
            const newVal = registerOrVal(src, null);
            if (isEventType(newVal)) {
              throw new Error('Cannot mov event type');
            }
            registerOrVal(dst, _ => newVal);
            break;
          }
          case Instruction.ADD: {
            const [dst, src] = operands;
            const newVal = registerOrVal(src, null);
            if (isEventType(newVal)) {
              throw new Error('Cannot add event type');
            }
            registerOrVal(dst, v => v + newVal);
            break;
          }
          case Instruction.SUB: {
            const [dst, src] = operands;
            const newVal = registerOrVal(src, null);
            if (isEventType(newVal)) {
              throw new Error('Cannot subtract event type');
            }
            registerOrVal(dst, v => v - newVal);
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
        }
      }
    });
  }
}
