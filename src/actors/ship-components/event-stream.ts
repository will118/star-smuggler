export enum SystemEventType {
  Scanner = 'SCANNER',
  Laser = 'LASER',
  ShieldHit = 'SHIELD_HIT',
  Shield = 'SHIELD',
}

export enum ReadWrite {
  Read = 'Read',
  Write = 'Write',
  ReadWrite = 'Read/Write'
}

export type OperandDocs = {
  help: string;
  args: Array<string>;
  io: ReadWrite
}

export const EventTypeLookup: { [key: string]: { type: EventType } & OperandDocs } = {
  SCANNER: {
    type: SystemEventType.Scanner,
    args: ['X', 'Y', 'T'],
    help: 'Bogey detected (0 = Asteroid, 1 = Laser)',
    io: ReadWrite.Read
  },
  LASER: {
    type: SystemEventType.Laser,
    args: ['X', 'Y'],
    help: 'Fires laser',
    io: ReadWrite.Write
  },
  SHIELD: {
    type: SystemEventType.Shield,
    args: ['1/0'],
    help: 'Toggles shield on/off',
    io: ReadWrite.Write
  },
  SHIELD_HIT: {
    type: SystemEventType.ShieldHit,
    args: [],
    help: 'Shield hit',
    io: ReadWrite.Read
  }
};

export type EventType = SystemEventType | string;

export type ShipEvent = Array<EventType | number>;

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
      listener(evt);
    }
  }
}

const eventStream = new EventStream();

export { eventStream };
