import test from 'ava';
import { Instruction, parse } from '../../src/space-lang/parser';
import { EventType } from '../../src/actors/ship-components/event-stream';

test('parses basic operation', t => {
  t.deepEqual(
    parse('XEQ SCANNER\nMOVX LASER\nSLP 50\nMOVX LASER'),
    [
      [Instruction.XEQ, [EventType.Scanner]],
      [Instruction.MOVX, [EventType.Laser]],
      [Instruction.SLP, [50]],
      [Instruction.MOVX, [EventType.Laser]],
    ]);
});
