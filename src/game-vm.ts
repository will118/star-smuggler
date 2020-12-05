import { EventType, EventStream } from './actors/ship-components/event-stream';

export class GameVm {
  constructor(eventStream: EventStream, fireLaser: (x: number, y: number) => void) {
    eventStream.addListener(([type, data]) => {
      if (type === EventType.Scanner) {
        fireLaser(data[0], data[1]);
      }
    });
  }
}
