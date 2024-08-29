import { SqlTagParserContext } from '../../parser-context';
import { OrderBy, OrderByDirection, OrderByNulls } from './order-by';

describe('(Unit) OrderBy', () => {
  it('should return the order by clause with the default direction and nulls', () => {
    // Arrange
    const column = 'column';
    const context = new SqlTagParserContext();
    // Act
    OrderBy(column)(context);
    // Assert
    expect(context.fragments).toEqual(['ORDER BY "column" ASC NULLS LAST']);
  });

  it('should return the order by clause with the specified direction and default nulls', () => {
    // Arrange
    const column = 'column';
    const direction = OrderByDirection.DESC;
    const context = new SqlTagParserContext();
    // Act
    OrderBy(column, direction)(context);
    // Assert
    expect(context.fragments).toEqual(['ORDER BY "column" DESC NULLS LAST']);
  });

  it('should return the order by clause with the default direction and specified nulls', () => {
    // Arrange
    const column = 'column';
    const nulls = OrderByNulls.FIRST;
    const context = new SqlTagParserContext();
    // Act
    OrderBy(column, undefined, nulls)(context);
    // Assert
    expect(context.fragments).toEqual(['ORDER BY "column" ASC NULLS FIRST']);
  });

  it('should return multiple order by clauses', () => {
    // Arrange
    const columnOne = 'column_one';
    const columnTwo = 'column_two';
    const context = new SqlTagParserContext();
    // Act
    OrderBy([
      { column: columnOne },
      { column: columnTwo, direction: OrderByDirection.DESC },
    ])(context);
    // Assert
    expect(context.fragments).toEqual([
      'ORDER BY "column_one" ASC NULLS LAST, "column_two" DESC NULLS LAST',
    ]);
  });
});
