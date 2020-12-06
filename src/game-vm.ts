import { Listener, EventStream } from './actors/ship-components/event-stream';
import { Laser } from './actors/ship-components/laser';
import { Component } from './actors/ship-components/component';
import { PlainComponent } from './actors/ship-components/plain-component';
import { ProgramAst, Instruction } from './space-lang/parser';

class Environment {
  public IsWaiting: boolean = false;
  public Data: Array<number> = [];

  constructor(data: Array<number>) {
    this.Data = data;
  }
}

const sleep = (ms: number) => new Promise<void>(resolve => {
  setTimeout(() => resolve(), ms);
});

export class GameVm {
  private _components: Array<PlainComponent | Component> = [];
  private _eventStream: EventStream;
  private _removeListener: (() => void) | null = null;

  constructor(eventStream: EventStream, fireLaser: (x: number, y: number) => void) {
    this._eventStream = eventStream;
    this.addComponents(eventStream, fireLaser);
  }

  private updateListener(f: Listener) {
    if (this._removeListener) this._removeListener();
    this._removeListener = this._eventStream.addListener(f);
  }

  private addComponents(eventStream: EventStream, fireLaser: (x: number, y: number) => void) {
    this._components.push(new Laser(eventStream, fireLaser));
  }

  public exec(program: ProgramAst) {
    this.updateListener(async ([eventType, data]) => {
      const env = new Environment(data);
      const lines = [...program];
      let line = null;
      while (line = lines.shift()) {
        const [instruction, operands] = line;
        switch (instruction) {
          case Instruction.XEQ:
            const [awaitedEvtType] = operands;
            if (awaitedEvtType !== eventType) {
              return;
            }
            break;
          case Instruction.SLP:
            const [ms] = operands;
            await sleep(ms);
            break;
          case Instruction.MOVX:
            const [evtType] = operands;
            this._eventStream.post([evtType, env.Data]);
            break;
        }
      }
    });
  }
}
