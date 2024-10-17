import { SqlTagParserContext } from '../../parser-context';
import { Text } from './text';

describe('(Unit) Text', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let context: SqlTagParserContext;

  beforeEach(() => {
    context = new SqlTagParserContext();
  });

  it('should add the text to the context', () => {
    // Arrange
    const text = 'test';

    // Act
    Text(text)(context);

    // Assert
    expect(context.toSqlText()).toBe('test');
  });
});
