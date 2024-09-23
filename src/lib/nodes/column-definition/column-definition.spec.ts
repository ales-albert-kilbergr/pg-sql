import { defineCreatedAtColumn, defineTextColumn } from '../../model/column';
import { SqlTagParserContext } from '../../parser-context';
import { ColumnDefinition } from './column-definition';

describe('(Unit) ColumnDefinition', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let context: SqlTagParserContext;

  beforeEach(() => {
    context = new SqlTagParserContext();
  });

  it('should add column name to context', () => {
    // Arrange
    const column = defineTextColumn('id');

    // Act
    ColumnDefinition(column)(context);
    // Assert
    expect(context.toSqlText()).toBe('"id" TEXT NOT NULL');
  });

  it('should add a column with default value to context', () => {
    // Arrange
    const column = defineCreatedAtColumn();

    // Act
    ColumnDefinition(column)(context);

    // Assert
    expect(context.toSqlText()).toBe(
      '"created_at" TIMESTAMPZ NOT NULL DEFAULT CURRENT_TIMESTAMP',
    );
  });
});
