import { SqlTagParserContext } from '../../parser-context';
import { Returning } from './returning';

describe('(Unit) Returning', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let context: SqlTagParserContext;

  beforeEach(() => {
    context = new SqlTagParserContext();
  });

  it('should adc RETURNING with a list of columns to the context', () => {
    // Arrange
    const columns = ['column1', 'column2'];

    // Act
    Returning(columns)(context);

    // Assert
    expect(context.toSqlText()).toBe('RETURNING "column1", "column2"');
  });

  it('should not add RETURNING to the context if columns is an empty array', () => {
    // Arrange
    const columns: string[] = [];

    // Act
    Returning(columns)(context);

    // Assert
    expect(context.toSqlText()).toBe('');
  });

  it('should not add RETURNING to the context if columns is undefined', () => {
    // Arrange
    const columns = undefined;

    // Act
    Returning(columns)(context);

    // Assert
    expect(context.toSqlText()).toBe('');
  });
});
