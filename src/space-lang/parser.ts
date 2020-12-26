import { ProgramAst, Operands, Instruction, Register } from './types';

const isAlpha = (c: string) => {
  return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c == '_';
}

const isDigit = (c: string) => {
  return c >= '0' && c <= '9';
}

export const parse = (text: string): ProgramAst => {
  text = text.toUpperCase();
  const program: ProgramAst = [];

  let start = 0;
  let current = 0;

  const peek = () => text[current];
  const peekN = (n: number) => text.slice(current, current + n);
  const advance = () => text[current++];
  const isEOF = () => current >= text.length;

  const instruction = () => {
    while (!isEOF() && peek() !== ' ') {
      advance();
    }

    const name = text.slice(start, current);

    advance();

    start = current;

    const inst = Instruction[name as keyof typeof Instruction] || null;

    if (inst === null) {
      throw new Error('Unsupported instruction: ' + name);
    }

    const operands = () => {
      const ops: Operands = [];

      while (!isEOF()) {
        const c = advance();
        switch (c) {
          case '\n':
            return ops;
          case ' ':
            break;
          default:
            if (c + peekN(3) === 'EVT[') {
              current += 3;
              start = current;
              while (isDigit(peek())) {
                advance();
              }
              if (advance() !== ']') {
                throw new Error('Failed to parse EVT index: '+ peek());
              }
              ops.push({
                evt: true,
                index: parseInt(text.slice(start, current), 10)
              });
            } else if (c === 'R') {
              while (isDigit(peek())) {
                advance();
              }
              const regName = text.slice(start, current);
              const reg = Register[regName as keyof typeof Register] || null;
              if (reg === null) {
                throw new Error('Invalid register');
              }
              ops.push(reg);
            } else if (isDigit(c) || c === '-') {
              while (isDigit(peek())) {
                advance();
              }
              ops.push({
                integer: true,
                value: parseInt(text.slice(start, current), 10)
              });
            } else if (isAlpha(peek())) {
              while (isAlpha(peek())) {
                advance();
              }
              ops.push({
                evtType: true,
                value: text.slice(start, current)
              });
            }
        }
        start = current;
      }
      return ops;
    };

    program.push([inst, operands()]);
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
