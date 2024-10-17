/* eslint-disable @typescript-eslint/no-magic-numbers */
import {
  ColumnList,
  defineBigintColumn,
  defineTextColumn,
} from '../model/column';
import { type InsertArgs, InsertSql } from './insert.sql';

describe('(Unit) InsertSql', () => {
  it('should generate an insert query config', () => {
    // Arrange
    const columns = new ColumnList([
      defineBigintColumn('id'),
      defineTextColumn('name'),
    ]);

    const config: InsertArgs = {
      schema: 'public',
      table: 'test',
      columns,
      data: [
        { id: 1, name: 'test' },
        { id: 2, name: 'test' },
      ],
    };
    // Act
    const result = InsertSql(config);
    // Assert
    expect(result.text).toBe(
      'INSERT INTO "public"."test" ("id", "name") VALUES ($1, $2), ($3, $4);',
    );
  });

  it('should generate an insert query config with returning', () => {
    // Arrange
    const columns = new ColumnList([
      defineBigintColumn('id'),
      defineTextColumn('name'),
    ]);

    const config: InsertArgs = {
      schema: 'public',
      table: 'test',
      columns,
      data: [
        { id: 1, name: 'test' },
        { id: 2, name: 'test' },
      ],
      returning: ['id'],
    };
    // Act
    const result = InsertSql(config);
    // Assert
    expect(result.text).toBe(
      'INSERT INTO "public"."test" ("id", "name") VALUES ($1, $2), ($3, $4) RETURNING "id";',
    );
  });

  it('should convert property keys to column names', () => {
    // Arrange
    const columns = new ColumnList([
      defineBigintColumn('my_id', { propertyKey: 'id' }),
      defineTextColumn('my_name', { propertyKey: 'name' }),
    ]);

    const config: InsertArgs = {
      schema: 'public',
      table: 'test',
      columns,
      data: [
        { id: 1, name: 'test' },
        { id: 2, name: 'test' },
      ],
    };
    // Act
    const result = InsertSql(config);
    // Assert
    expect(result.text).toBe(
      'INSERT INTO "public"."test" ("my_id", "my_name") VALUES ($1, $2), ($3, $4);',
    );
    expect(result.values).toEqual([1, 'test', 2, 'test']);
  });

  it('should accept a single object for data', () => {
    // Arrange
    const columns = new ColumnList([
      defineBigintColumn('id'),
      defineTextColumn('name'),
    ]);

    const config: InsertArgs = {
      schema: 'public',
      table: 'test',
      columns,
      data: { id: 1, name: 'test' },
    };
    // Act
    const result = InsertSql(config);
    // Assert
    expect(result.text).toBe(
      'INSERT INTO "public"."test" ("id", "name") VALUES ($1, $2);',
    );
    expect(result.values).toEqual([1, 'test']);
  });
});
