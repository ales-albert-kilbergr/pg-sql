/* eslint-disable @typescript-eslint/init-declarations */
import { formatSqlText } from '../helpers';
import { Database, Identifier, type Table } from '../model';
import { renderTableUniqueKey } from './table-unique-key.renderer';

describe('(Unit) renderTableUniqueConstraint', () => {
  let database: Database;
  let table: Table;

  beforeEach(() => {
    database = new Database(Identifier('database_name'));
    table = database.getDefaultSchema().defineTable(Identifier('table_name'));
  });

  it('should create a unique constraint with one column', () => {
    // Arrange
    const constraint = table.defineUniqueConstraint(
      Identifier('constraint_name'),
      {
        columns: [Identifier('column_one')],
      },
    );
    // Act
    const result = formatSqlText(
      renderTableUniqueKey(constraint),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(result).toBe('CONSTRAINT "constraint_name" UNIQUE ("column_one")');
  });

  it('should create a unique constraint with multiple columns', () => {
    // Arrange
    const constraint = table.defineUniqueConstraint(
      Identifier('constraint_name'),
      {
        columns: [Identifier('column_one'), Identifier('column_two')],
      },
    );
    // Act
    const result = formatSqlText(
      renderTableUniqueKey(constraint),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(result).toBe(
      'CONSTRAINT "constraint_name" UNIQUE ("column_one", "column_two")',
    );
  });

  it('should create a unique constraint with a deferrable constraint', () => {
    // Arrange
    const constraint = table.defineUniqueConstraint(
      Identifier('constraint_name'),
      {
        columns: [Identifier('column_one')],
        deferrable: true,
      },
    );
    // Act
    const result = formatSqlText(
      renderTableUniqueKey(constraint),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(result).toBe(
      'CONSTRAINT "constraint_name" UNIQUE ("column_one") DEFERRABLE',
    );
  });

  it('should create a unique constraint with a index params INCLUDE', () => {
    // Arrange
    const constraint = table.defineUniqueConstraint(
      Identifier('constraint_name'),
      {
        columns: [Identifier('column_one')],
        include: [Identifier('column_two')],
      },
    );
    // Act
    const result = formatSqlText(
      renderTableUniqueKey(constraint),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(result).toBe(
      'CONSTRAINT "constraint_name" UNIQUE ("column_one") INCLUDE ("column_two")',
    );
  });

  it('should create a unique constraint with a index params WITH', () => {
    // Arrange
    const constraint = table.defineUniqueConstraint(
      Identifier('constraint_name'),
      {
        columns: [Identifier('column_one')],
        with: ['index_parameters'],
      },
    );
    // Act
    const result = formatSqlText(
      renderTableUniqueKey(constraint),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(result).toBe(
      'CONSTRAINT "constraint_name" UNIQUE ("column_one") WITH (index_parameters)',
    );
  });

  it('should create a unique constraint with a index params USING INDEX TABLESPACE', () => {
    // Arrange
    const constraint = table.defineUniqueConstraint(
      Identifier('constraint_name'),
      {
        columns: [Identifier('column_one')],
        usingIndexTablespace: Identifier('tablespace'),
      },
    );
    // Act
    const result = formatSqlText(
      renderTableUniqueKey(constraint),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(result).toBe(
      'CONSTRAINT "constraint_name" UNIQUE ("column_one") USING INDEX TABLESPACE "tablespace"',
    );
  });
});
