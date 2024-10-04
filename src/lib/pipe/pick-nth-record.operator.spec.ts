import type { QueryResultRow } from 'pg';
import { type Pipe, pipe } from './pipe';
import {
  pickFirstRecord,
  pickLastRecord,
  pickNthRecord,
} from './pick-nth-record.operator';

describe('(Unit) pickNthRecord', () => {
  it('should pick the nth record from the beginning', () => {
    // Arrange
    const index = 1;
    const rows = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const flow: Pipe<QueryResultRow[], QueryResultRow> = pipe(
      pickNthRecord<QueryResultRow>(index),
    );
    // Act
    const result = flow(rows);
    // Assert
    expect(result).toEqual({ id: 2 });
  });

  it('should pick the nth record from the end', () => {
    // Arrange
    const index = -2;
    const rows = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const flow: Pipe<QueryResultRow[], QueryResultRow> = pipe(
      pickNthRecord<QueryResultRow>(index),
    );
    // Act
    const result = flow(rows);
    // Assert
    expect(result).toEqual({ id: 2 });
  });

  it('should return undefined if the index is out of bounds', () => {
    // Arrange
    const index = 3;
    const rows = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const flow: Pipe<QueryResultRow[], QueryResultRow | undefined> = pipe(
      pickNthRecord<QueryResultRow>(index),
    );
    // Act
    const result = flow(rows);
    // Assert
    expect(result).toBeUndefined();
  });

  it('should pick the first record', () => {
    // Arrange
    const rows = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const flow: Pipe<QueryResultRow[], QueryResultRow> =
      pipe(pickFirstRecord<QueryResultRow>());
    // Act
    const result = flow(rows);
    // Assert
    expect(result).toEqual({ id: 1 });
  });

  it('should pick the last record', () => {
    // Arrange
    const rows = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const flow: Pipe<QueryResultRow[], QueryResultRow> =
      pipe(pickLastRecord<QueryResultRow>());
    // Act
    const result = flow(rows);
    // Assert
    expect(result).toEqual({ id: 3 });
  });
});
