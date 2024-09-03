import { SqlTagParserContext } from '../../parser-context';
import { IfNotExists } from './if-not-exists';

describe('(Unit) IfNotExists', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let context: SqlTagParserContext;

  beforeEach(() => {
    context = new SqlTagParserContext();
  });

  it('should add IF NOT EXISTS to the context if useFlag is true', () => {
    // Arrange
    const useFlag = true;

    // Act
    IfNotExists(useFlag)(context);

    // Assert
    expect(context.toSqlText()).toBe('IF NOT EXISTS');
  });

  it('should not add IF NOT EXISTS to the context if useFlag is false', () => {
    // Arrange
    const useFlag = false;

    // Act
    IfNotExists(useFlag)(context);

    // Assert
    expect(context.toSqlText()).toBe('');
  });
});
