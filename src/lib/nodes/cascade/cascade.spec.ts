import { SqlTagParserContext } from '../../parser-context';
import { Cascade } from './cascade';

describe('(Unit) Cascade', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let context: SqlTagParserContext;

  beforeEach(() => {
    context = new SqlTagParserContext();
  });

  it('should add CASCADE to the context if useFlag is true', () => {
    // Arrange
    const useFlag = true;

    // Act
    Cascade(useFlag)(context);

    // Assert
    expect(context.toSqlText()).toBe('CASCADE');
  });

  it('should not add CASCADE to the context if useFlag is false', () => {
    // Arrange
    const useFlag = false;

    // Act
    Cascade(useFlag)(context);

    // Assert
    expect(context.toSqlText()).toBe('');
  });

  it('should not add CASCADE to the context if useFlag is undefined', () => {
    // Arrange
    const useFlag = undefined;

    // Act
    Cascade(useFlag)(context);

    // Assert
    expect(context.toSqlText()).toBe('');
  });
});
