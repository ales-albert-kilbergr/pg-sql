/* eslint-disable @typescript-eslint/no-magic-numbers */
import type { QueryResultRow } from 'pg';
import { parseRows } from './parse-rows';
import { ColumnList, defineTextColumn } from '../model';

describe('(Unit) parseRows', () => {
  it('should return an array of instances of the specified class', () => {
    // Arrange
    const columns = new ColumnList([
      defineTextColumn('id'),
      defineTextColumn('name'),
    ]);
    class MyModel {
      public id!: number;
      public name!: string;
    }
    const rows: QueryResultRow[] = [
      { id: 1, name: 'name1' },
      { id: 2, name: 'name2' },
    ];
    // Act
    const result = parseRows({ columns, Ctor: MyModel })(rows);
    // Assert
    expect(result[0]).toBeInstanceOf(MyModel);
    expect(result[0].id).toBe(1);
    expect(result[0].name).toBe('name1');
    expect(result[1]).toBeInstanceOf(MyModel);
    expect(result[1].id).toBe(2);
    expect(result[1].name).toBe('name2');
  });

  it('should rename the column to the property key', () => {
    // Arrange
    const columns = new ColumnList([
      defineTextColumn('column', { propertyKey: 'property' }),
    ]);
    class MyModel {
      public property!: string;
    }
    const rows: QueryResultRow[] = [{ column: 'value' }];
    // Act
    const result = parseRows({ columns, Ctor: MyModel })(rows);
    // Assert
    expect(result[0].property).toBe('value');
  });

  it('should return an array of objects if the class is not specified', () => {
    // Arrange
    const columns = new ColumnList([
      defineTextColumn('id'),
      defineTextColumn('name'),
    ]);
    const rows: QueryResultRow[] = [
      { id: 1, name: 'name1' },
      { id: 2, name: 'name2' },
    ];
    // Act
    const result = parseRows({ columns })(rows);
    // Assert
    expect(result[0]).toEqual({ id: 1, name: 'name1' });
    expect(result[1]).toEqual({ id: 2, name: 'name2' });
  });

  it('should return only the columns that are defined', () => {
    // Arrange
    const columns = new ColumnList([defineTextColumn('id')]);
    class MyModel {
      public id!: number;
      public name!: string;
    }
    const rows: QueryResultRow[] = [
      { id: 1, name: 'name1' },
      { id: 2, name: 'name2' },
    ];
    // Act
    const result = parseRows({ columns, Ctor: MyModel })(rows);
    // Assert
    expect(result[0]).toBeInstanceOf(MyModel);
    expect(result[0].id).toBe(1);
    expect(result[0].name).toBeUndefined();
    expect(result[1]).toBeInstanceOf(MyModel);
    expect(result[1].id).toBe(2);
    expect(result[1].name).toBeUndefined();
  });

  it('should skip the column if the value is undefined', () => {
    // Arrange
    const columns = new ColumnList([
      defineTextColumn('id'),
      defineTextColumn('name'),
    ]);
    class MyModel {
      public id!: number;
      public name!: string;
    }
    const rows: QueryResultRow[] = [{ id: 1 }];
    // Act
    const result = parseRows<MyModel>({ columns })(rows);
    // Assert
    expect(result[0].id).toBe(1);
    expect(result[0].name).toBeUndefined();
  });
});
