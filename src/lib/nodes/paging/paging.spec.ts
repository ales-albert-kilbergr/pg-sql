import { SqlTagParserContext } from '../../parser-context';
import { Paging } from './paging';

describe('(Unit) Paging', () => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let context: SqlTagParserContext;

  beforeEach(() => {
    context = new SqlTagParserContext();
  });

  it('should add the limit and offset to the context', () => {
    // Arrange
    const limit = 10;
    const offset = 5;
    const paging = Paging(limit, offset);
    // Act
    paging(context);
    // Assert
    expect(context.values).toEqual([limit, offset]);
  });

  it('should add the limit and offset to the fragment', () => {
    // Arrange
    const limit = 10;
    const offset = 5;
    const paging = Paging(limit, offset);
    // Act
    paging(context);
    // Assert
    expect(context.fragments).toEqual(['LIMIT $1 OFFSET $2']);
  });
});
