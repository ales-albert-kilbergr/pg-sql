/* eslint-disable @typescript-eslint/init-declarations */
import { formatSqlText } from '../helpers';
import {
  Database,
  Identifier,
  ReferentialActionDiscriminant,
  type Table,
} from '../model';
import { renderTableForeignKey } from './table-foreign-key.renderer';

describe('(Unit) renderTableForeignKey', () => {
  let database: Database;
  let table: Table;

  beforeEach(() => {
    database = new Database(Identifier('database_name'));
    table = database.getDefaultSchema().defineTable(Identifier('table_name'));
  });

  it('should create a foreign key constraint with one column', () => {
    // Arrange
    const constraint = table.defineForeignKey(Identifier('constraint_name'), {
      columns: [Identifier('column_one')],
      refColumns: [Identifier('column_reference')],
      refTable: Identifier('table_reference'),
    });
    // Act
    const result = formatSqlText(
      renderTableForeignKey(constraint),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(result).toBe(
      'CONSTRAINT "constraint_name" FOREIGN KEY ("column_one") ' +
        'REFERENCES "table_reference" ("column_reference")',
    );
  });

  it('should create a foreign key constraint with multiple columns', () => {
    // Arrange
    const constraint = table.defineForeignKey(Identifier('constraint_name'), {
      columns: [Identifier('column_one'), Identifier('column_two')],
      refColumns: [
        Identifier('column_reference_one'),
        Identifier('column_reference_two'),
      ],
      refTable: Identifier('table_reference'),
    });
    // Act
    const result = formatSqlText(
      renderTableForeignKey(constraint),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(result).toBe(
      'CONSTRAINT "constraint_name" FOREIGN KEY ("column_one", "column_two") ' +
        'REFERENCES "table_reference" ("column_reference_one", "column_reference_two")',
    );
  });

  it('should create a foreign key with on delete action', () => {
    // Arrange
    const constraint = table.defineForeignKey(Identifier('constraint_name'), {
      columns: [Identifier('column_one')],
      refColumns: [Identifier('column_reference')],
      refTable: Identifier('table_reference'),
      onDelete: {
        type: ReferentialActionDiscriminant.CASCADE,
      },
    });
    // Act
    const result = formatSqlText(
      renderTableForeignKey(constraint),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(result).toBe(
      'CONSTRAINT "constraint_name" FOREIGN KEY ("column_one") ' +
        'REFERENCES "table_reference" ("column_reference") ON DELETE CASCADE',
    );
  });

  it('should create a foreign key with on update action', () => {
    // Arrange
    const constraint = table.defineForeignKey(Identifier('constraint_name'), {
      columns: [Identifier('column_one')],
      refColumns: [Identifier('column_reference')],
      refTable: Identifier('table_reference'),
      onUpdate: {
        type: ReferentialActionDiscriminant.CASCADE,
      },
    });
    // Act
    const result = formatSqlText(
      renderTableForeignKey(constraint),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(result).toBe(
      'CONSTRAINT "constraint_name" FOREIGN KEY ("column_one") ' +
        'REFERENCES "table_reference" ("column_reference") ON UPDATE CASCADE',
    );
  });

  it('should create a foreign key with on delete and on update actions', () => {
    // Arrange
    const constraint = table.defineForeignKey(Identifier('constraint_name'), {
      columns: [Identifier('column_one')],
      refColumns: [Identifier('column_reference')],
      refTable: Identifier('table_reference'),
      onDelete: {
        type: ReferentialActionDiscriminant.CASCADE,
      },
      onUpdate: {
        type: ReferentialActionDiscriminant.CASCADE,
      },
    });
    // Act
    const result = formatSqlText(
      renderTableForeignKey(constraint),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(result).toBe(
      'CONSTRAINT "constraint_name" FOREIGN KEY ("column_one") ' +
        'REFERENCES "table_reference" ("column_reference") ON DELETE CASCADE ON UPDATE CASCADE',
    );
  });

  it('should create a foreign key with match full option', () => {
    // Arrange
    const constraint = table.defineForeignKey(Identifier('constraint_name'), {
      columns: [Identifier('column_one')],
      refColumns: [Identifier('column_reference')],
      refTable: Identifier('table_reference'),
      matchType: 'FULL',
    });
    // Act
    const result = formatSqlText(
      renderTableForeignKey(constraint),
      formatSqlText.REMOVE_ALL_OPTIONS,
    );

    // Assert
    expect(result).toBe(
      'CONSTRAINT "constraint_name" FOREIGN KEY ("column_one") ' +
        'REFERENCES "table_reference" ("column_reference") MATCH FULL',
    );
  });

  it('should return an empty string if the constraint is not defined', () => {
    // Arrange
    const constraint = undefined;
    // Act
    const result = renderTableForeignKey(constraint);
    // Assert
    expect(result).toBe('');
  });
});
