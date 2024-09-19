import { DropTable } from './drop-table';

describe('(Unit) DropTable', () => {
  it('should build a correct sql query text with just a table and schema', () => {
    // Arrange
    const args: DropTable.Args = {
      table: 'testTableName',
      schema: 'testSchemaName',
    };
    // Act
    const result = DropTable(args);
    // Assert
    expect(result).toMatchObject({
      text: 'DROP TABLE "testSchemaName"."testTableName";',
      values: [],
    });
  });

  it('should build a correct sql query with if exists flag', () => {
    // Arrange
    const args: DropTable.Args = {
      table: 'testTableName',
      schema: 'testSchemaName',
      ifExists: true,
    };
    // Act
    const result = DropTable(args);
    // Assert
    expect(result).toMatchObject({
      text: 'DROP TABLE IF EXISTS "testSchemaName"."testTableName";',
      values: [],
    });
  });

  it('should build a correct sql query with cascade flag', () => {
    // Arrange
    const args: DropTable.Args = {
      table: 'testTableName',
      schema: 'testSchemaName',
      cascade: true,
    };
    // Act
    const result = DropTable(args);
    // Assert
    expect(result).toMatchObject({
      text: 'DROP TABLE "testSchemaName"."testTableName" CASCADE;',
      values: [],
    });
  });
});
