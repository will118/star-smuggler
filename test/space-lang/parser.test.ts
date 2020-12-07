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

test('parses sub/add', t => {
  t.deepEqual(
    parse('SUB 0 10\nADD 2 10'),
    [
      [Instruction.SUB, [0, 10]],
      [Instruction.ADD, [2, 10]],
    ]);
});

test('parses RLT', t => {
  t.deepEqual(
    parse('RLT 1 400'),
    [
      [Instruction.RLT, [1, 400]],
    ]);
});
