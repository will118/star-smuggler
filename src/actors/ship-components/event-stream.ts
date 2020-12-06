export enum EventType {
  Scanner,
  Laser
}

export const EventTypeLookup: { [key: string]: EventType } = {
  SCANNER: EventType.Scanner,
  LASER: EventType.Laser,
};

export type ShipEvent = [EventType, Array<number>];

export type Listener = (evt: ShipEvent) => Promise<void>;

export class EventStream {
  private _listeners: Array<Listener>;

  constructor() {
    this._listeners = [];
  }

  addListener(listener: Listener) {
    this._listeners.push(listener);
    return () => this._listeners.splice(this._listeners.findIndex(x => x === listener), 1);
  }

  post(evt: ShipEvent) {
    for (const listener of this._listeners) {
      // don't await promise?
      listener(evt);
    }
  }
}

const eventStream = new EventStream();

export { eventStream };
