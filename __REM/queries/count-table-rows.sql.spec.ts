import {
  type CountTableRowArgs,
  CountTableRowSql,
} from './count-table-rows.sql';

describe('(Unit) CountTableRows', () => {
  it('should build a correct sql query text with just a table name', () => {
    // Arrange
    const args: CountTableRowArgs = {
      table: 'testTableName',
      schema: 'testSchemaName',
    };
    // Act
    const result = CountTableRowSql(args);
    // Assert
    expect(result).toMatchObject({
      text: 'SELECT COUNT(1) FROM "testSchemaName"."testTableName";',
      values: [],
    });
  });

  it('should build a correct sql query with a schema and table name', () => {
    // Arrange
    const args: CountTableRowArgs = {
      schema: 'testSchemaName',
      table: 'testTableName',
    };
    // Act
    const result = CountTableRowSql(args);
    // Assert
    expect(result).toMatchObject({
      text: 'SELECT COUNT(1) FROM "testSchemaName"."testTableName";',
      values: [],
    });
  });
});
