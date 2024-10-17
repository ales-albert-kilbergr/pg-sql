import { SqlTagParserContext } from '../../parser-context';
import { Concurrently } from './concurrently';

describe('(Unit) Concurrently', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let context: SqlTagParserContext;

  beforeEach(() => {
    context = new SqlTagParserContext();
  });

  it('should add CONCURRENTLY to the context if useFlag is true', () => {
    // Arrange
    const useFlag = true;

    // Act
    Concurrently(useFlag)(context);

    // Assert
    expect(context.toSqlText()).toBe('CONCURRENTLY');
  });

  it('should not add CONCURRENTLY to the context if useFlag is false', () => {
    // Arrange
    const useFlag = false;

    // Act
    Concurrently(useFlag)(context);

    // Assert
    expect(context.toSqlText()).toBe('');
  });

  it('should not add CONCURRENTLY to the context if useFlag is undefined', () => {
    // Arrange
    const useFlag = undefined;

    // Act
    Concurrently(useFlag)(context);

    // Assert
    expect(context.toSqlText()).toBe('');
  });
});
