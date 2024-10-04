import { getDropDatabaseSql } from './drop-database.sql';

describe('(Unit) getDropDatabaseSql', () => {
  it('should return the correct SQL', () => {
    // Arrange
    const command = {
      database: { name: 'my_database' },
      ifExists: true,
      withForce: true,
    };
    // Act
    const sql = getDropDatabaseSql(command);
    // Assert
    expect(sql).toEqual('DROP DATABASE IF EXISTS "my_database" WITH FORCE;');
  });
});
