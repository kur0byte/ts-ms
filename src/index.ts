import * as dotenv from 'dotenv';
dotenv.config();
// write a test  sum function
/**
 * @description sum two numbers
 */
export function sum(a: number, b: number): number {
  return a + b;
}

console.log(sum(1, 2) === 3);
