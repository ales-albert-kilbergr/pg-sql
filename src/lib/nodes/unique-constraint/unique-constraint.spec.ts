import type { IUniqueConstraint } from '../../model';
import { SqlTagParserContext } from '../../parser-context';
import { UniqueConstraint } from './unique-constraint';

describe('(Unit) UniqueConstraint', () => {
  it('should add a unique constraint to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const constraint: IUniqueConstraint = {
      constraintName: 'un_table_column',
      table: 'table',
      columns: ['column'],
    };
    // Act
    UniqueConstraint(constraint)(context);
    // Assert
    expect(context.toSqlText()).toEqual(
      'CONSTRAINT "un_table_column" UNIQUE ("column")',
    );
  });

  it('should add a unique constraint with multiple columns to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const constraint: IUniqueConstraint = {
      constraintName: 'un_table_column1_column2',
      table: 'table',
      columns: ['column1', 'column2'],
    };
    // Act
    UniqueConstraint(constraint)(context);
    // Assert
    expect(context.toSqlText()).toEqual(
      'CONSTRAINT "un_table_column1_column2" UNIQUE ("column1", "column2")',
    );
  });
});
