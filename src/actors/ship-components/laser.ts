import { PlainComponent } from './plain-component';
import { EventStream, EventType } from './event-stream';

export class Laser extends PlainComponent {
  constructor(eventStream: EventStream, fireLaser: (x: number, y: number) => void) {
    super();

    eventStream.addListener(async ([type, data]) => {
      if (type === EventType.Laser) {
        fireLaser(data[0], data[1]);
      }
    });
  }
}
