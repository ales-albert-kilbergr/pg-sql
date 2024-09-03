import { SqlTagParserContext } from '../../parser-context';
import { IfExists } from './if-exists';

describe('(Unit) IfExists', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let context: SqlTagParserContext;

  beforeEach(() => {
    context = new SqlTagParserContext();
  });

  it('should add IF EXISTS to the context if useFlag is true', () => {
    // Arrange
    const useFlag = true;

    // Act
    IfExists(useFlag)(context);

    // Assert
    expect(context.toSqlText()).toBe('IF EXISTS');
  });

  it('should not add IF EXISTS to the context if useFlag is false', () => {
    // Arrange
    const useFlag = false;

    // Act
    IfExists(useFlag)(context);

    // Assert
    expect(context.toSqlText()).toBe('');
  });
});
