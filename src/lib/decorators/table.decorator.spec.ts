/* eslint-disable @typescript-eslint/no-extraneous-class */
import { Table } from './table.decorator';
import { Table as TableModel } from '../model';
import { Identifier } from '../model/identifier';

describe('(Unit) @Table', () => {
  it('should create a table metadata object for the target', () => {
    // Arrange
    @Table('test')
    class Test {}

    // Act
    const result = Table.getTable(Test);

    // Assert
    expect(result).toBeInstanceOf(TableModel);
    expect(result.getName()).toBe('test');
  });

  it('should define the table and schema', () => {
    // Arrange
    @Table('schema.test')
    class Test {}

    // Act
    const result = Table.getTable(Test);

    // Assert
    expect(result.getName()).toBe('test');
    expect(result.getSchema()).toBe('schema');
  });

  it('should fail if the schema is not a valid identifier is not valid', () => {
    // Arrange
    class Test {}
    const act = (): void => {
      Table('1test.schema')(Test);
    };

    // Act
    // Assert
    expect(act).toThrow(Identifier.TypeError);
  });
});
