import { EventType, EventStream } from './actors/ship-components/event-stream';
import { Laser } from './actors/ship-components/laser';
import { Component } from './actors/ship-components/component';
import { PlainComponent } from './actors/ship-components/plain-component';

export class GameVm {
  private _components: Array<PlainComponent | Component> = [];

  constructor(eventStream: EventStream, fireLaser: (x: number, y: number) => void) {
    this.addComponents(eventStream, fireLaser);

    // TODO: this should be user code
    eventStream.addListener(([type, data]) => {
      if (type === EventType.Scanner) {
        eventStream.post([EventType.Laser, data]);
      }
    });
  }

  private addComponents(eventStream: EventStream, fireLaser: (x: number, y: number) => void) {
    this._components.push(new Laser(eventStream, fireLaser));
  }
}
