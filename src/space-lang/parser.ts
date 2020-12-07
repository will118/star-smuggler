import { EventType, EventTypeLookup } from '../actors/ship-components/event-stream';

export enum Instruction {
  XEQ = 'XEQ',
  MOVX = 'MOVX',
  SLP = 'SLP',
  ADD = 'ADD',
  SUB = 'SUB',
  RLT = 'RLT',
  RGT = 'RGT',
}

enum Register {
  R1,
  R2,
  DATA,
}

type Operands = Array<EventType | number | Register>;

export type ProgramAst = Array<[Instruction, Operands]>;

const isAlpha = (c: string) => {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
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
            if (isDigit(c)) {
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
                ops.push(eventType);
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
