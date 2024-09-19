import { DropSchema } from './drop-schema';

describe('(Unit) DropSchema', () => {
  it('should DropSchema a correct sql query text with just a schema', () => {
    // Arrange
    const args: DropSchema.Args = {
      schema: 'testSchemaName',
    };
    // Act
    const result = DropSchema(args);
    // Assert
    expect(result).toMatchObject({
      text: 'DROP SCHEMA "testSchemaName";',
      values: [],
    });
  });

  it('should DropSchema a correct sql query with if exists flag', () => {
    // Arrange
    const args: DropSchema.Args = {
      schema: 'testSchemaName',
      ifExists: true,
    };
    // Act
    const result = DropSchema(args);
    // Assert
    expect(result).toMatchObject({
      text: 'DROP SCHEMA IF EXISTS "testSchemaName";',
      values: [],
    });
  });

  it('should DropSchema a correct sql query with cascade flag', () => {
    // Arrange
    const args: DropSchema.Args = {
      schema: 'testSchemaName',
      cascade: true,
    };
    // Act
    const result = DropSchema(args);
    // Assert
    expect(result).toMatchObject({
      text: 'DROP SCHEMA "testSchemaName" CASCADE;',
      values: [],
    });
  });
});
