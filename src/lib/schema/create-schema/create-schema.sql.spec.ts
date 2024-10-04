import { getCreateSchemaSql } from './create-schema.sql';

describe('(Unit) getCreateSchemaSql', () => {
  it('should return CREATE SCHEMA statement with schema name', () => {
    // Arrange
    const command = {
      schema: {
        name: 'my_schema',
      },
      ifNotExists: false,
    };

    // Act
    const result = getCreateSchemaSql(command);

    // Assert
    expect(result).toBe('CREATE SCHEMA "my_schema";');
  });

  it('should return CREATE SCHEMA statement with IF NOT EXISTS clause', () => {
    // Arrange
    const command = {
      schema: {
        name: 'my_schema',
      },
      ifNotExists: true,
    };

    // Act
    const result = getCreateSchemaSql(command);

    // Assert
    expect(result).toBe('CREATE SCHEMA IF NOT EXISTS "my_schema";');
  });

  it('should return CREATE SCHEMA statement with AUTHORIZATION clause', () => {
    // Arrange
    const command = {
      schema: {
        name: 'my_schema',
      },
      ifNotExists: false,
      authorization: 'my_role',
    };

    // Act
    const result = getCreateSchemaSql(command);

    // Assert
    expect(result).toBe('CREATE SCHEMA AUTHORIZATION "my_role" "my_schema";');
  });

  it('should return CREATE SCHEMA statement with IF NOT EXISTS and AUTHORIZATION clauses', () => {
    // Arrange
    const command = {
      schema: {
        name: 'my_schema',
      },
      ifNotExists: true,
      authorization: 'my_role',
    };

    // Act
    const result = getCreateSchemaSql(command);

    // Assert
    expect(result).toBe(
      'CREATE SCHEMA IF NOT EXISTS AUTHORIZATION "my_role" "my_schema";',
    );
  });
});
