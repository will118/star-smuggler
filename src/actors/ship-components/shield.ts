import { PlainComponent } from './plain-component';
import { EventStream, EventType } from './event-stream';

export class Shield extends PlainComponent {
  constructor(eventStream: EventStream, toggleShield: () => void) {
    super();

    eventStream.addListener(async ([type, _data]) => {
      if (type === EventType.ShieldToggle) {
        toggleShield();
      }
    });
  }
}
