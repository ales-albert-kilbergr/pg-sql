import { SchemaExists } from './schema-exists.sql';

describe('(Unit) SchemaExists', () => {
  it('should build a correct sql query text with just a schema', () => {
    // Arrange
    const args: SchemaExists.Args = {
      schema: 'testSchemaName',
    };
    // Act
    const result = SchemaExists(args);
    // Assert
    expect(result).toMatchObject({
      text:
        'SELECT EXISTS (SELECT 1 FROM information_schema.schemata ' +
        'WHERE schema_name = $1' +
        ') as "exists";',
      values: ['testSchemaName'],
    });
  });
});
