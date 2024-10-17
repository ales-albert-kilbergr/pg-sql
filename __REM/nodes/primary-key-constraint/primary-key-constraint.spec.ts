import { SqlTagParserContext } from '../../parser-context';
import { PrimaryKey, type PrimaryKeyArgs } from './primary-key-constraint';

describe('(Unit) PrimaryKeyConstraint', () => {
  it('should add a primary key constraint to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const primaryKey: PrimaryKeyArgs = {
      columns: ['column'],
      table: 'table',
    };
    // Act
    PrimaryKey(primaryKey)(context);
    // Assert
    expect(context.toSqlText()).toEqual(
      'CONSTRAINT "pk_table" PRIMARY KEY ("column")',
    );
  });

  it('should add a primary key constraint with multiple columns to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const primaryKey: PrimaryKeyArgs = {
      columns: ['column1', 'column2'],
      table: 'table',
    };
    // Act
    PrimaryKey(primaryKey)(context);
    // Assert
    expect(context.toSqlText()).toEqual(
      'CONSTRAINT "pk_table" PRIMARY KEY ("column1", "column2")',
    );
  });

  it('should add a primary key constraint with a custom name to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const primaryKey: PrimaryKeyArgs = {
      columns: ['column'],
      constraintName: 'custom_pk',
      table: 'table',
    };
    // Act
    PrimaryKey(primaryKey)(context);
    // Assert
    expect(context.toSqlText()).toEqual(
      'CONSTRAINT "custom_pk" PRIMARY KEY ("column")',
    );
  });

  it('should not add a primary key constraint to the context when no args are provided', () => {
    // Arrange
    const context = new SqlTagParserContext();
    // Act
    PrimaryKey()(context);
    // Assert
    expect(context.toSqlText()).toEqual('');
  });
});
