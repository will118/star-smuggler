import { PlainComponent } from './plain-component';
import { isNumber } from '../../space-lang/types';
import { EventStream, SystemEventType } from './event-stream';

export class Laser extends PlainComponent {
  constructor(eventStream: EventStream, fireLaser: (x: number, y: number) => void) {
    super();

    eventStream.addListener(async ([type, ...data]) => {
      if (type === SystemEventType.Laser) {
        if (!isNumber(data[0]) || !isNumber(data[1])) {
          throw new Error('Invalid arguments to laser component');
        }
        fireLaser(data[0], data[1]);
      }
    });
  }
}
