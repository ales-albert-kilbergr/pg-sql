/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Table } from './table.decorator';
import { TableMetadata } from './table.metadata';
import { UniqueKey } from './unique-key.decorator';

describe('(Unit) @UniqueKey', () => {
  it('should define a unique key for a table as a class decorator', () => {
    // Arrange & Act
    @Table('my_table')
    @UniqueKey(['id'])
    class MyClass {
      public id!: number;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.uniqueKeys).toBeDefined();
    expect(table?.uniqueKeys.count).toBe(1);
    expect(table?.uniqueKeys.has('my_table_id_key')).toBe(true);
  });

  it('should pass additional arguments to the class declared unique key constraint', () => {
    // Arrange & Act
    @Table('my_table')
    @UniqueKey(['id'], { deferrable: true })
    class MyClass {
      public id!: number;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.uniqueKeys.get('my_table_id_key')?.args.deferrable).toBe(
      true,
    );
  });

  it('should define a unique key for a table as a property decorator', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @UniqueKey()
      public id!: number;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.uniqueKeys).toBeDefined();
    expect(table?.uniqueKeys.count).toBe(1);
    expect(table?.uniqueKeys.has('my_table_id_key')).toBe(true);
  });

  it('should allow to define custom unique key name', () => {
    // Arrange & Act
    @Table('my_table')
    @UniqueKey(['id'], { constraintName: 'my_table_unique_key' })
    class MyClass {
      public id!: number;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.uniqueKeys.get('my_table_unique_key')).toBeDefined();
  });

  it('should define a unique key for a column with custom name', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @UniqueKey({ columnName: 'my_id' })
      public id!: number;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.uniqueKeys).toBeDefined();
    expect(table?.uniqueKeys.count).toBe(1);
    expect(table?.uniqueKeys.has('my_table_my_id_key')).toBe(true);
  });

  it('should define two unique keys for a table', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @UniqueKey()
      public id!: number;

      @UniqueKey()
      public name!: string;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.uniqueKeys).toBeDefined();
    expect(table?.uniqueKeys.count).toBe(2);
    expect(table?.uniqueKeys.has('my_table_id_key')).toBe(true);
    expect(table?.uniqueKeys.has('my_table_name_key')).toBe(true);
  });

  it('should define a class unique key with two columns', () => {
    // Arrange & Act
    @Table('my_table')
    @UniqueKey(['id', 'name'])
    class MyClass {
      public id!: number;
      public name!: string;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.uniqueKeys).toBeDefined();
    expect(table?.uniqueKeys.count).toBe(1);
    expect(table?.uniqueKeys.has('my_table_id_name_key')).toBe(true);
  });

  it('should define two class unique keys', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @UniqueKey('my_id_key')
      public id!: number;

      @UniqueKey()
      public name!: string;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.uniqueKeys).toBeDefined();
    expect(table?.uniqueKeys.count).toBe(2);
    expect(table?.uniqueKeys.has('my_id_key')).toBe(true);
    expect(table?.uniqueKeys.has('my_table_name_key')).toBe(true);
  });
});
