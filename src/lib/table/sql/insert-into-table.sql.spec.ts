/* eslint-disable @typescript-eslint/init-declarations */
import { InsertIntoTableSql } from '.';
import { Table } from '../table';
import { Database } from '../../database';
import { Schema } from '../../schema';

describe('(Unit) InsertIntoTableSql', () => {
  describe('(Unit) InsertIntoTableSql.getSql', () => {
    let table: Table;

    beforeAll(() => {
      const database = new Database('my_db');
      const schema = new Schema('public', database);
      table = new Table('my_table', schema);

      table.defineColumn(database.dataTypes.getText(), 'id');
      table.defineColumn(database.dataTypes.getText(), 'name');
    });

    it('should return INSERT query', () => {
      // Arrange
      const query: InsertIntoTableSql.Args = { into: table, values: [] };
      // Act
      const result = InsertIntoTableSql.getSql(query);
      // Assert
      expect(result).toBe(
        `INSERT INTO "public"."my_table" ("id", "name") VALUES ($1, $2)`,
      );
    });

    it('should return an INSERT query with multiple rows', () => {
      // Arrange
      const query: InsertIntoTableSql.Args = { into: table, values: [{}, {}] };
      // Act
      const result = InsertIntoTableSql.getSql(query);
      // Assert
      expect(result).toBe(
        `INSERT INTO "public"."my_table" ("id", "name") VALUES ($1, $2), ($3, $4)`,
      );
    });

    it('should return an INSERT query with RETURNING clause', () => {
      // Arrange
      const query: InsertIntoTableSql.Args = {
        into: table,
        values: [],
        returning: ['id'],
      };
      // Act
      const result = InsertIntoTableSql.getSql(query);
      // Assert
      expect(result).toBe(
        `INSERT INTO "public"."my_table" ("id", "name") VALUES ($1, $2) RETURNING "id"`,
      );
    });
  });
});
