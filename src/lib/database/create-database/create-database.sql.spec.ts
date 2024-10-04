import {
  type CreateDatabaseSqlArgs,
  getCreateDatabaseSql,
} from './create-database.sql';

describe('(Unit) getCreateDatabaseSql', () => {
  it('should return the correct SQL', () => {
    // Arrange
    const args: CreateDatabaseSqlArgs = {
      database: 'my_database',
      withOwner: 'my_owner',
    };
    // Act
    const result = getCreateDatabaseSql(args);
    // Assert
    expect(result).toBe(
      `CREATE DATABASE "my_database" WITH OWNER = "my_owner";`,
    );
  });
});
