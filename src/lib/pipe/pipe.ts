/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Command Result Pipe.
 *
 * A pre-build flow to process a query result into a final value.
 */

export type Pipe<I, R = I, C = undefined> = C extends undefined
  ? (value: I) => R
  : (value: I, ctx: C) => R;

/**
 * A pipe operator that transforms the input value into the output value
 */
export type PipeOperator<I, R = I, C = undefined> = Pipe<I, R, C>;
/**
 * A pre-build flow to process a query result into a final value.
 */
export function pipe<I, R1, C = undefined>(
  fn1: PipeOperator<I, R1, C>,
): Pipe<I, R1, C>;
export function pipe<I, R1, R2, C = undefined>(
  fn1: PipeOperator<I, R1, C>,
  fn2: PipeOperator<R1, R2, C>,
): Pipe<I, R2, C>;
export function pipe<I, R1, R2, R3, C = undefined>(
  fn1: PipeOperator<I, R1, C>,
  fn2: PipeOperator<R1, R2, C>,
  fn3: PipeOperator<R2, R3, C>,
): Pipe<I, R3, C>;
export function pipe<I, R1, R2, R3, R4, C>(
  fn1: PipeOperator<I, R1, C>,
  fn2: PipeOperator<R1, R2, C>,
  fn3: PipeOperator<R2, R3, C>,
  fn4: PipeOperator<R3, R4, C>,
): Pipe<I, R4, C>;
export function pipe<I, R1, R2, R3, R4, R5, C>(
  fn1: PipeOperator<I, R1, C>,
  fn2: PipeOperator<R1, R2, C>,
  fn3: PipeOperator<R2, R3, C>,
  fn4: PipeOperator<R3, R4, C>,
  fn5: PipeOperator<R4, R5, C>,
): Pipe<I, R5, C>;
export function pipe<I, R1, R2, R3, R4, R5, R6, C>(
  fn1: PipeOperator<I, R1, C>,
  fn2: PipeOperator<R1, R2, C>,
  fn3: PipeOperator<R2, R3, C>,
  fn4: PipeOperator<R3, R4, C>,
  fn5: PipeOperator<R4, R5, C>,
  fn6: PipeOperator<R5, R6, C>,
): Pipe<I, R6, C>;
export function pipe<I, R1, R2, R3, R4, R5, R6, R7, C>(
  fn1: PipeOperator<I, R1, C>,
  fn2: PipeOperator<R1, R2, C>,
  fn3: PipeOperator<R2, R3, C>,
  fn4: PipeOperator<R3, R4, C>,
  fn5: PipeOperator<R4, R5, C>,
  fn6: PipeOperator<R5, R6, C>,
  fn7: PipeOperator<R6, R7, C>,
): Pipe<I, R7, C>;
export function pipe<I, R1, R2, R3, R4, R5, R6, R7, R8, C>(
  fn1: PipeOperator<I, R1, C>,
  fn2: PipeOperator<R1, R2, C>,
  fn3: PipeOperator<R2, R3, C>,
  fn4: PipeOperator<R3, R4, C>,
  fn5: PipeOperator<R4, R5, C>,
  fn6: PipeOperator<R5, R6, C>,
  fn7: PipeOperator<R6, R7, C>,
  fn8: PipeOperator<R7, R8, C>,
): Pipe<I, R8, C>;
export function pipe<I, R1, R2, R3, R4, R5, R6, R7, R8, R9, C>(
  fn1: PipeOperator<I, R1, C>,
  fn2: PipeOperator<R1, R2, C>,
  fn3: PipeOperator<R2, R3, C>,
  fn4: PipeOperator<R3, R4, C>,
  fn5: PipeOperator<R4, R5, C>,
  fn6: PipeOperator<R5, R6, C>,
  fn7: PipeOperator<R6, R7, C>,
  fn8: PipeOperator<R7, R8, C>,
  fn9: PipeOperator<R8, R9, C>,
): Pipe<I, R9, C>;
export function pipe<I, R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, C>(
  fn1: PipeOperator<I, R1, C>,
  fn2: PipeOperator<R1, R2, C>,
  fn3: PipeOperator<R2, R3, C>,
  fn4: PipeOperator<R3, R4, C>,
  fn5: PipeOperator<R4, R5, C>,
  fn6: PipeOperator<R5, R6, C>,
  fn7: PipeOperator<R6, R7, C>,
  fn8: PipeOperator<R7, R8, C>,
  fn9: PipeOperator<R8, R9, C>,
  fn10: PipeOperator<R9, R10, C>,
): Pipe<I, R10, C>;
export function pipe<I, R, C = undefined>(
  ...fns: PipeOperator<any, any, C>[]
): Pipe<I, R, C> {
  return ((input: I, ctx: C): R => {
    let value: R = input as unknown as R;

    for (const fn of fns) {
      value = fn(value, ctx);
    }

    return value;
  }) as Pipe<I, R, C>;
}
