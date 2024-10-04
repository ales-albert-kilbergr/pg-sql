import { type DropTableSqlArgs, getDropTableSql } from './drop-table.sql';

describe('(Unit) getDropTableSql', () => {
  it('should return DROP TABLE "test"', () => {
    // Arrange
    const command: DropTableSqlArgs = {
      table: { name: 'test', schema: { name: 'public' } },
      ifExists: false,
      cascade: false,
    };

    // Act
    const result = getDropTableSql(command);

    // Assert
    expect(result).toBe('DROP TABLE "public"."test" RESTRICT;');
  });

  it('should return DROP TABLE IF EXISTS "test"', () => {
    // Arrange
    const command: DropTableSqlArgs = {
      table: { name: 'test', schema: { name: 'public' } },
      ifExists: true,
      cascade: false,
    };

    // Act
    const result = getDropTableSql(command);

    // Assert
    expect(result).toBe('DROP TABLE IF EXISTS "public"."test" RESTRICT;');
  });

  it('should return DROP TABLE "test" CASCADE', () => {
    // Arrange
    const command: DropTableSqlArgs = {
      table: { name: 'test', schema: { name: 'public' } },
      ifExists: false,
      cascade: true,
    };

    // Act
    const result = getDropTableSql(command);

    // Assert
    expect(result).toBe('DROP TABLE "public"."test" CASCADE;');
  });

  it('should return DROP TABLE IF EXISTS "test" CASCADE', () => {
    // Arrange
    const command: DropTableSqlArgs = {
      table: { name: 'test', schema: { name: 'public' } },
      ifExists: true,
      cascade: true,
    };

    // Act
    const result = getDropTableSql(command);

    // Assert
    expect(result).toBe('DROP TABLE IF EXISTS "public"."test" CASCADE;');
  });
});
