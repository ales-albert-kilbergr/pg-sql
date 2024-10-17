import { SqlTagParserContext } from '../../parser-context';
import type { SqlKeyword } from '../../sql-keyword';
import { Keyword } from './keyword';

describe('(Unit) Keyword', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let context: SqlTagParserContext;

  beforeEach(() => {
    context = new SqlTagParserContext();
  });

  it('should add the keyword to the context', () => {
    // Arrange
    const keyword: SqlKeyword = 'OFFSET';

    // Act
    Keyword(keyword)(context);

    // Assert
    expect(context.toSqlText()).toBe('OFFSET');
  });

  it('should add the keyword to existing text with a space', () => {
    // Arrange
    const keyword: SqlKeyword = 'OFFSET';
    context.addFragment('SELECT * FROM table');

    // Act
    Keyword(keyword)(context);

    // Assert
    expect(context.toSqlText()).toBe('SELECT * FROM table OFFSET');
  });
});
