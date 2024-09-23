import { ColumnList, defineTextColumn } from './model';
import { CreateSchemaSql, CreateTableSql } from './queries';
import { mergeQueryConfigBuilders, QueryConfig } from './query-config';

describe('(Unit) QueryConfig', () => {
  describe('constructor', () => {
    it('should create a new instance with the provided text and values', () => {
      // Arrange
      const text = 'SELECT * FROM users WHERE id = $1';
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      const values = [1];
      // Act
      const queryConfig = new QueryConfig(text, values);
      // Assert
      expect(queryConfig.text).toBe(text);
      expect(queryConfig.values).toEqual(values);
    });

    it('should create a new instance with an empty text and values', () => {
      // Act
      const queryConfig = new QueryConfig();
      // Assert
      expect(queryConfig.text).toBe('');
      expect(queryConfig.values).toEqual([]);
    });

    it('should generate a random ID as uuid upon initialization', () => {
      // Act
      const queryConfig = new QueryConfig();
      // Assert
      expect(queryConfig.id).toEqual(expect.any(String));
    });
  });

  describe('clone', () => {
    it('should return a new instance with the same text and values', () => {
      // Arrange
      const queryConfig = new QueryConfig('SELECT * FROM users WHERE id = $1', [
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        1,
      ]);
      // Act
      const clone = queryConfig.clone();
      // Assert
      expect(clone).not.toBe(queryConfig);
      expect(clone.text).toBe(queryConfig.text);
      expect(clone.values).toEqual(queryConfig.values);
    });
  });
});

describe('(Unit) mergeQueryConfigBuilders', () => {
  it('should merge two query config builders', () => {
    // Arrange
    const a = (args: { a: number }): QueryConfig =>
      new QueryConfig('SELECT $1;', [args.a]);
    const b = (args: { b: string }): QueryConfig =>
      new QueryConfig('SELECT $1;', [args.b]);
    // Act
    const mergedBuilder = mergeQueryConfigBuilders(a, b);
    const queryConfig = mergedBuilder({ a: 1, b: 'hello' });
    // Assert
    expect(queryConfig.text).toEqual('SELECT $1;SELECT $2;');
    expect(queryConfig.values).toEqual([1, 'hello']);
  });

  it('should merge create schema and create table query builders', () => {
    // Arrange
    // Act
    const mergedBuilder = mergeQueryConfigBuilders(
      CreateSchemaSql,
      CreateTableSql,
    );
    const queryConfig = mergedBuilder({
      schema: 'test_schema',
      table: 'users',
      columns: new ColumnList([
        defineTextColumn('id'),
        defineTextColumn('name'),
      ]),
    });
    // Assert
    expect(queryConfig.text).toEqual(
      'CREATE SCHEMA "test_schema";CREATE TABLE "test_schema"."users" ' +
        '("id" TEXT NOT NULL , "name" TEXT NOT NULL);',
    );
  });
});
