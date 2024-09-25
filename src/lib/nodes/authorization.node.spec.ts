import { SqlTagParserContext } from '../parser-context';
import { Authorization } from './authorization.node';

describe('(Unit) Authorization', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let context: SqlTagParserContext;

  beforeEach(() => {
    context = new SqlTagParserContext();
  });

  it('should add the AUTHORIZATION keyword and a user name', () => {
    // Arrange
    const authorization = 'user_name';

    // Act
    Authorization(authorization)(context);

    // Assert
    expect(context.toSqlText()).toBe(`AUTHORIZATION "${authorization}"`);
  });
});
