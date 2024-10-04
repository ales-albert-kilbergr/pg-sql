import { PrimaryKey } from './primary-key.decorator';
import { Table } from './table.decorator';
import { TableMetadata } from './table.metadata';

describe('(Unit) @PrimaryKey', () => {
  it('should define a primary key for a table as a class decorator', () => {
    // Arrange & Act
    @Table('my_table')
    @PrimaryKey(['id'])
    class MyClass {
      public id!: number;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.primaryKey).toBeDefined();
    expect(table?.primaryKey?.args.columns).toEqual(['id']);
  });

  it('should pass additional arguments to the class declared primary key constraint', () => {
    // Arrange & Act
    @Table('my_table')
    @PrimaryKey(['id'], { deferrable: true })
    class MyClass {
      public id!: number;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.primaryKey?.args.deferrable).toBe(true);
  });

  it('should define a primary key for a table as a property decorator', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @PrimaryKey()
      public id!: number;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.primaryKey).toBeDefined();
  });

  it('should allow to define custom primary key name', () => {
    // Arrange & Act
    @Table('my_table')
    @PrimaryKey(['id'], { constraintName: 'my_table_pkey' })
    class MyClass {
      public id!: number;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.primaryKey?.name).toBe('my_table_pkey');
  });

  it('should define a primary key for a column with custom name', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @PrimaryKey({ columnName: 'my_id' })
      public myId!: number;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.primaryKey?.args.columns).toEqual(['my_id']);
  });

  it('should define a primary key on a column with custom constraint name', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @PrimaryKey('my_custom_pkey_name')
      public myId!: number;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.primaryKey?.name).toBe('my_custom_pkey_name');
  });

  it('should define a primary key on a column with custom constraint name and additional arguments', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @PrimaryKey('my_custom_pkey_name', { deferrable: true })
      public myId!: number;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.primaryKey?.name).toBe('my_custom_pkey_name');
    expect(table?.primaryKey?.args.deferrable).toBe(true);
  });
});
