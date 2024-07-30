import { SqlTagParserContext } from '../../parser-context';
import { sql } from '../../sql';
import { Exists } from './exists';

describe('(Unit) Exists ', () => {
  it('should build an exists statement', () => {
    // Arrange
    const queryConfig = sql`SELECT * FROM table_name WHERE column_name = :${'value'}`;
    const context = new SqlTagParserContext();
    // Act
    Exists(queryConfig)(context);
    // Assert
    expect(context.fragments).toEqual([
      'SELECT EXISTS (',
      queryConfig.text,
      ') AS "exists"',
    ]);
    expect(context.values).toEqual(['value']);
  });

  it('should update the value index', () => {
    // Arrange
    const queryConfig = sql`SELECT * FROM table_name WHERE column_name = :${'value3'}`;
    const context = new SqlTagParserContext(['$1, $2 ']);
    context.values = ['value1', 'value2'];
    // Act
    Exists(queryConfig)(context);
    // Assert
    expect(context.fragments).toEqual([
      '$1, $2 ',
      'SELECT EXISTS (',
      'SELECT * FROM table_name WHERE column_name = $3',
      ') AS "exists"',
    ]);
    expect(context.values).toEqual(['value1', 'value2', 'value3']);
  });

  it('should set a custom alias', () => {
    // Arrange
    const queryConfig = sql`SELECT * FROM table_name WHERE column_name = :${'value'}`;
    const context = new SqlTagParserContext();
    // Act
    Exists(queryConfig, { as: '"custom_alias"' })(context);
    // Assert
    expect(context.fragments).toEqual([
      'SELECT EXISTS (',
      queryConfig.text,
      ') AS "custom_alias"',
    ]);
    expect(context.values).toEqual(['value']);
  });
});
