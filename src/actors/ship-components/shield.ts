import { PlainComponent } from './plain-component';
import { isNumber } from '../../space-lang/types';
import { EventStream, SystemEventType } from './event-stream';

export class Shield extends PlainComponent {
  constructor(eventStream: EventStream, toggleShield: (on: boolean) => void) {
    super();

    eventStream.addListener(async ([type, onOrOff]) => {
      if (type === SystemEventType.Shield) {
        if (!isNumber(onOrOff) || onOrOff > 1 || onOrOff < 0) {
          throw new Error('Invalid arguments to shield component');
        }
        toggleShield(onOrOff === 1);
      }
    });
  }
}
