import { ColumnList, defineTextColumn } from '../../model/column';
import { SqlTagParserContext } from '../../parser-context';
import { TableColumnDefinition } from './table-column-definition';

describe('(Unit) TableColumnDefinition', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let context: SqlTagParserContext;

  beforeEach(() => {
    context = new SqlTagParserContext();
  });

  it('should add column name to context', () => {
    // Arrange
    const columnList = new ColumnList([
      defineTextColumn('id'),
      defineTextColumn('name'),
    ]);

    // Act
    TableColumnDefinition(columnList)(context);
    // Assert
    expect(context.toSqlText()).toBe(
      '"id" TEXT NOT NULL , "name" TEXT NOT NULL',
    );
  });
});
