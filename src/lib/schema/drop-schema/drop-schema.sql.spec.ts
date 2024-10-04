import { getDropSchemaSql } from './drop-schema.sql';

describe('(Unit) getDropSchemaSql', () => {
  it('should return DROP SCHEMA "test"', () => {
    // Arrange
    const command = {
      schema: { name: 'test' },
      ifExists: false,
      cascade: false,
    };

    // Act
    const result = getDropSchemaSql(command);

    // Assert
    expect(result).toBe('DROP SCHEMA "test" RESTRICT;');
  });

  it('should return DROP SCHEMA IF EXISTS "test"', () => {
    // Arrange
    const command = {
      schema: { name: 'test' },
      ifExists: true,
      cascade: false,
    };

    // Act
    const result = getDropSchemaSql(command);

    // Assert
    expect(result).toBe('DROP SCHEMA IF EXISTS "test" RESTRICT;');
  });

  it('should return DROP SCHEMA "test" CASCADE', () => {
    // Arrange
    const command = {
      schema: { name: 'test' },
      ifExists: false,
      cascade: true,
    };

    // Act
    const result = getDropSchemaSql(command);

    // Assert
    expect(result).toBe('DROP SCHEMA "test" CASCADE;');
  });

  it('should return DROP SCHEMA IF EXISTS "test" CASCADE', () => {
    // Arrange
    const command = {
      schema: { name: 'test' },
      ifExists: true,
      cascade: true,
    };

    // Act
    const result = getDropSchemaSql(command);

    // Assert
    expect(result).toBe('DROP SCHEMA IF EXISTS "test" CASCADE;');
  });
});
