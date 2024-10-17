import { DropDatabaseSql } from '.';
import { Database } from '../database';

describe('(Unit) DropDatabaseSql', () => {
  describe('getSql', () => {
    it('should return the correct SQL', () => {
      // Arrange
      const args: DropDatabaseSql.Args = {
        database: new Database('my_database'),
        ifExists: true,
        withForce: true,
      };
      // Act
      const result = DropDatabaseSql.getSql(args);
      // Assert
      expect(result).toBe(`DROP DATABASE IF EXISTS "my_database" WITH FORCE;`);
    });
  });
});
