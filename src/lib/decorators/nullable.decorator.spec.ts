import { Column } from './column.decorator';
import { Nullable } from './nullable.decorator';
import { Table } from './table.decorator';
import { TableMetadata } from './table.metadata';

describe('(Unit) @Nullable', () => {
  it('should mark a column to be nullable', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @Nullable()
      @Column('text')
      public id!: number;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.columns.get('id')?.isNullable()).toBeTruthy();
  });

  it('should not matter in which order @Column and @Nullable are applied', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @Column('text')
      @Nullable()
      public id!: number;

      @Nullable()
      @Column('text')
      public name!: string;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.columns.get('id')?.isNullable()).toBeTruthy();
    expect(table?.columns.get('name')?.isNullable()).toBeTruthy();
  });
});
