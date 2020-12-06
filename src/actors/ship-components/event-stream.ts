export enum EventType {
  Scanner,
  Laser
}

export type ShipEvent = [EventType, Array<number>];

type Listener = (evt: ShipEvent) => void;

export class EventStream {
  private _listeners: Array<Listener>;

  constructor() {
    this._listeners = [];
  }

  addListener(listener: Listener) {
    this._listeners.push(listener);
  }

  post(evt: ShipEvent) {
    for (const listener of this._listeners) {
      listener(evt);
    }
  }
}

const eventStream = new EventStream();

export { eventStream };
