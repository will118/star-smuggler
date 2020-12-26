import { EventType } from '../actors/ship-components/event-stream';

export enum Instruction {
  RNE = 'RNE',
  RLT = 'RLT',
  RGT = 'RGT',
  POST = 'POST',
  MOV = 'MOV',
  SLP = 'SLP',
  ADD = 'ADD',
  SUB = 'SUB',
  LEN = 'LEN',
}

type Documentation = {
  help: string,
  examples: Array<string>
}

export const InstructionDocs: { [key in Instruction]: Documentation } = {
  POST: {
    help: 'posts EVT register to event bus, with optional count',
    examples: ['POST', 'POST 5']
  },
  MOV: {
    help: 'copies a register/value to a register (or specified index of the EVT register)',
    examples: ['MOV R1 500', 'MOV EVT[0] 210', 'MOV R2 EVT[1]'],
  },
  LEN: {
    help: 'sets the length of the EVT register, expanding will initialize elements with value of 0',
    examples: ['LEN 5', 'LEN 0'],
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

export type EvtTypeValue = {
  evtType: true,
  value: EventType
}

export const isEvtIndex = (x: any): x is EvtIndex =>
  x.evt && 'index' in x;
export const isIntegerValue = (x: any): x is IntegerValue =>
  x.integer && 'value' in x;
export const isRegister = (x: any): x is Register =>
  typeof x === 'string' && x in Register;

export const isEventType = (x: any): x is EventType => typeof x === 'string';
export const isNumber = (x: any): x is number => typeof x === 'number';
export const isEventTypeValue = (x: any): x is EvtTypeValue =>
  x.evtType && 'value' in x;

export type Operand = EvtTypeValue | IntegerValue | Register | EvtIndex;
export type Operands = Array<Operand>;

export type ProgramAst = Array<[Instruction, Operands]>;
