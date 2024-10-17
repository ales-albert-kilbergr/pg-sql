import { SqlTagParserContext } from '../../parser-context';
import { Unique } from './unique';

describe('(Unit) Unique', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let context: SqlTagParserContext;

  beforeEach(() => {
    context = new SqlTagParserContext();
  });

  it('should add UNIQUE to the context if useFlag is true', () => {
    // Arrange
    const useFlag = true;

    // Act
    Unique(useFlag)(context);

    // Assert
    expect(context.toSqlText()).toBe('UNIQUE');
  });

  it('should not add UNIQUE to the context if useFlag is false', () => {
    // Arrange
    const useFlag = false;

    // Act
    Unique(useFlag)(context);

    // Assert
    expect(context.toSqlText()).toBe('');
  });

  it('should not add UNIQUE to the context if useFlag is undefined', () => {
    // Arrange
    const useFlag = undefined;

    // Act
    Unique(useFlag)(context);

    // Assert
    expect(context.toSqlText()).toBe('');
  });
});
