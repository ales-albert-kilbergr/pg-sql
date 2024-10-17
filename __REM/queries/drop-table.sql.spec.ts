import { DropTableSql, type DropTableArgs } from './drop-table.sql';

describe('(Unit) DropTable', () => {
  it('should build a correct sql query text with just a table and schema', () => {
    // Arrange
    const args: DropTableArgs = {
      table: 'testTableName',
      schema: 'testSchemaName',
    };
    // Act
    const result = DropTableSql(args);
    // Assert
    expect(result).toMatchObject({
      text: 'DROP TABLE "testSchemaName"."testTableName";',
      values: [],
    });
  });

  it('should build a correct sql query with if exists flag', () => {
    // Arrange
    const args: DropTableArgs = {
      table: 'testTableName',
      schema: 'testSchemaName',
      ifExists: true,
    };
    // Act
    const result = DropTableSql(args);
    // Assert
    expect(result).toMatchObject({
      text: 'DROP TABLE IF EXISTS "testSchemaName"."testTableName";',
      values: [],
    });
  });

  it('should build a correct sql query with cascade flag', () => {
    // Arrange
    const args: DropTableArgs = {
      table: 'testTableName',
      schema: 'testSchemaName',
      cascade: true,
    };
    // Act
    const result = DropTableSql(args);
    // Assert
    expect(result).toMatchObject({
      text: 'DROP TABLE "testSchemaName"."testTableName" CASCADE;',
      values: [],
    });
  });
});
