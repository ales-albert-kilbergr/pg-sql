/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { QueryResultRow } from 'pg';
import { columnToArray } from './column-to-array.operator';
import { type Pipe, pipe } from './pipe';

describe('(Unit) columnToArray', () => {
  it('should pick a column from a row and return an array of its value', () => {
    // Arrange
    const rows = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const expected = [1, 2, 3];
    const flow: Pipe<QueryResultRow[], number[]> = pipe(
      columnToArray<number>('id'),
    );
    // Act
    const result = flow(rows);
    // Assert
    expect(result).toEqual(expected);
  });

  it('should return an empty array if there are no rows', () => {
    // Arrange
    const rows: QueryResultRow[] = [];
    const flow: Pipe<QueryResultRow[], number[]> = pipe(
      columnToArray<number>('id'),
    );
    // Act
    const result = flow(rows);
    // Assert
    expect(result).toEqual([]);
  });
});
