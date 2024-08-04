/* eslint-disable @typescript-eslint/no-magic-numbers */
import { sql } from '../../sql';
import { InsertValues } from './insert-values';

describe('(Unit) Insert Values', () => {
  it('should convert an object into insert values in sql', () => {
    // Arrange
    const data = { id: 1, name: 'test' };
    // Act
    const queryConfig = sql`INSERT INTO users ${InsertValues(data)}`;
    // Assert
    expect(queryConfig.text).toBe(
      'INSERT INTO users VALUES ("id" = $1, "name" = $2)',
    );
    expect(queryConfig.values).toEqual([1, 'test']);
  });

  it('should convert an array of objects into insert values in sql', () => {
    // Arrange
    const data = [
      { id: 1, name: 'test' },
      { id: 2, name: 'test2' },
    ];
    // Act
    const queryConfig = sql`INSERT INTO users ${InsertValues(data)}`;
    // Assert
    expect(queryConfig.text).toBe(
      'INSERT INTO users VALUES ("id" = $1, "name" = $2), ("id" = $3, "name" = $4)',
    );
    expect(queryConfig.values).toEqual([1, 'test', 2, 'test2']);
  });

  it('should convert an array of objects into insert values in sql with custom columns', () => {
    // Arrange
    const data = [
      { id: 1, name: 'test' },
      { id: 2, name: 'test2' },
    ];
    // Act
    const queryConfig = sql`INSERT INTO users ${InsertValues(data, {
      columns: ['name'],
    })}`;
    // Assert
    expect(queryConfig.text).toBe(
      'INSERT INTO users VALUES ("name" = $1), ("name" = $2)',
    );
    expect(queryConfig.values).toEqual(['test', 'test2']);
  });

  it('should insert DEFAULT if value is undefined', () => {
    // Arrange
    const data = { id: 1, name: undefined };
    // Act
    const queryConfig = sql`INSERT INTO users ${InsertValues(data)}`;
    // Assert
    expect(queryConfig.text).toBe(
      'INSERT INTO users VALUES ("id" = $1, "name" = DEFAULT)',
    );
    expect(queryConfig.values).toEqual([1]);
  });

  it('should insert DEFAULT if value is missing', () => {
    // Arrange
    const data = { id: 1 };
    // Act
    const queryConfig = sql`INSERT INTO users ${InsertValues(data, { columns: ['id', 'name'] })}`;
    // Assert
    expect(queryConfig.text).toBe(
      'INSERT INTO users VALUES ("id" = $1, "name" = DEFAULT)',
    );
    expect(queryConfig.values).toEqual([1]);
  });
});
