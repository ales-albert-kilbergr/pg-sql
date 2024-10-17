import { DropSchemaSql, type DropSchemaArgs } from './drop-schema.sql';

describe('(Unit) DropSchema', () => {
  it('should DropSchema a correct sql query text with just a schema', () => {
    // Arrange
    const args: DropSchemaArgs = {
      schema: 'testSchemaName',
    };
    // Act
    const result = DropSchemaSql(args);
    // Assert
    expect(result).toMatchObject({
      text: 'DROP SCHEMA "testSchemaName";',
      values: [],
    });
  });

  it('should DropSchema a correct sql query with if exists flag', () => {
    // Arrange
    const args: DropSchemaArgs = {
      schema: 'testSchemaName',
      ifExists: true,
    };
    // Act
    const result = DropSchemaSql(args);
    // Assert
    expect(result).toMatchObject({
      text: 'DROP SCHEMA IF EXISTS "testSchemaName";',
      values: [],
    });
  });

  it('should DropSchema a correct sql query with cascade flag', () => {
    // Arrange
    const args: DropSchemaArgs = {
      schema: 'testSchemaName',
      cascade: true,
    };
    // Act
    const result = DropSchemaSql(args);
    // Assert
    expect(result).toMatchObject({
      text: 'DROP SCHEMA "testSchemaName" CASCADE;',
      values: [],
    });
  });
});
