import { CreateDatabaseSql } from '.';
import { Database } from '../database';

describe('(Unit) CreateDatabaseSql', () => {
  describe('getSql', () => {
    it('should return the correct SQL', () => {
      // Arrange
      const args: CreateDatabaseSql.Args = {
        database: new Database('my_database'),
        withOwner: 'my_owner',
      };
      // Act
      const result = CreateDatabaseSql.getSql(args);
      // Assert
      expect(result).toBe(
        `CREATE DATABASE "my_database" WITH OWNER = "my_owner";`,
      );
    });
  });

  describe('create', () => {
    it('should create a query with preset database', () => {
      // Arrange
      const database = new Database('my_database');
      // Act
      const query = CreateDatabaseSql.create(database);
      // Assert
      expect(query.database()).toBe(database);
    });
  });
});
