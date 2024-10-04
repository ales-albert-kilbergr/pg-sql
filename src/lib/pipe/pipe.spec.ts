/* eslint-disable @typescript-eslint/no-magic-numbers */
import { pipe } from './pipe';

describe('(Unit) pipe', () => {
  it('should run chained operators', () => {
    // Arrange
    const input = '1,2,3,4,5';
    const expected = [1, 2, 3, 4, 5];
    const flow = pipe(
      (value: string) => value.split(','),
      (value: string[]) => value.map(Number),
    );
    // Act
    const result = flow(input);
    // Assert
    expect(result).toEqual(expected);
  });

  it('should derive the type from the last operator', () => {
    // Arrange
    const input = '1,2,3,4,5';
    const expected = [1, 2, 3, 4, 5];
    const flow = pipe(
      (value: string) => value.split(','),
      (value: string[]) => value.map(Number),
    );
    // Act
    // Should not fail type check
    const result: number[] = flow(input);
    // Assert
    expect(result).toEqual(expected);
  });

  it('should derive the context type from the first operator', () => {
    // Arrange
    const input = '1,2,3,4,5';
    const expected = [2, 3, 4, 5, 6];
    interface Ctx {
      add: number;
      separator: string;
    }

    const flow = pipe(
      (value: string, ctx: Ctx) => value.split(ctx.separator),
      // Determine the context type from the first operator
      (value: string[], ctx) => value.map(Number).map((v) => v + ctx.add),
    );
    // Act
    const result = flow(input, { separator: ',', add: 1 });
    // Assert
    expect(result).toEqual(expected);
  });

  it('should combine multiple pipes', () => {
    // Arrange
    const input = '1,2,3,4,5';
    const expected = [1, 3, 5, 7, 9];

    const flow = pipe(
      (value: string) => value.split(','),
      (value: string[]) => value.map(Number),
      pipe(
        (value: number[]) => value.map((v) => v * 2),
        (value: number[]) => value.map((v) => v - 1),
      ),
    );
    // Act
    const result = flow(input);
    // Assert
    expect(result).toEqual(expected);
  });

  it('should manage two pipes inside the pipe', () => {
    // Arrange
    const input = '1,2,3,4,5';
    const expected = [1, 3, 5, 7, 9];

    const flow = pipe(
      pipe(
        (value: string) => value.split(','),
        (value: string[]) => value.map(Number),
      ),
      pipe(
        (value: number[]) => value.map((v) => v * 2),
        (value: number[]) => value.map((v) => v - 1),
      ),
    );
    // Act
    const result = flow(input);
    // Assert
    expect(result).toEqual(expected);
  });
});
