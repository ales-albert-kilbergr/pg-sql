/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Database } from '../../database';
import type { Table } from '../table';
import { getInsertSql, type InsertSqlArgs } from './insert.sql';

describe('(Unit) getInsertSql', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let table: Table;

  beforeEach(() => {
    const database = new Database('my_db');
    const schema = database.defineSchema('public');
    table = schema.defineTable('my_table');

    table.defineColumn(database.dataTypes.getText(), 'id');
    table.defineColumn(database.dataTypes.getText(), 'name');
  });

  it('should return INSERT command', () => {
    // Arrange
    const command: InsertSqlArgs = { table: table! };
    // Act
    const result = getInsertSql(command);
    // Assert
    expect(result).toBe(
      `INSERT INTO "public"."my_table" ("id", "name") VALUES ($1, $2)`,
    );
  });

  it('should return an INSERT command with multiple rows', () => {
    // Arrange
    const command: InsertSqlArgs = { table: table!, rowsCount: 2 };
    // Act
    const result = getInsertSql(command);
    // Assert
    expect(result).toBe(
      `INSERT INTO "public"."my_table" ("id", "name") VALUES ($1, $2), ($3, $4)`,
    );
  });

  it('should return an INSERT command with RETURNING clause', () => {
    // Arrange
    const command: InsertSqlArgs = {
      table: table!,
      returning: ['id'],
    };
    // Act
    const result = getInsertSql(command);
    // Assert
    expect(result).toBe(
      `INSERT INTO "public"."my_table" ("id", "name") VALUES ($1, $2) RETURNING "id"`,
    );
  });
});
