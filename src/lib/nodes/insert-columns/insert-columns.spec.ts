import { sql } from '../../sql';
import { InsertColumns } from './insert-columns';

describe('(Unit) Insert Columns', () => {
  it('should append column names into insert statement', () => {
    // Arrange
    const columns = ['id', 'name'];
    // Act
    const queryConfig = sql`INSERT INTO users ${InsertColumns(columns)}`;
    // Assert
    expect(queryConfig.text).toBe('INSERT INTO users ("id", "name")');
  });

  it('should append column names into insert statement with custom transform', () => {
    // Arrange
    const columns = ['id', 'name'];
    // Act
    const queryConfig = sql`INSERT INTO users ${InsertColumns(columns, {
      transformKey: (key) => key.toUpperCase(),
    })}`;
    // Assert
    expect(queryConfig.text).toBe('INSERT INTO users ("ID", "NAME")');
  });
});
