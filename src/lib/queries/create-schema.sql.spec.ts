import { CreateSchema } from './create-schema.sql';

describe('(Unit) CreateSchema', () => {
  it('should build a correct sql query text with just a schema', () => {
    // Arrange
    const args: CreateSchema.Args = {
      schema: 'testSchemaName',
    };
    // Act
    const result = CreateSchema(args);
    // Assert
    expect(result).toMatchObject({
      text: 'CREATE SCHEMA "testSchemaName";',
      values: [],
    });
  });

  it('should build a correct sql query with if not exists flag', () => {
    // Arrange
    const args: CreateSchema.Args = {
      schema: 'testSchemaName',
      ifNotExists: true,
    };
    // Act
    const result = CreateSchema(args);
    // Assert
    expect(result).toMatchObject({
      text: 'CREATE SCHEMA IF NOT EXISTS "testSchemaName";',
      values: [],
    });
  });

  it('should build a correct sql query with authorization', () => {
    // Arrange
    const args: CreateSchema.Args = {
      schema: 'testSchemaName',
      authorization: 'testRole',
    };
    // Act
    const result = CreateSchema(args);
    // Assert
    expect(result).toMatchObject({
      text: 'CREATE SCHEMA "testSchemaName" AUTHORIZATION "testRole";',
      values: [],
    });
  });
});
