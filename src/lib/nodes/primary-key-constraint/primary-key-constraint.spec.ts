import { SqlTagParserContext } from '../../parser-context';
import { PrimaryKeyConstraint } from './primary-key-constraint';

describe('(Unit) PrimaryKeyConstraint', () => {
  it('should add a primary key constraint to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    // Act
    PrimaryKeyConstraint('table', 'column')(context);
    // Assert
    expect(context.fragments).toEqual([
      'CONSTRAINT "pk_table" PRIMARY KEY ("column")',
    ]);
  });

  it('should add a primary key constraint with multiple columns to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    // Act
    PrimaryKeyConstraint('table', ['column1', 'column2'])(context);
    // Assert
    expect(context.fragments).toEqual([
      'CONSTRAINT "pk_table" PRIMARY KEY ("column1", "column2")',
    ]);
  });
});
