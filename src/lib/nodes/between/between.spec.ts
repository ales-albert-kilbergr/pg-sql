/* eslint-disable @typescript-eslint/no-magic-numbers */
import { SqlTagParserContext } from '../../parser-context';
import { Between } from './between';

describe('(Unit) Between', () => {
  it('should add a BETWEEN clause to the context', () => {
    // Arrange
    const context = new SqlTagParserContext();
    // Act
    Between(1, 2)(context);
    // Assert
    expect(context.toSqlText()).toEqual('BETWEEN $1 AND $2');
  });

  it('should extract the values from the between clause', () => {
    // Arrange
    const context = new SqlTagParserContext();
    // Act
    Between(1, 2)(context);
    // Assert
    expect(context.values).toEqual([1, 2]);
  });

  it('should convert bigint values to strings', () => {
    // Arrange
    const context = new SqlTagParserContext();
    // Act
    Between(1n, 2n)(context);
    // Assert
    expect(context.values).toEqual(['1', '2']);
  });

  it('should convert date values to strings', () => {
    // Arrange
    const context = new SqlTagParserContext();
    const date1 = new Date();
    const date2 = new Date();
    // Act
    Between(date1, date2)(context);
    // Assert
    expect(context.values).toEqual([date1.toISOString(), date2.toISOString()]);
  });
});
