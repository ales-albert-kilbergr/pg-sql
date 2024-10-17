/* eslint-disable @typescript-eslint/init-declarations */
import { DropSchemaSql } from '.';
import { Database } from '../../database';
import { Schema } from '../schema';

describe('(Unit) DropSchemaSql', () => {
  describe('(Unit) DropSchemaSql.getSql', () => {
    let schema: Schema;

    beforeAll(() => {
      const database = new Database('my_db');
      schema = new Schema('test', database);
    });
    it('should return DROP SCHEMA "test"', () => {
      // Arrange
      const args: DropSchemaSql.Args = {
        schema,
        ifExists: false,
        cascade: false,
      };

      // Act
      const result = DropSchemaSql.getSql(args);

      // Assert
      expect(result).toBe('DROP SCHEMA "test" RESTRICT;');
    });

    it('should return DROP SCHEMA IF EXISTS "test"', () => {
      // Arrange
      const args: DropSchemaSql.Args = {
        schema,
        ifExists: true,
        cascade: false,
      };

      // Act
      const result = DropSchemaSql.getSql(args);

      // Assert
      expect(result).toBe('DROP SCHEMA IF EXISTS "test" RESTRICT;');
    });

    it('should return DROP SCHEMA "test" CASCADE', () => {
      // Arrange
      const args: DropSchemaSql.Args = {
        schema,
        ifExists: false,
        cascade: true,
      };

      // Act
      const result = DropSchemaSql.getSql(args);

      // Assert
      expect(result).toBe('DROP SCHEMA "test" CASCADE;');
    });

    it('should return DROP SCHEMA IF EXISTS "test" CASCADE', () => {
      // Arrange
      const args: DropSchemaSql.Args = {
        schema,
        ifExists: true,
        cascade: true,
      };

      // Act
      const result = DropSchemaSql.getSql(args);

      // Assert
      expect(result).toBe('DROP SCHEMA IF EXISTS "test" CASCADE;');
    });
  });
});
