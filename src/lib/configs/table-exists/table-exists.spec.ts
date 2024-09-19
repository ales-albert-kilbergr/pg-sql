import { TableExists } from './table-exists';

describe('(Unit) TableExists', () => {
  it('should build a correct sql query text with just a schema and table', () => {
    // Arrange
    const args: TableExists.Args = {
      schema: 'testSchemaName',
      table: 'testTableName',
    };
    // Act
    const result = TableExists(args);
    // Assert
    expect(result).toMatchObject({
      text:
        'SELECT EXISTS (SELECT 1 FROM information_schema.tables ' +
        'WHERE table_schema = $1 AND table_name = $2' +
        ') as "exists";',
      values: ['testSchemaName', 'testTableName'],
    });
  });
});
