import { SqlTagParserContext } from '../../parser-context';
import { Only } from './only';

describe('(Unit) Only', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let context: SqlTagParserContext;

  beforeEach(() => {
    context = new SqlTagParserContext();
  });

  it('should add ONLY to the context if useFlag is true', () => {
    // Arrange
    const useFlag = true;

    // Act
    Only(useFlag)(context);

    // Assert
    expect(context.toSqlText()).toBe('ONLY');
  });

  it('should not add ONLY to the context if useFlag is false', () => {
    // Arrange
    const useFlag = false;

    // Act
    Only(useFlag)(context);

    // Assert
    expect(context.toSqlText()).toBe('');
  });

  it('should not add ONLY to the context if useFlag is undefined', () => {
    // Arrange
    const useFlag = undefined;

    // Act
    Only(useFlag)(context);

    // Assert
    expect(context.toSqlText()).toBe('');
  });
});
