/* eslint-disable @typescript-eslint/init-declarations */
import { DropTableSql } from '.';
import { Table } from '../table';
import { Database } from '../../database';
import { Schema } from '../../schema';

describe('(Unit) DropTableSql', () => {
  describe('(Unit) DropTableSql.getSql', () => {
    let table: Table;

    beforeAll(() => {
      const database = new Database('my_db');
      const schema = new Schema('test', database);
      table = new Table('test', schema);
    });

    it('should return DROP TABLE "test"', () => {
      // Arrange
      const args: DropTableSql.Args = {
        table,
        ifExists: false,
        cascade: false,
      };

      // Act
      const result = DropTableSql.getSql(args);

      // Assert
      expect(result).toBe('DROP TABLE "public"."test" RESTRICT;');
    });

    it('should return DROP TABLE IF EXISTS "test"', () => {
      // Arrange
      const args: DropTableSql.Args = {
        table,
        ifExists: true,
        cascade: false,
      };

      // Act
      const result = DropTableSql.getSql(args);

      // Assert
      expect(result).toBe('DROP TABLE IF EXISTS "public"."test" RESTRICT;');
    });

    it('should return DROP TABLE "test" CASCADE', () => {
      // Arrange
      const args: DropTableSql.Args = {
        table,
        ifExists: false,
        cascade: true,
      };

      // Act
      const result = DropTableSql.getSql(args);

      // Assert
      expect(result).toBe('DROP TABLE "public"."test" CASCADE;');
    });

    it('should return DROP TABLE IF EXISTS "test" CASCADE', () => {
      // Arrange
      const args: DropTableSql.Args = {
        table,
        ifExists: true,
        cascade: true,
      };

      // Act
      const result = DropTableSql.getSql(args);

      // Assert
      expect(result).toBe('DROP TABLE IF EXISTS "public"."test" CASCADE;');
    });
  });
});
