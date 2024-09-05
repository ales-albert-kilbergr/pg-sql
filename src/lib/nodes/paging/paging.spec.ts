import { SqlTagParserContext } from '../../parser-context';
import { DEFAULT_PAGING_LIMIT, DEFAULT_PAGING_OFFSET, Paging } from './paging';

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

  it('should add default offset to the context', () => {
    // Arrange
    const limit = 10;
    const paging = Paging(limit);
    // Act
    paging(context);
    // Assert
    expect(context.values).toEqual([limit, DEFAULT_PAGING_OFFSET]);
  });

  it('should add default offset to the fragment', () => {
    // Arrange
    const limit = 10;
    const paging = Paging(limit);
    // Act
    paging(context);
    // Assert
    expect(context.fragments).toEqual(['LIMIT $1 OFFSET $2']);
  });

  it('should add default limit and offset to the context', () => {
    // Arrange
    const paging = Paging();
    // Act
    paging(context);
    // Assert
    expect(context.values).toEqual([
      DEFAULT_PAGING_LIMIT,
      DEFAULT_PAGING_OFFSET,
    ]);
  });

  it('should add default limit and offset to the fragment', () => {
    // Arrange
    const paging = Paging();
    // Act
    paging(context);
    // Assert
    expect(context.fragments).toEqual(['LIMIT $1 OFFSET $2']);
  });

  it('should accept limit and offset as object', () => {
    // Arrange
    const limit = 10;
    const offset = 5;
    const paging = Paging({ limit, offset });
    // Act
    paging(context);
    // Assert
    expect(context.values).toEqual([limit, offset]);
  });

  it('should accept limit as object and default offset', () => {
    // Arrange
    const limit = 10;
    const paging = Paging({ limit });
    // Act
    paging(context);
    // Assert
    expect(context.values).toEqual([limit, DEFAULT_PAGING_OFFSET]);
  });

  it('should accept default limit and offset as object', () => {
    // Arrange
    const paging = Paging({});
    // Act
    paging(context);
    // Assert
    expect(context.values).toEqual([
      DEFAULT_PAGING_LIMIT,
      DEFAULT_PAGING_OFFSET,
    ]);
  });
});
