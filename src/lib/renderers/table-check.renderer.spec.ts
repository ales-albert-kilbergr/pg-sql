/* eslint-disable @typescript-eslint/init-declarations */
import { formatSqlText } from '../helpers';
import { Database, type Table, Identifier } from '../model';
import { renderTableCheck } from './table-check.renderer';

describe('(Unit) renderTableCheckConstraint', () => {
  let database: Database;
  let table: Table;

  beforeEach(() => {
    database = new Database(Identifier('database_name'));
    table = database.getDefaultSchema().defineTable(Identifier('table_name'));
  });

  it('should create a check constraint with a simple expression', () => {
    // Arrange
    const constraint = table.defineCheckConstraint(
      Identifier('constraint_name'),
      {
        expression: 'column_one > 0',
      },
    );
    // Act
    const result = formatSqlText(
      renderTableCheck(constraint),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(result).toBe('CONSTRAINT "constraint_name" CHECK (column_one > 0)');
  });

  it('should create a check constraint with a complex expression', () => {
    // Arrange
    const constraint = table.defineCheckConstraint(
      Identifier('constraint_name'),
      {
        expression: 'column_one > 0 AND column_two < 100',
      },
    );
    // Act
    const result = formatSqlText(
      renderTableCheck(constraint),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(result).toBe(
      'CONSTRAINT "constraint_name" CHECK (column_one > 0 AND column_two < 100)',
    );
  });

  it('should create a check constraint with a NO INHERIT option', () => {
    // Arrange
    const constraint = table.defineCheckConstraint(
      Identifier('constraint_name'),
      {
        expression: 'column_one > 0',
        noInherit: true,
      },
    );
    // Act
    const result = formatSqlText(
      renderTableCheck(constraint),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(result).toBe(
      'CONSTRAINT "constraint_name" CHECK (column_one > 0) NO INHERIT',
    );
  });

  it('should return an empty string if the constraint is not defined', () => {
    // Arrange
    const constraint = undefined;
    // Act
    const result = formatSqlText(
      renderTableCheck(constraint),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(result).toBe('');
  });
});
