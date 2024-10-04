import * as Postgres from '../model';
import { Column, CreatedAtColumn, UpdatedAtColumn } from './column.decorator';
import { Table } from './table.decorator';
import { TableMetadata } from './table.metadata';

describe('(Unit) @Column', () => {
  it('should define a column with the specified data type', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @Column('integer')
      public id!: number;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.columns.count).toBe(1);
    expect(table?.columns.has('id')).toBe(true);
    expect(table?.columns.get('id')?.type.name).toBe(
      Postgres.DataTypeDiscriminant.INTEGER,
    );
  });

  it('should define a column with a comment', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @Column('integer', { comment: 'My column' })
      public id!: number;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.columns.get('id')?.comment).toBe('My column');
  });

  it('should define a column with a custom name', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @Column('integer', { columnName: 'my_id' })
      public id!: number;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.columns.has('id')).toBe(false);
    expect(table?.columns.has('my_id')).toBe(true);
  });

  it('should define a columns property key', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @Column('integer', { columnName: 'my_id' })
      public id!: number;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.columns.get('my_id')?.propertyKey).toBe('id');
  });

  it('should define a VARCHAR column with a length', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @Column('varchar', {
        length: 255,
      })
      public name!: string;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    const column = table?.columns.get('name') as Postgres.Column<
      Postgres.DataType<Postgres.DataTypeDiscriminant.VARCHAR>
    >;
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    expect(column.type.getArg('length')).toBe(255);
  });
});

describe('(Unit) @CreatedAtColumn', () => {
  it('should define a created at column', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @CreatedAtColumn()
      public createdAt!: Date;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.columns.has('created_at')).toBeTruthy();
  });
});

describe('(Unit) @UpdatedAtColumn', () => {
  it('should define an updated at column', () => {
    // Arrange & Act
    @Table('my_table')
    class MyClass {
      @UpdatedAtColumn()
      public updatedAt!: Date;
    }

    const { table } = TableMetadata.getMetadata(MyClass);

    // Assert
    expect(table?.columns.has('updated_at')).toBeTruthy();
  });
});
