/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Table } from './table.decorator';
import { TableMetadata } from './table.metadata';
import * as Pg from '../model';

describe('(Unit) @Table', () => {
  it('should define a table for a class as a class decorator', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {}

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table).toBeDefined();
    expect(table?.name).toBe('my_table');
  });

  it('should set a "public" schema as a default', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {}

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.schema.name).toBe('public');
  });

  it('should set a "default" database as a default', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {}

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.schema.database.name).toBe('default');
  });

  it('should define a table in a custom schema', () => {
    // Arrange & Act
    @Table('my_schema.my_table')
    class MyClass {}

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.schema.name).toBe('my_schema');
  });

  it('should reuse the same schema if it was already defined', () => {
    // Arrange & Act
    @Table('my_schema.my_table_one')
    class MyClassOne {}

    @Table('my_schema.my_table_two')
    class MyClassTwo {}

    const { table: tableOne } = TableMetadata.getMetadata(MyClassOne);
    const { table: tableTwo } = TableMetadata.getMetadata(MyClassTwo);

    // Assert
    expect(tableOne?.schema).toBe(tableTwo?.schema);
  });

  it('should define a table with a dynamic name', () => {
    // Arrange & Act
    function defineMyTableClass(dynamicTableName: string): object {
      @Table(dynamicTableName)
      class MyClass {}

      return MyClass;
    }

    defineMyTableClass('my_table_one');
    defineMyTableClass('my_table_two');

    const schema = Pg.getDefaultDatabase().getDefaultSchema();

    // Assert
    expect(schema.tables.has('my_table_one')).toBe(true);
    expect(schema.tables.has('my_table_two')).toBe(true);
  });
});
