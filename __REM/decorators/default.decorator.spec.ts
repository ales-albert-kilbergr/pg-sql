import { Column } from './column.decorator';
import { Default } from './default.decorator';
import { Table } from './table.decorator';
import { TableMetadata } from './table.metadata';

describe('(Unit) @Default', () => {
  it('should define a default value for a column as a property decorator', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @Default('0')
      @Column('text')
      public id!: number;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.columns.get('id')?.default?.args.expression).toBe('0');
  });

  it('should not matter in which order @Column and @Default are applied', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @Column('text')
      @Default('0')
      public id!: number;

      @Default('0')
      @Column('text')
      public name!: string;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.columns.get('id')?.default?.args.expression).toBe('0');
    expect(table?.columns.get('name')?.default?.args.expression).toBe('0');
  });
});
