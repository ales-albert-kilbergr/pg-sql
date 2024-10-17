import { SqlTagParserContext } from '../../parser-context';
import { In } from './in';

describe('(Unit) In', () => {
  it('should parse the IN clause', () => {
    // Arrange
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const values = [1, 2, 3];
    const context = new SqlTagParserContext();
    // Act
    In(values)(context);
    // Assert
    expect(context.toSqlText()).toEqual('IN ($1, $2, $3)');
    expect(context.values).toEqual(values);
  });
});
