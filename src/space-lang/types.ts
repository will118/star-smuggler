import { EventType } from '../actors/ship-components/event-stream';

export enum Instruction {
  RNE = 'RNE',
  RLT = 'RLT',
  RGT = 'RGT',
  OUTD = 'OUTD',
  MOV = 'MOV',
  SLP = 'SLP',
  ADD = 'ADD',
  SUB = 'SUB',
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
    type: EventType.Scanner,
    args: ['X', 'Y', 'T'],
    help: 'Bogey detected (0 = Asteroid, 1 = Laser)',
    io: ReadWrite.Read
  },
  LASER: {
    type: EventType.Laser,
    args: ['X', 'Y'],
    help: 'Fires laser',
    io: ReadWrite.Write
  },
  SHIELD_TOGGLE: {
    type: EventType.ShieldToggle,
    args: [],
    help: 'Toggles shield on/off',
    io: ReadWrite.Write
  },
  SHIELD_HIT: {
    type: EventType.ShieldHit,
    args: [],
    help: 'Shield hit',
    io: ReadWrite.Read
  }
};


type Documentation = {
  help: string,
  examples: Array<string>
}

export const InstructionDocs: { [key in Instruction]: Documentation } = {
  OUTD: {
    help: 'posts DATA register to event bus with the supplied event type',
    examples: ['OUTD LASER']
  },
  MOV: {
    help: 'copies a register/value to a register (or specified index of the EVT register)',
    examples: ['MOV R1 500', 'MOV EVT[0] 210', 'MOV R2 EVT[1]'],
  },
  ADD: {
    help: 'adds a value to a register (or specified index of the EVT register)',
    examples: ['ADD R1 500', 'ADD 0 210'],
  },
  SUB: {
    help: 'subtracts a value from a register (or specified index of the EVT register)',
    examples: ['SUB R1 500', 'SUB 0 210'],
  },
  SLP: {
    help: 'sleeps for N ms',
    examples: ['SLP 500']
  },
  RNE: {
    help: 'returns if values are not equal',
    examples: ['RNE 50 20', 'RNE EVT[0] SCANNER', 'RNE EVT[1] 50']
  },
  RLT: {
    help: 'returns if first value < second value',
    examples: ['RLT 50 20', 'RLT EVT[0] SCANNER', 'RLT EVT[1] 50']
  },
  RGT: {
    help: 'returns if first value > second value',
    examples: ['RGT 50 20', 'RGT EVT[0] SCANNER', 'RGT EVT[1] 50']
  },
};

export enum Register {
  R1 = 'R1',
  R2 = 'R2',
  EVT = 'EVT',
}

export type EvtIndex = {
  evt: true,
  index: number
}

export type IntegerValue = {
  integer: true,
  value: number
}

export const isEvtIndex = (x: any): x is EvtIndex =>
  x.evt && 'index' in x;
export const isIntegerValue = (x: any): x is IntegerValue =>
  x.integer && 'value' in x;
export const isRegister = (x: any): x is Register =>
  typeof x === 'string' && x in Register;
export const isEventType = (x: any): x is EventType =>
  typeof x === 'string' && x in EventTypeLookup;

export type Operand = EventType | IntegerValue | Register | EvtIndex;
export type Operands = Array<Operand>;

export type ProgramAst = Array<[Instruction, Operands]>;
