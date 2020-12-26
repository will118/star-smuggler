import test from 'ava';
import { Register, Instruction, parse } from '../../src/space-lang/parser';
// import { EventType } from '../../src/actors/ship-components/event-stream';

// test('parses basic operation', t => {
  // t.deepEqual(
    // parse('EVTT SCANNER\nMOVX LASER\nSLP 50\nMOVX LASER'),
    // [
      // [Instruction.EVTT, [EventType.Scanner]],
      // [Instruction.MOVX, [EventType.Laser]],
      // [Instruction.SLP, [50]],
      // [Instruction.MOVX, [EventType.Laser]],
    // ]);
// });

// test('parses event with underscore', t => {
  // t.deepEqual(
    // parse('XEQ SHIELD_HIT'),
    // [
      // [Instruction.XEQ, [EventType.ShieldHit]],
    // ]);
// });

test('parses sub/add', t => {
  t.deepEqual(
    parse('SUB EVT[0] 10\nADD R1 10\nADD R2 EVT[1]'),
    [
      [Instruction.SUB, [[Register.EVT, 0], 10]],
      [Instruction.ADD, [[Register.R1], 10]],
      [Instruction.ADD, [[Register.R2], [Register.EVT, 1]]],
    ]);
});

test('parses RNE', t => {
  t.deepEqual(
    parse('RNE 1 400'),
    [
      [Instruction.RNE, [1, 400]],
    ]);
});

// test('parses negative RLT', t => {
  // t.deepEqual(
    // parse('RLT 1 -400'),
    // [
      // [Instruction.RLT, [1, -400]],
    // ]);
// });
