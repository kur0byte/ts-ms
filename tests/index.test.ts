import {sum} from '../src/index';

test('sum function should return the correct sum', () => {
  expect(sum(1, 2)).toBe(3);
  expect(sum(0, 0)).toBe(0);
  expect(sum(-1, 1)).toBe(0);
  expect(sum(10, -5)).toBe(5);
});
