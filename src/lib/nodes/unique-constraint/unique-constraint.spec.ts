import { SqlTagParserContext } from '../../parser-context';
import { UniqueConstraint } from './unique-constraint';

describe('(Unit) UniqueConstraint', () => {
  it('should add a unique constraint to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    // Act
    UniqueConstraint('table', 'column')(context);
    // Assert
    expect(context.fragments).toEqual([
      'CONSTRAINT "un_table_column" UNIQUE ("column")',
    ]);
  });

  it('should add a unique constraint with multiple columns to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    // Act
    UniqueConstraint('table', ['column1', 'column2'])(context);
    // Assert
    expect(context.fragments).toEqual([
      'CONSTRAINT "un_table_column1_column2" UNIQUE ("column1", "column2")',
    ]);
  });
});
