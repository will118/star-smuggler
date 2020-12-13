import { EventType } from '../actors/ship-components/event-stream';

export enum Instruction {
  XEQ = 'XEQ',
  MOVX = 'MOVX',
  SLP = 'SLP',
  ADD = 'ADD',
  SUB = 'SUB',
  RLT = 'RLT',
  RGT = 'RGT',
  SET = 'SET',
}

enum ReadWrite {
  Read = 'Read',
  Write = 'Write',
  ReadWrite = 'Read/Write'
}

type OperandDocs = {
  help: string;
  args: Array<string>;
  io: ReadWrite
}

export const EventTypeLookup: { [key: string]: { type: EventType } & OperandDocs } = {
  SCANNER: {
    type: EventType.Scanner,
    args: ['X', 'Y', 'T'],
    help: 'Bogey detected. T: 0 = Asteroid, 1 = Laser',
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
  example: string
}

export const InstructionDocs: { [key in Instruction]: Documentation } = {
  XEQ: {
    help: 'tests the event type, continues if matching',
    example: 'XEQ SHIELD_HIT'
  },
  MOVX: {
    help: 'posts an event to the bus with the DATA register as payload',
    example: 'MOVX LASER'
  },
  SLP: {
    help: 'sleeps for N ms',
    example: 'SLP 500'
  },
  ADD: {
    help: 'adds a value to a specified index of the DATA register',
    example: 'ADD 0 500',
  },
  SUB: {
    help: 'subtracts a value from a specified index of the DATA register',
    example: 'SUB 0 500',
  },
  SET: {
    help: 'sets the value of a specified index of the DATA register',
    example: 'SET 1 225',
  },
  RLT: {
    help: 'returns if value at index is less than supplied value',
    example: 'RLT 1 540',
  },
  RGT: {
    help: 'returns if value at index is greater than supplied value',
    example: 'RGT 1 100',
  }
};

enum Register {
  R1,
  R2,
  DATA,
}

type Operands = Array<EventType | number | Register>;

export type ProgramAst = Array<[Instruction, Operands]>;

const isAlpha = (c: string) => {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_';
}

const isDigit = (c: string) => {
  return c >= '0' && c <= '9';
}

export const parse = (text: string): ProgramAst => {
  const program: ProgramAst = [];

  let start = 0;
  let current = 0;

  const peek = () => text[current];
  const advance = () => text[current++];
  const isEOF = () => current >= text.length;

  const instruction = () => {
    while (!isEOF() && peek() !== ' ') {
      advance();
    }

    const name = text.slice(start, current);

    advance();

    start = current;

    let inst: Instruction | null = null;

    switch (name) {
      case Instruction.XEQ:
      case Instruction.MOVX:
      case Instruction.SLP:
      case Instruction.SUB:
      case Instruction.ADD:
      case Instruction.RLT:
      case Instruction.RGT:
      case Instruction.SET:
        inst = name;
        break;
      default:
        throw new Error('Unsupported instruction: ' + name);
    }

    const operands = () => {
      const ops: Operands = [];

      while (!isEOF()) {
        const c = advance();
        switch (c) {
          case '\n':
            return ops;
          default:
            if (isDigit(c) || c === '-') {
              while (isDigit(peek())) {
                advance();
              }
              ops.push(parseInt(text.slice(start, current), 10));
            } else if (isAlpha(peek())) {
              while (isAlpha(peek())) {
                advance();
              }
              const eventName = text.slice(start, current);
              const eventType = EventTypeLookup[eventName];
              if (eventType !== undefined) {
                ops.push(eventType.type);
              } else {
                throw new Error('Unsupported event type: ' + eventName);
              }
            }
        }
        start = current;
      }
      return ops;
    };

    program.push([inst!, operands()]);
  };


  while (!isEOF()) {
    const c = advance();
    switch (c) {
      case '\n':
        break;
      default:
        if (isAlpha(c)) {
          instruction();
        }
        break;
    }
    start = current;
  }

  return program;
}
